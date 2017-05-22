import {MetadataArgsStorage} from "./metadata/MetadataArgsStorage";
import {
    Action,
    Body,
    BodyParam,
    getMetadataArgsStorage as getRoutingControllersMetadataArgsStorage,
    OnUndefined
} from "routing-controllers";
import {deserialize} from "class-transformer";
import {CriteriaRequiredError} from "./error/CriteriaRequiredError";
import {ModelMetadataArgs} from "./metadata/ModelMetadataArgs";
import {IdRequiredError} from "./error/IdRequiredError";
import {IdsRequiredError} from "./error/IdsRequiredError";
import {ActionMetadata} from "routing-controllers/metadata/ActionMetadata";

export * from "./decorator/ModelController";
export * from "./decorator/GetById";
export * from "./decorator/GetMany";
export * from "./decorator/GetManyAndCount";
export * from "./decorator/GetOne";
export * from "./decorator/Remove";
export * from "./decorator/Save";
export * from "./decorator/Upload";

/**
 * Gets metadata args storage.
 * Metadata args storage follows the best practices and stores metadata in a global variable.
 */
export function getMetadataArgsStorage(): MetadataArgsStorage {
    if (!(global as any).modelControllersMetadataArgsStorage)
        (global as any).modelControllersMetadataArgsStorage = new MetadataArgsStorage();

    return (global as any).modelControllersMetadataArgsStorage;
}

export function registerControllers() {
    const storage = getMetadataArgsStorage();
    storage.controllers.forEach(controller => {
        const model = storage.models.find(model => model.target === controller.model);
        if (!model)
            throw new Error(`Model was not found registered for the ${controller.target.name}. Did you forget to put @Model on your controller model?`);

        const route = "/" + model.name;
        getRoutingControllersMetadataArgsStorage().controllers.push({
            target: controller.target,
            type: "json",
            route: route
        });
    });
    // todo: implement save many for save one without save many defined
    storage.actions.forEach(action => {
        const criteria = (Reflect as any).getMetadata("design:paramtypes", action.object, action.method)[0];
        const paramType = criteria;

        const controller = storage.controllers.find(controller => controller.target === action.target);
        if (!controller)
            throw new Error(`Controller was not found registered for the ${action.target.name}#${action.method}. Did you forget to put @ModelController on it?`);

        const controllerModel = storage.models.find(model => model.target === controller.model);
        if (!controllerModel)
            throw new Error(`Model was not found registered for the ${controller.target.name}. Did you forget to put @Model on your controller model?`);

        let criteriaModel: ModelMetadataArgs;
        if (criteria && criteria !== controllerModel.target && criteria !== Array) {
            criteriaModel = storage.models.find(model => model.target === criteria);
            // if (!criteriaModel)
            //     throw new Error(`Model was not found registered for the ${action.target.name}#${action.method}. Did you forget to put @Model on your criteria class?`);
        }

        if (action.type === "save-one") {
            const savedObjectIndex = criteriaModel ? 1 : 0;
            const savedObject = (Reflect as any).getMetadata("design:paramtypes", action.object, action.method)[savedObjectIndex];
            if (savedObject === Array) {
                action.type = "save-many"; // better code please
            }
        }

        if (action.type === "remove") {
            const removedObject = (Reflect as any).getMetadata("design:paramtypes", action.object, action.method)[0];
            if (!criteriaModel && removedObject === Array) {
                action.type = "remove-by-ids"; // better code please

            } else if (!criteriaModel) {
                action.type = "remove-by-id"; // better code please
            }
        }

        let actionType: string, actionName: string, hasId: boolean = false, hasIds = false;
        switch (action.type) {
            case "get-by-id":
                actionName = "by-id";
                actionType = "get";
                hasId = true;
                break;

            case "get-one":
                actionName = "one";
                actionType = "get";
                break;

            case "get-many":
                actionName = "many";
                actionType = "get";
                break;

            case "get-many-and-count":
                actionName = "many-and-count";
                actionType = "get";
                break;

            case "save-one":
                actionName = "one";
                actionType = "post";
                break;

            case "save-many":
                actionName = "many";
                actionType = "post";
                break;

            case "save-and-remove":
                actionName = "save-and-remove";
                actionType = "post";
                break;

            case "upload":
                actionName = "upload";
                actionType = "post";
                break;

            case "remove":
                actionName = "one";
                actionType = "delete";
                break;

            case "remove-by-id":
                actionName = "by-id";
                actionType = "delete";
                hasId = true;
                break;

            case "remove-by-ids":
                actionName = "by-ids";
                actionType = "delete";
                hasIds = true;
                break;
        }
        const route = "/" + actionName + (criteriaModel ? "/" + criteriaModel.name : "") + (hasId ? "/:id" : "") + (hasIds ? "/:ids" : "");
        const fullRoute = "/" + controllerModel.name + route;
        const appendParamsFactory = (actionProperties: Action) => {
            const allParams: any = [];
            if (hasId) {
                let idParamValue = (actionProperties.context || actionProperties.request).params["id"];
                if (!idParamValue)
                    throw new IdRequiredError(actionType, fullRoute);
                if (paramType === Number)
                    idParamValue = +idParamValue;
                if (!idParamValue)
                    throw new IdRequiredError(actionType, fullRoute);
                allParams.push(idParamValue);

            } else if (hasIds) {
                let idParamValue = (actionProperties.context || actionProperties.request).params["ids"];
                if (!idParamValue)
                    throw new IdsRequiredError(actionType, "todo"); // todo

                allParams.push(idParamValue.split(","));

            } else if (criteriaModel) {
                const queryParam = (actionProperties.context || actionProperties.request).query["criteria"];
                if (!queryParam)
                    throw new CriteriaRequiredError(criteriaModel.name, actionType, fullRoute);

                const criteriaValue = deserialize(criteria as any, queryParam);
                allParams.push(criteriaValue);
            }
            return allParams;
        };
        if (action.type === "get-by-id") {
            const idsFullRoute = "/by-ids" + (criteriaModel ? "/" + criteriaModel.name : "") + "/:ids";
            getRoutingControllersMetadataArgsStorage().actions.push({
                target: action.target,
                method: action.method,
                methodOverride: (actionMetadata: ActionMetadata, actionProperties: Action, params: any[]) => {

                    const idParamValue = (actionProperties.context || actionProperties.request).params["ids"];
                    if (!idParamValue)
                        throw new IdsRequiredError(actionType, idsFullRoute);

                    return Promise.all(idParamValue.split(",").map(value => {
                        if (paramType === Number)
                            value = +value;
                        if (!value)
                            throw new IdRequiredError(actionType, idsFullRoute);

                        return actionMetadata.callMethod([value].concat(params));
                    }));
                },
                type: actionType as any,
                route: idsFullRoute,
            });
        }

        console.log(route);
        getRoutingControllersMetadataArgsStorage().actions.push({
            target: action.target,
            method: action.method,
            type: actionType as any,
            route: route,
            appendParams: appendParamsFactory
        });


        if (action.type === "save-one") {
            Body()(action.object, action.method, criteriaModel ? 1 : 0);

        } else if (action.type === "save-many") {
            Body({ type: controllerModel.target })(action.object, action.method, criteriaModel ? 1 : 0);

        } else if (action.type === "save-and-remove") {
            BodyParam("save"/*, { type: controllerModel.target }*/)(action.object, action.method, criteriaModel ? 1 : 0);
            BodyParam("remove"/*, { type: controllerModel.target }*/)(action.object, action.method, criteriaModel ? 2 : 1);
        }

        if (action.type === "remove" || action.type === "remove-by-id" || action.type === "remove-by-ids") {
            OnUndefined(204)(action.object, action.method);
        }

    });
}