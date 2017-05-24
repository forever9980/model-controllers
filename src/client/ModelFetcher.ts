import {Fetcher} from "./Fetcher";
import {ObjectType} from "./ObjectType";
import {RouteGenerator} from "./RouteGenerator";

export class ModelFetcher<Model> {

    // -------------------------------------------------------------------------
    // Protected Properties
    // -------------------------------------------------------------------------

    protected fetcher: Fetcher;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(public model: ObjectType<Model>,
                protected routeGenerator?: RouteGenerator) {
        this.fetcher = new Fetcher(routeGenerator);
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    getById(model: Function, id: any): Promise<Model> {
        return this.fetcher.getById(this.model, id);
    }

    getByIds(model: Function, ids: any[]): Promise<Model[]> {
        return this.fetcher.getByIds(this.model, ids);
    }

    getOne(model: Function, criteria: Object): Promise<Model> {
        return this.fetcher.getOne(this.model, criteria);
    }

    getMany(model: Function, criteria?: Object): Promise<Model[]> {
        return this.fetcher.getMany(this.model, criteria);
    }

    getManyAndCount(model: Function, criteria?: Object): Promise<[Model[], number]> {
        return this.fetcher.getManyAndCount(this.model, criteria);
    }

    save(object: Object, criteria?: Object): Promise<void>;
    save(object: Object[], criteria?: Object): Promise<void>;
    save(object: Object|Object[], criteria?: Object): Promise<void> {
        return this.fetcher.save(this.model, criteria);
    }

    saveAndRemove(saved: Model[], removedIds: any[], criteria?: Object): Promise<void> {
        return this.fetcher.saveAndRemove(this.model, saved, removedIds, criteria);
    }

    remove(model: Function, id: any): Promise<void>;
    remove(model: Function, ids: any[]): Promise<void>;
    remove(model: Function, criteria: Object): Promise<void>;
    remove(model: Function, idOrIdsOrCriteria: any|any[]|Object) {
        return this.fetcher.remove(this.model, idOrIdsOrCriteria);
    }
}