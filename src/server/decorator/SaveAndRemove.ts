import {getMetadataArgsStorage} from "../index";

/**
 * Register save many and remove many action for the controller's model.
 */
export function SaveAndRemove() {
    return function(object: Object, propertyName: string) {

        getMetadataArgsStorage().actions.push({
            object: object,
            target: object.constructor,
            method: propertyName,
            type: "save-and-remove",
        });
    };
}