import "reflect-metadata";
import {ModelController} from "../../src/decorator/ModelController";
import {Model} from "../../src/decorator/Model";
import {createExpressServer} from "routing-controllers";
import {RouteGenerator} from "../../src/RouteGenerator";
import {getMetadataArgsStorage, registerControllers} from "../../src/index";
import {GetOne} from "../../src/decorator/GetOne";
const chakram = require("chakram");
const expect = chakram.expect;

describe("decorators > GetOne", () => {

    // -------------------------------------------------------------------------
    // Definitions
    // -------------------------------------------------------------------------

    let QuestionCls: any, QuestionByTitleCriteriaCls: any, QuestionByTextCriteriaCls: any;
    before(() => {

        // reset metadata args storage
        getMetadataArgsStorage().reset();

        @Model("Question")
        class Question {

            id: number;
            title: string;
            text: string;

            constructor(id: number, title: string, text: string) {
                this.id = id;
                this.title = title;
                this.text = text;
            }

        }

        @Model("QuestionByTitleCriteria")
        class QuestionByTitleCriteria {
            title: string;
        }

        @Model("QuestionByTextCriteria")
        class QuestionByTextCriteria {
            text: string;
        }

        @ModelController(Question)
        class QuestionController {

            @GetOne()
            oneByTitle(criteria: QuestionByTitleCriteria) {
                return new Question(1, "Given title: " + criteria.title, "");
            }

            @GetOne()
            oneByText(criteria: QuestionByTextCriteria) {
                return new Question(2, "", "Given text: " + criteria.text);
            }

        }

        QuestionCls = Question;
        QuestionByTitleCriteriaCls = QuestionByTitleCriteria;
        QuestionByTextCriteriaCls = QuestionByTextCriteria;
    });

    // -------------------------------------------------------------------------
    // Setup
    // -------------------------------------------------------------------------

    let expressApp: any;
    before(() => registerControllers());
    before(cb => expressApp = createExpressServer().listen(3001, cb));
    after(cb => expressApp.close(cb));
    const routeGenerator = new RouteGenerator("http://127.0.0.1:3001");

    // -------------------------------------------------------------------------
    // Assertions
    // -------------------------------------------------------------------------

    it("should give one question by a given criteria object", async () => {
        const criteria = new QuestionByTitleCriteriaCls();
        criteria.title = "hello";
        const response = await chakram.get(routeGenerator.getOne(QuestionCls, criteria));
        expect(response).to.be.status(200);
        expect(response).to.have.header("content-type", "application/json; charset=utf-8");
        expect(response.body.id).to.be.equal(1);
        expect(response.body.title).to.be.equal("Given title: hello");
        expect(response.body.text).to.be.equal("");
    });

    it("should give one question by a given another criteria object", async () => {
        const criteria = new QuestionByTextCriteriaCls();
        criteria.text = "hello";
        const response = await chakram.get(routeGenerator.getOne(QuestionCls, criteria));
        expect(response).to.be.status(200);
        expect(response).to.have.header("content-type", "application/json; charset=utf-8");
        expect(response.body.id).to.be.equal(2);
        expect(response.body.title).to.be.equal("");
        expect(response.body.text).to.be.equal("Given text: hello");
    });

});