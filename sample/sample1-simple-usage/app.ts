import "reflect-metadata";
import {createExpressServer} from "routing-controllers";
import {registerControllers} from "../../src/index";
import "./controller/PostController";

registerControllers(/*{
    controllers: [
        PostController
    ]
}*/);
createExpressServer({
    controllers: [
    ]
}).listen(3000);