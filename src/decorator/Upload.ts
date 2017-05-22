import {getMetadataArgsStorage} from "../index";

/**
 * Registers file upload action.
 */
export function Upload() {
    return function(object: Object, propertyName: string) {

        getMetadataArgsStorage().actions.push({
            object: object,
            target: object.constructor,
            method: propertyName,
            type: "upload",
        });
    };
}