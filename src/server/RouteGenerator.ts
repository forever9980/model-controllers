import {AbstractRouteGenerator} from "./AbstractRouteGenerator";
import {getMetadataArgsStorage} from "./index";

export class RouteGenerator extends AbstractRouteGenerator {

    constructor(prefix: string = "") {
        super(prefix, getMetadataArgsStorage().models);
    }

}