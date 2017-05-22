import {getMetadataArgsStorage} from "../index";

/**
 * Gets one model by a criteria object.
 */
export function GetOne() {
    return function(object: Object, propertyName: string) {

        getMetadataArgsStorage().actions.push({
            object: object,
            target: object.constructor,
            method: propertyName,
            type: "get-one",
        });
    };
}