import {getMetadataArgsStorage} from "./index";
import {ModelMetadataArgs} from "./metadata/ModelMetadataArgs";

export class RouteGenerator {

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private prefix: string = "") {
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    getById(model: Function, id: any): string {
        const modelMetadata = this.findModel(model);
        return (this.prefix ? this.prefix + "/" : "") + modelMetadata.name + "/by-id/" + id;
    }

    getByIds(model: Function, ids: any[]): string {
        const modelMetadata = this.findModel(model);
        return (this.prefix ? this.prefix + "/" : "") + modelMetadata.name + "/by-ids/" + ids.join(",");
    }

    getOne(model: Function, criteria: Object): string {
        const modelMetadata = this.findModel(model);
        const criteriaMetadata = this.findModel(criteria.constructor);
        return (this.prefix ? this.prefix + "/" : "") + modelMetadata.name + "/one/" + criteriaMetadata.name + "/?criteria=" + JSON.stringify(criteria);
    }

    getMany(model: Function, criteria?: Object): string {
        const modelMetadata = this.findModel(model);
        const criteriaMetadata = criteria ? this.findModel(criteria.constructor) : undefined;
        return (this.prefix ? this.prefix + "/" : "") +
                modelMetadata.name + "/many" +
                (criteria ? "/" + criteriaMetadata.name + "/?criteria=" + JSON.stringify(criteria) : "");
    }

    getManyAndCount(model: Function, criteria?: Object): string {
        const modelMetadata = this.findModel(model);
        const criteriaMetadata = criteria ? this.findModel(criteria.constructor) : undefined;
        return (this.prefix ? this.prefix + "/" : "") +
                modelMetadata.name + "/many-and-count" +
                (criteria ? "/" + criteriaMetadata.name + "/?criteria=" + JSON.stringify(criteria) : "");
    }

    save(object: Object, criteria?: Object): string;
    save(object: Object[], criteria?: Object): string;
    save(object: Object|Object[], criteria?: Object): string {
        if (object instanceof Array) {
            const modelMetadata = this.findModel(object[0].constructor);
            const criteriaMetadata = criteria ? this.findModel(criteria.constructor) : undefined;
            return (this.prefix ? this.prefix + "/" : "") +
                modelMetadata.name + "/many" +
                (criteria ? "/" + criteriaMetadata.name + "/?criteria=" + JSON.stringify(criteria) : "");
        }

        const modelMetadata = this.findModel(object.constructor);
        const criteriaMetadata = criteria ? this.findModel(criteria.constructor) : undefined;
        return (this.prefix ? this.prefix + "/" : "") +
                modelMetadata.name + "/one" +
                (criteria ? "/" + criteriaMetadata.name + "/?criteria=" + JSON.stringify(criteria) : "");
    }

    saveAndRemove(model: Function, criteria?: Object): string {
        const modelMetadata = this.findModel(model);
        const criteriaMetadata = criteria ? this.findModel(criteria.constructor) : undefined;
        return (this.prefix ? this.prefix + "/" : "") +
                modelMetadata.name + "/save-and-remove" +
                (criteria ? "/" + criteriaMetadata.name + "/?criteria=" + JSON.stringify(criteria) : "");
    }

    remove(model: Function, id: any): string;
    remove(model: Function, ids: any[]): string;
    remove(model: Function, criteria: Object): string;
    remove(model: Function, idOrIdsOrCriteria: any|any[]|Object): string {
        const modelMetadata = this.findModel(model);
        const isCriteria = idOrIdsOrCriteria instanceof Object && this.hasModel(idOrIdsOrCriteria.constructor);
        const criteriaMetadata = isCriteria ? this.findModel(idOrIdsOrCriteria.constructor) : undefined;
        if (isCriteria) {
            return (this.prefix ? this.prefix + "/" : "") +
                modelMetadata.name + "/one" +
                (criteriaMetadata ? "/" + criteriaMetadata.name + "/?criteria=" + JSON.stringify(idOrIdsOrCriteria) : "");

        } else if (idOrIdsOrCriteria instanceof Array) {
            return (this.prefix ? this.prefix + "/" : "") + modelMetadata.name + "/by-ids/" + idOrIdsOrCriteria.join(",");

        } else {
            return (this.prefix ? this.prefix + "/" : "") + modelMetadata.name + "/by-id/" + idOrIdsOrCriteria;

        }
    }

    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------

    protected findModel(model: Function): ModelMetadataArgs { // todo: check if model === [Function]
        const modelMetadata = getMetadataArgsStorage().models.find(modelMetadata => modelMetadata.target === model);
        if (!modelMetadata)
            throw new Error(`Model was not found registered for the ${model}. Did you forget to put @Model decorator on your model?`);

        return modelMetadata;
    }

    protected hasModel(model: Function): boolean {
        return !!getMetadataArgsStorage().models.find(modelMetadata => modelMetadata.target === model);
    }

}