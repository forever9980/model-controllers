import "reflect-metadata";
import {ModelController} from "../../src/decorator/ModelController";
import {Model} from "../../src/decorator/Model";
import {createExpressServer} from "routing-controllers";
import {RouteGenerator} from "../../src/RouteGenerator";
import {getMetadataArgsStorage, registerControllers} from "../../src/index";
import {SaveAndRemove} from "../../src/decorator/SaveAndRemove";
const chakram = require("chakram");
const expect = chakram.expect;

describe("decorators > SaveAndRemove", () => {

    // -------------------------------------------------------------------------
    // Definitions
    // -------------------------------------------------------------------------

    let allSavedQuestions: any[], allRemovedQuestions: any[];
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

            @SaveAndRemove()
            save(savedQuestions: Question[], removedQuestions: Question[]) {
                allSavedQuestions = savedQuestions;
                allRemovedQuestions = removedQuestions;
                return savedQuestions.map(question => Object.assign(question, { id: 1 }));
            }

            @SaveAndRemove()
            saveManyByTitle(criteria: QuestionByTitleCriteria, savedQuestions: Question[], removedQuestions: Question[]) {
                allSavedQuestions = savedQuestions;
                allRemovedQuestions = removedQuestions;
                return savedQuestions.map((question, index) => Object.assign(question, { id: index, title: criteria.title + " #" + index }));
            }

            @SaveAndRemove()
            saveManyByText(criteria: QuestionByTextCriteria, savedQuestions: Question[], removedQuestions: Question[]) {
                allSavedQuestions = savedQuestions;
                allRemovedQuestions = removedQuestions;
                return savedQuestions.map((question, index) => Object.assign(question, { id: index, text: criteria.text + " #" + index }));
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

    it("should save many questions without criteria object provided", async () => {
        const newQuestions = [
            new QuestionCls(undefined, "My Question #1", "Question Text #1"),
            new QuestionCls(undefined, "My Question #2", "Question Text #2"),
            new QuestionCls(undefined, "My Question #3", "Question Text #3"),
        ];
        const removedQuestions = [1, 2, 3];
        const response = await chakram.post(routeGenerator.saveAndRemove(QuestionCls), { save: newQuestions, remove: removedQuestions });
        expect(response).to.be.status(200);
        expect(response).to.have.header("content-type", "application/json; charset=utf-8");
        expect(response.body[0].id).to.be.equal(1);
        expect(response.body[0].title).to.be.equal("My Question #1");
        expect(response.body[0].text).to.be.equal("Question Text #1");
        expect(response.body[1].id).to.be.equal(1);
        expect(response.body[1].title).to.be.equal("My Question #2");
        expect(response.body[1].text).to.be.equal("Question Text #2");
        expect(response.body[2].id).to.be.equal(1);
        expect(response.body[2].title).to.be.equal("My Question #3");
        expect(response.body[2].text).to.be.equal("Question Text #3");
        expect(allRemovedQuestions).to.be.eql(removedQuestions);
    });

    it("should save many questions by a given criteria object", async () => {
        const newQuestions = [
            new QuestionCls(undefined, "My Question #1", "Question Text #1"),
            new QuestionCls(undefined, "My Question #2", "Question Text #2"),
            new QuestionCls(undefined, "My Question #3", "Question Text #3"),
        ];
        const removedQuestions = [9, 8, 7];
        const criteria = new QuestionByTitleCriteriaCls();
        criteria.title = "hello";
        const response = await chakram.post(routeGenerator.saveAndRemove(QuestionCls, criteria), { save: newQuestions, remove: removedQuestions });
        expect(response).to.be.status(200);
        expect(response).to.have.header("content-type", "application/json; charset=utf-8");
        expect(response.body[0].id).to.be.equal(0);
        expect(response.body[0].title).to.be.equal("hello #0");
        expect(response.body[0].text).to.be.equal("Question Text #1");
        expect(response.body[1].id).to.be.equal(1);
        expect(response.body[1].title).to.be.equal("hello #1");
        expect(response.body[1].text).to.be.equal("Question Text #2");
        expect(response.body[2].id).to.be.equal(2);
        expect(response.body[2].title).to.be.equal("hello #2");
        expect(response.body[2].text).to.be.equal("Question Text #3");
        expect(allRemovedQuestions).to.be.eql(removedQuestions);
    });

    it("should save many questions by a given another criteria object", async () => {
        const newQuestions = [
            new QuestionCls(undefined, "My Question #1", "Question Text #1"),
            new QuestionCls(undefined, "My Question #2", "Question Text #2"),
            new QuestionCls(undefined, "My Question #3", "Question Text #3"),
        ];
        const removedQuestions = [6, 7, 8];
        const criteria = new QuestionByTextCriteriaCls();
        criteria.text = "bye";
        const response = await chakram.post(routeGenerator.saveAndRemove(QuestionCls, criteria), { save: newQuestions, remove: removedQuestions });
        expect(response).to.be.status(200);
        expect(response).to.have.header("content-type", "application/json; charset=utf-8");
        expect(response.body[0].id).to.be.equal(0);
        expect(response.body[0].title).to.be.equal("My Question #1");
        expect(response.body[0].text).to.be.equal("bye #0");
        expect(response.body[1].id).to.be.equal(1);
        expect(response.body[1].title).to.be.equal("My Question #2");
        expect(response.body[1].text).to.be.equal("bye #1");
        expect(response.body[2].id).to.be.equal(2);
        expect(response.body[2].title).to.be.equal("My Question #3");
        expect(response.body[2].text).to.be.equal("bye #2");
        expect(allRemovedQuestions).to.be.eql(removedQuestions);
    });

});