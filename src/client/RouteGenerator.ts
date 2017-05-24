import {AbstractRouteGenerator} from "./AbstractRouteGenerator";
import {models} from "./ModelStorage";

export class RouteGenerator extends AbstractRouteGenerator {

    constructor(prefix: string = "") {
        super(prefix, models);
    }

}