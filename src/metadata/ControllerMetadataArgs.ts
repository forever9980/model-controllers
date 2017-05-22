import {ObjectType} from "../../temp/type/ObjectType";

export interface ControllerMetadataArgs {

    target: Function;

    model?: ObjectType<any>;

}