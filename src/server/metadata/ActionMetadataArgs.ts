
export interface ActionMetadataArgs {

    object: Object;

    target: Function;

    method: string;

    type?: "get-by-id"|"get-one"|"get-many"|"get-many-and-count"|"save-many"|"remove"|"remove-by-id"|"remove-by-ids"|"save-one"|"upload"|"save-and-remove";

}