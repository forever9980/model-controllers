import {RouteGenerator} from "./RouteGenerator";
import {ObjectType} from "./ObjectType";
import {ModelFetcher} from "./ModelFetcher";
import {plainToClass, plainToClassFromExist} from "class-transformer";

export class Fetcher {

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(protected routeGenerator?: RouteGenerator) {
        if (!routeGenerator)
            this.routeGenerator = new RouteGenerator("");
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    subscribeById<Model>(model: ObjectType<Model>, id: any): Promise<Model> {
        return fetch(this.routeGenerator.getById(model, id))
            .then(response => response.json())
            .then(result => plainToClass(model, result as Model));
    }

    getFor<Model>(model: ObjectType<Model>): ModelFetcher<Model> {
        return new ModelFetcher(model, this.routeGenerator);
    }

    getById<Model>(model: ObjectType<Model>, id: any): Promise<Model> {
        return fetch(this.routeGenerator.getById(model, id))
            .then(response => response.json())
            .then(result => plainToClass(model, result as Model));
    }

    getByIds<Model>(model: ObjectType<Model>, ids: any[]): Promise<Model[]> {
        return fetch(this.routeGenerator.getByIds(model, ids))
            .then(response => response.json())
            .then(result => plainToClass(model, result as Model[]));
    }

    getOne<Model>(model: ObjectType<Model>, criteria: Object): Promise<Model> {
        return fetch(this.routeGenerator.getOne(model, criteria))
            .then(response => response.json())
            .then(result => plainToClass(model, result as Model));
    }

    getMany<Model>(model: ObjectType<Model>, criteria?: Object): Promise<Model[]> {
        return fetch(this.routeGenerator.getMany(model, criteria))
            .then(response => response.json())
            .then(result => plainToClass(model, result as Model[]));
    }

    getManyAndCount<Model>(model: ObjectType<Model>, criteria?: Object): Promise<[Model[], number]> {
        return fetch(this.routeGenerator.getManyAndCount(model, criteria))
            .then(response => response.json())
            .then(result => {
                const [firstResult, secondResult] = result;
                if (firstResult)
                    return [plainToClass(model, firstResult as Model[]), secondResult || 0];

                return [[], secondResult || 0];
            });
    }

    save<T>(object: T, criteria?: Object): Promise<void>;
    save<T>(object: T[], criteria?: Object): Promise<void>;
    save<T>(object: T|T[], criteria?: Object): Promise<void> {
        return fetch(this.routeGenerator.save(object, criteria))
            .then(response => response.json())
            .then(result => {
                if (object instanceof Array) {
                    if (object.length === result.length) {
                        object.forEach((obj, index) => {
                            if (result[index])
                                plainToClassFromExist(obj, result[index]);
                        });
                    }

                } else if (result) {
                    plainToClassFromExist(object, result);
                }
            });
    }

    saveAndRemove<Model>(model: ObjectType<Model>, saved: Model[], removedIds: any[], criteria?: Object): Promise<void> {
        return fetch(this.routeGenerator.saveAndRemove(model, criteria))
            .then(response => response.json())
            .then(result => {
                if (saved.length === result.length) {
                    saved.forEach((obj, index) => {
                        if (result[index])
                            plainToClassFromExist(obj, result[index]);
                    });
                }
            });
    }

    remove<Model>(model: ObjectType<Model>, id: any): Promise<void>;
    remove<Model>(model: ObjectType<Model>, ids: any[]): Promise<void>;
    remove<Model>(model: ObjectType<Model>, criteria: Object): Promise<void>;
    remove<Model>(model: ObjectType<Model>, idOrIdsOrCriteria: any|any[]|Object): Promise<void> {
        return fetch(this.routeGenerator.remove(model, idOrIdsOrCriteria))
            .then(response => {});
    }

}