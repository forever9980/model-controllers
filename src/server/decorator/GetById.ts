import {getMetadataArgsStorage} from "../index";

/**
 * Gets one model by requested id.
 */
export function GetById() {
    return function(object: Object, propertyName: string) {

        getMetadataArgsStorage().actions.push({
            object: object,
            target: object.constructor,
            method: propertyName,
            type: "get-by-id",
        });
    };
}