import {getMetadataArgsStorage} from "../index";

export function Remove() {
    return function(object: Object, propertyName: string) {

        getMetadataArgsStorage().actions.push({
            object: object,
            target: object.constructor,
            method: propertyName,
            type: "remove",
        });
    };
}