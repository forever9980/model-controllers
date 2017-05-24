import "reflect-metadata";
import {ModelController} from "../../src/server/decorator/ModelController";
import {Model} from "../../src/server/decorator/Model";
import {createExpressServer} from "routing-controllers";
import {getMetadataArgsStorage, registerControllers} from "../../src/server/index";
import {Save} from "../../src/server/decorator/Save";
import {RouteGenerator} from "../../src/server/RouteGenerator";
const chakram = require("chakram");
const expect = chakram.expect;

describe("decorators > Save", () => {

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

            @Save()
            save(question: Question) {
                return Object.assign(question, { id: 1 });
            }

            @Save()
            saveByTitle(criteria: QuestionByTitleCriteria, question: Question) {
                return Object.assign(question, { title: "awesome title" });
            }

            @Save()
            saveByText(criteria: QuestionByTextCriteria, question: Question) {
                return Object.assign(question, { text: "awesome text" });
            }

            @Save()
            saveMany(questions: Question[]) {
                return questions.map((question, index) => Object.assign(question, { id: index }));
            }

            @Save()
            saveManyByTitle(criteria: QuestionByTitleCriteria, questions: Question[]) {
                return questions.map((question, index) => Object.assign(question, { id: index, title: criteria.title + " #" + index }));
            }

            @Save()
            saveManyByText(criteria: QuestionByTextCriteria, questions: Question[]) {
                return questions.map((question, index) => Object.assign(question, { id: index, text: criteria.text + " #" + index }));
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

    it("should save question without criteria object provided", async () => {
        const question = new QuestionCls(undefined, "My Question", "Question Text");
        const response = await chakram.post(routeGenerator.save(question), question);
        expect(response).to.be.status(200);
        expect(response).to.have.header("content-type", "application/json; charset=utf-8");
        expect(response.body.id).to.be.equal(1);
        expect(response.body.title).to.be.equal("My Question");
        expect(response.body.text).to.be.equal("Question Text");
    });

    it("should save question by a given criteria object", async () => {
        const question = new QuestionCls(undefined, "My Question", "Question Text");
        const criteria = new QuestionByTitleCriteriaCls();
        criteria.title = "hello";
        const response = await chakram.post(routeGenerator.save(question, criteria), question);
        expect(response).to.be.status(200);
        expect(response).to.have.header("content-type", "application/json; charset=utf-8");
        expect(response.body.title).to.be.equal("awesome title");
        expect(response.body.text).to.be.equal("Question Text");
    });

    it("should save question by a given another criteria object", async () => {
        const question = new QuestionCls(undefined, "My Question", "Question Text");
        const criteria = new QuestionByTextCriteriaCls();
        criteria.text = "bye";
        const response = await chakram.post(routeGenerator.save(question, criteria), question);
        expect(response).to.be.status(200);
        expect(response).to.have.header("content-type", "application/json; charset=utf-8");
        expect(response.body.title).to.be.equal("My Question");
        expect(response.body.text).to.be.equal("awesome text");
    });

    it("should save many questions without criteria object provided", async () => {
        const questions = [
            new QuestionCls(undefined, "My Question #1", "Question Text #1"),
            new QuestionCls(undefined, "My Question #2", "Question Text #2"),
            new QuestionCls(undefined, "My Question #3", "Question Text #3"),
        ];
        const response = await chakram.post(routeGenerator.save(questions), questions);
        expect(response).to.be.status(200);
        expect(response).to.have.header("content-type", "application/json; charset=utf-8");
        expect(response.body[0].id).to.be.equal(0);
        expect(response.body[0].title).to.be.equal("My Question #1");
        expect(response.body[0].text).to.be.equal("Question Text #1");
        expect(response.body[1].id).to.be.equal(1);
        expect(response.body[1].title).to.be.equal("My Question #2");
        expect(response.body[1].text).to.be.equal("Question Text #2");
        expect(response.body[2].id).to.be.equal(2);
        expect(response.body[2].title).to.be.equal("My Question #3");
        expect(response.body[2].text).to.be.equal("Question Text #3");
    });

    it("should save many questions by a given criteria object", async () => {
        const questions = [
            new QuestionCls(undefined, "My Question #1", "Question Text #1"),
            new QuestionCls(undefined, "My Question #2", "Question Text #2"),
            new QuestionCls(undefined, "My Question #3", "Question Text #3"),
        ];
        const criteria = new QuestionByTitleCriteriaCls();
        criteria.title = "hello";
        const response = await chakram.post(routeGenerator.save(questions, criteria), questions);
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
    });

    it("should save many questions by a given another criteria object", async () => {
        const questions = [
            new QuestionCls(undefined, "My Question #1", "Question Text #1"),
            new QuestionCls(undefined, "My Question #2", "Question Text #2"),
            new QuestionCls(undefined, "My Question #3", "Question Text #3"),
        ];
        const criteria = new QuestionByTextCriteriaCls();
        criteria.text = "bye";
        const response = await chakram.post(routeGenerator.save(questions, criteria), questions);
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
    });

});