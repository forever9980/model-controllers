import {models} from "./ModelStorage";

/**
 * Registers a model with a given name.
 */
export function Model(name: string) {
    return function(target: Function) {

        if (!models.find(model => model.target === target))
            models.push({ target: target, name: name });
    };
}