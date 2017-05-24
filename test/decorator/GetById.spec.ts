import "reflect-metadata";
import {ModelController} from "../../src/server/decorator/ModelController";
import {Model} from "../../src/server/decorator/Model";
import {GetById} from "../../src/server/decorator/GetById";
import {createExpressServer} from "routing-controllers";
import {getMetadataArgsStorage, registerControllers} from "../../src/server/index";
import {RouteGenerator} from "../../src/server/RouteGenerator";
const chakram = require("chakram");
const expect = chakram.expect;

describe("decorators > GetById", () => {

    // -------------------------------------------------------------------------
    // Definitions
    // -------------------------------------------------------------------------

    let QuestionCls: any;
    before(() => {

        // reset metadata args storage
        getMetadataArgsStorage().reset();

        @Model("Question")
        class Question {

            id: number;
            title: string;

            constructor(id: number, title: string) {
                this.id = id;
                this.title = title;
            }

        }

        @ModelController(Question)
        class QuestionController {

            @GetById()
            oneById(id: number) {
                return new Question(id, "Hello Question #" + id);
            }
        }

        QuestionCls = Question;
    });

    // -------------------------------------------------------------------------
    // Setup
    // -------------------------------------------------------------------------

    let expressApp: any;
    before(() => registerControllers());
    before(cb => expressApp = createExpressServer().listen(3001, cb));
    after(done => expressApp.close(done));
    const routeGenerator = new RouteGenerator("http://127.0.0.1:3001");

    // -------------------------------------------------------------------------
    // Assertions
    // -------------------------------------------------------------------------

    it("should give question by a given question id", async () => {
        const response = await chakram.get(routeGenerator.getById(QuestionCls, 1));
        expect(response).to.be.status(200);
        expect(response).to.have.header("content-type", "application/json; charset=utf-8");
        expect(response.body.id).to.be.equal(1);
        expect(response.body.title).to.be.equal("Hello Question #1");
    });

    it("should give questions by a given question ids", async () => {
        const response = await chakram.get(routeGenerator.getByIds(QuestionCls, [1, 3, 9]));
        expect(response).to.be.status(200);
        expect(response).to.have.header("content-type", "application/json; charset=utf-8");
        expect(response.body[0].id).to.be.equal(1);
        expect(response.body[0].title).to.be.equal("Hello Question #1");
        expect(response.body[1].id).to.be.equal(3);
        expect(response.body[1].title).to.be.equal("Hello Question #3");
        expect(response.body[2].id).to.be.equal(9);
        expect(response.body[2].title).to.be.equal("Hello Question #9");
    });

});