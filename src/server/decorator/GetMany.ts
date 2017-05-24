import {getMetadataArgsStorage} from "../index";

/**
 * Gets array of models.
 * If criteria is given then models are given for the given criteria.
 */
export function GetMany() {
    return function(object: Object, propertyName: string) {

        getMetadataArgsStorage().actions.push({
            object: object,
            target: object.constructor,
            method: propertyName,
            type: "get-many",
        });
    };
}