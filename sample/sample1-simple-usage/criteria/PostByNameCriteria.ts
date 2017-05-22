import {Model} from "../../../src/decorator/Model";

@Model("post-by-name")
export class PostByNameCriteria {
    name: string;
}