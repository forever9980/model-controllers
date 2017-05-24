import {getMetadataArgsStorage} from "../index";

/**
 * Register save action for the controller's model.
 * Criteria can be used to perform conditional save.
 */
export function Save() {
    return function(object: Object, propertyName: string) {
        getMetadataArgsStorage().actions.push({
            object: object,
            target: object.constructor,
            method: propertyName,
            type: "save-one",
        });

    };
}