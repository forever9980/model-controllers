import {getMetadataArgsStorage} from "../index";

/**
 * Gets array of models and overall number of models that match criteria.
 * If criteria is given then models are given for the given criteria.
 */
export function GetManyAndCount() {
    return function(object: Object, propertyName: string) {

        getMetadataArgsStorage().actions.push({
            object: object,
            target: object.constructor,
            method: propertyName,
            type: "get-many-and-count",
        });
    };
}