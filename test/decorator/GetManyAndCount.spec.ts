import "reflect-metadata";
import {ModelController} from "../../src/decorator/ModelController";
import {Model} from "../../src/decorator/Model";
import {createExpressServer} from "routing-controllers";
import {RouteGenerator} from "../../src/RouteGenerator";
import {getMetadataArgsStorage, registerControllers} from "../../src/index";
import {GetManyAndCount} from "../../src/decorator/GetManyAndCount";
const chakram = require("chakram");
const expect = chakram.expect;

describe("decorators > GetManyAndCount", () => {

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

            @GetManyAndCount()
            manyAndCount() {
                return [[
                    new Question(1, "Question #1", ""),
                    new Question(2, "Question #2", ""),
                ], 2];
            }

            @GetManyAndCount()
            manyAndCountByTitle(criteria: QuestionByTitleCriteria) {
                return [[
                    new Question(1, "Question " + criteria.title + " #1", ""),
                    new Question(2, "Question " + criteria.title + " #2", ""),
                    new Question(3, "Question " + criteria.title + " #3", ""),
                ], 5];
            }

            @GetManyAndCount()
            manyAndCountByText(criteria: QuestionByTextCriteria) {
                return [[
                    new Question(1, "", "Question " + criteria.text + " #1"),
                    new Question(2, "", "Question " + criteria.text + " #2"),
                    new Question(3, "", "Question " + criteria.text + " #3"),
                ], 5];
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

    it("should give many questions and count without criteria object provided", async () => {
        const response = await chakram.get(routeGenerator.getManyAndCount(QuestionCls));
        expect(response).to.be.status(200);
        expect(response).to.have.header("content-type", "application/json; charset=utf-8");
        expect(response.body[0][0].id).to.be.equal(1);
        expect(response.body[0][0].title).to.be.equal("Question #1");
        expect(response.body[0][0].text).to.be.equal("");
        expect(response.body[0][1].id).to.be.equal(2);
        expect(response.body[0][1].title).to.be.equal("Question #2");
        expect(response.body[0][1].text).to.be.equal("");
        expect(response.body[1]).to.be.equal(2);
    });

    it("should give many questions and count by a given criteria object", async () => {
        const criteria = new QuestionByTitleCriteriaCls();
        criteria.title = "hello";
        const response = await chakram.get(routeGenerator.getManyAndCount(QuestionCls, criteria));
        expect(response).to.be.status(200);
        expect(response).to.have.header("content-type", "application/json; charset=utf-8");
        expect(response.body[0][0].id).to.be.equal(1);
        expect(response.body[0][0].title).to.be.equal("Question hello #1");
        expect(response.body[0][0].text).to.be.equal("");
        expect(response.body[0][1].id).to.be.equal(2);
        expect(response.body[0][1].title).to.be.equal("Question hello #2");
        expect(response.body[0][1].text).to.be.equal("");
        expect(response.body[0][2].id).to.be.equal(3);
        expect(response.body[0][2].title).to.be.equal("Question hello #3");
        expect(response.body[0][2].text).to.be.equal("");
        expect(response.body[1]).to.be.equal(5);
    });

    it("should give many questions and count by a given another criteria object", async () => {
        const criteria = new QuestionByTextCriteriaCls();
        criteria.text = "bye";
        const response = await chakram.get(routeGenerator.getManyAndCount(QuestionCls, criteria));
        expect(response).to.be.status(200);
        expect(response).to.have.header("content-type", "application/json; charset=utf-8");
        expect(response.body[0][0].id).to.be.equal(1);
        expect(response.body[0][0].title).to.be.equal("");
        expect(response.body[0][0].text).to.be.equal("Question bye #1");
        expect(response.body[0][1].id).to.be.equal(2);
        expect(response.body[0][1].title).to.be.equal("");
        expect(response.body[0][1].text).to.be.equal("Question bye #2");
        expect(response.body[0][2].id).to.be.equal(3);
        expect(response.body[0][2].title).to.be.equal("");
        expect(response.body[0][2].text).to.be.equal("Question bye #3");
        expect(response.body[1]).to.be.equal(5);
    });

});