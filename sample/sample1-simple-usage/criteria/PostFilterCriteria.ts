import {Model} from "../../../src/decorator/Model";

@Model("post-filter")
export class PostFilterCriteria {
    limit: number;
    offset: number;
}