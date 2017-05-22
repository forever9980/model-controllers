import {ActionMetadataArgs} from "./ActionMetadataArgs";
import {ModelMetadataArgs} from "./ModelMetadataArgs";
import {ControllerMetadataArgs} from "./ControllerMetadataArgs";

export class MetadataArgsStorage {

    actions: ActionMetadataArgs[] = [];
    models: ModelMetadataArgs[] = [];
    controllers: ControllerMetadataArgs[] = [];

    /**
     * Removes all saved metadata.
     */
    reset() {
        this.controllers = [];
        this.models = [];
        this.actions = [];
    }

}