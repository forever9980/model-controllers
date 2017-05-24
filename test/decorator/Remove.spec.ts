import "reflect-metadata";
import {ModelController} from "../../src/server/decorator/ModelController";
import {Model} from "../../src/server/decorator/Model";
import {createExpressServer} from "routing-controllers";
import {getMetadataArgsStorage, registerControllers} from "../../src/server/index";
import {Remove} from "../../src/server/decorator/Remove";
import {RouteGenerator} from "../../src/server/RouteGenerator";
const chakram = require("chakram");
const expect = chakram.expect;

describe("decorators > Remove", () => {

    // -------------------------------------------------------------------------
    // Definitions
    // -------------------------------------------------------------------------

    let removedQuestionId: any, removedQuestionIds: any, removedQuestionCriteria: any;
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

            @Remove()
            removeById(id: number) {
                removedQuestionId = id;
            }

            @Remove()
            removeByIds(ids: number[]) {
                removedQuestionIds = ids;
            }

            @Remove()
            removeByTitle(criteria: QuestionByTitleCriteria) {
                removedQuestionCriteria = criteria;
            }

            @Remove()
            removeByText(criteria: QuestionByTextCriteria) {
                removedQuestionCriteria = criteria;
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

    it("should remove question by a given id", async () => {
        const response = await chakram.delete(routeGenerator.remove(QuestionCls, 154));
        expect(response).to.be.status(204);
        expect(removedQuestionId).to.be.equal(154);
    });

    it("should remove questions by a given ids", async () => {
        const response = await chakram.delete(routeGenerator.remove(QuestionCls, [765, 543]));
        expect(response).to.be.status(204);
        expect(removedQuestionIds).to.be.eql(["765", "543"]);
    });

    it("should remove questions by a criteria", async () => {
        const criteria = new QuestionByTitleCriteriaCls();
        criteria.title = "my question";
        const response = await chakram.delete(routeGenerator.remove(QuestionCls, criteria));
        expect(response).to.be.status(204);
        expect(removedQuestionCriteria).to.be.eql(criteria);
    });

    it("should remove questions by a another criteria", async () => {
        const criteria = new QuestionByTextCriteriaCls();
        criteria.text = "question text";
        const response = await chakram.delete(routeGenerator.remove(QuestionCls, criteria));
        expect(response).to.be.status(204);
        expect(removedQuestionCriteria).to.be.eql(criteria);
    });

});