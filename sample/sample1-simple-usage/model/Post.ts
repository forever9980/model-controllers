import {Model} from "../../../src/decorator/Model";

@Model("post")
export class Post {

    id: number;
    title: string;
    text: string;
    authorName: string;

}