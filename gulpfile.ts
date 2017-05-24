import {Gulpclass, SequenceTask, Task} from "gulpclass";

const gulp = require("gulp");
const del = require("del");
const shell = require("gulp-shell");
const rename = require("gulp-rename");
const replace = require("gulp-replace");
const mocha = require("gulp-mocha");
const chai = require("chai");
const tslint = require("gulp-tslint");
const stylish = require("tslint-stylish");
const sourcemaps = require("gulp-sourcemaps");
const istanbul = require("gulp-istanbul");
const remapIstanbul = require("remap-istanbul/lib/gulpRemapIstanbul");

@Gulpclass()
export class Gulpfile {

    // -------------------------------------------------------------------------
    // General tasks
    // -------------------------------------------------------------------------

    /**
     * Runs typescript files compilation.
     */
    @Task()
    compile() {
        return gulp.src("./gulpfile.ts", { read: false })
            .pipe(shell(["tsc"]));
    }

    // -------------------------------------------------------------------------
    // Server library packaging tasks
    // -------------------------------------------------------------------------

    /**
     * Cleans server build folder.
     */
    @Task()
    serverClean(cb: Function) {
        return del(["./build/server-compiled/**", "./build/server-package/**"], cb);
    }

    /**
     * Runs typescript files compilation for server package.
     */
    @Task()
    serverCompile() {
        return gulp.src("./gulpfile.ts", { read: false })
            .pipe(shell(["cd ./src/server && tsc"]));
    }

    /**
     * Publishes a server package.
     */
    @Task()
    serverPublish() {
        return gulp.src("gulpfile.ts", { read: false })
            .pipe(shell([
                "cd ./build/server-package && npm publish"
            ]));
    }

    /**
     * Copies all files that will be in a package.
     */
    @Task()
    serverPackageFiles() {
        return gulp.src(["./build/server-compiled/server/**/*", "./build/server-compiled/shared/**/*"])
            .pipe(gulp.dest("./build/server-package"));
    }

    /**
     * Change the "private" state of the packaged package.json file to public.
     */
    @Task()
    serverPackagePreparePackageFile() {
        return gulp.src("./package.server.json")
            .pipe(replace("\"private\": true,", "\"private\": false,"))
            .pipe(rename("package.json"))
            .pipe(gulp.dest("./build/server-package"));
    }

    /**
     * This task will replace all typescript code blocks in the README (since npm does not support typescript syntax
     * highlighting) and copy this README file into the package folder.
     */
    @Task()
    serverPackageReadmeFile() {
        return gulp.src("./README.md")
            .pipe(replace(/```typescript([\s\S]*?)```/g, "```javascript$1```"))
            .pipe(gulp.dest("./build/server-package"));
    }

    /**
     * Creates a package that can be published to npm.
     */
    @SequenceTask()
    serverPackage() {
        return [
            "serverClean",
            "serverCompile",
            ["serverPackageFiles", "serverPackagePreparePackageFile", "serverPackageReadmeFile"]
        ];
    }

    // -------------------------------------------------------------------------
    // Client library packaging tasks
    // -------------------------------------------------------------------------

    /**
     * Cleans client build folder.
     */
    @Task()
    clientClean(cb: Function) {
        return del(["./build/client-compiled/**", "./build/client-package/**"], cb);
    }

    /**
     * Runs typescript files compilation.
     */
    @Task()
    clientCompile() {
        return gulp.src("./gulpfile.ts", { read: false })
            .pipe(shell(["cd ./src/client && tsc"]));
    }

    /**
     * Publishes a package to npm from ./build/package directory.
     */
    @Task()
    clientPublish() {
        return gulp.src("gulpfile.ts", { read: false })
            .pipe(shell([
                "cd ./build/client-package && npm publish"
            ]));
    }

    /**
     * Copies all files that will be in a package.
     */
    @Task()
    clientPackageFiles() {
        return gulp.src(["./build/client-compiled/client/**/*", "./build/client-compiled/shared/**/*"])
            .pipe(gulp.dest("./build/client-package"));
    }

    /**
     * Change the "private" state of the packaged package.json file to public.
     */
    @Task()
    clientPackagePreparePackageFile() {
        return gulp.src("./package.client.json")
            .pipe(replace("\"private\": true,", "\"private\": false,"))
            .pipe(rename("package.json"))
            .pipe(gulp.dest("./build/client-package"));
    }

    /**
     * This task will replace all typescript code blocks in the README (since npm does not support typescript syntax
     * highlighting) and copy this README file into the package folder.
     */
    @Task()
    clientPackageReadmeFile() {
        return gulp.src("./README.md")
            .pipe(replace(/```typescript([\s\S]*?)```/g, "```javascript$1```"))
            .pipe(gulp.dest("./build/client-package"));
    }

    /**
     * Creates a client package that can be published to npm.
     */
    @SequenceTask()
    clientPackage() {
        return [
            "clientClean",
            "clientCompile",
            ["clientPackageFiles", "clientPackagePreparePackageFile", "clientPackageReadmeFile"]
        ];
    }

    // -------------------------------------------------------------------------
    // Packaging tasks
    // -------------------------------------------------------------------------

    /**
     * Creates a package that can be published to npm.
     */
    @SequenceTask()
    package() {
        return [
            "serverPackage",
            "clientPackage",
        ];
    }

    // -------------------------------------------------------------------------
    // Run tests tasks
    // -------------------------------------------------------------------------

    /**
     * Runs ts linting to validate source code.
     */
    @Task()
    tslint() {
        return gulp.src(["./src/**/*.ts", "./test/**/*.ts", "./sample/**/*.ts"])
            .pipe(tslint())
            .pipe(tslint.report(stylish, {
                emitError: true,
                sort: true,
                bell: true
            }));
    }

    /**
     * Runs before test coverage, required step to perform a test coverage.
     */
    @Task()
    coveragePre() {
        return gulp.src(["./build/compiled/src/**/*.js"])
            .pipe(istanbul())
            .pipe(istanbul.hookRequire());
    }

    /**
     * Runs post coverage operations.
     */
    @Task("coveragePost", ["coveragePre"])
    coveragePost() {
        chai.should();
        // chai.use(require("sinon-chai"));
        // chai.use(require("chai-as-promised"));

        return gulp.src([
            "./build/compiled/test/**/*.js",
            "./build/compiled/test/**/*.js",
        ])
            .pipe(mocha())
            .pipe(istanbul.writeReports());
    }

    @Task()
    coverageRemap() {
        return gulp.src("./coverage/coverage-final.json")
            .pipe(remapIstanbul())
            .pipe(gulp.dest("./coverage"));
    }

    /**
     * Compiles the code and runs tests.
     */
    @SequenceTask()
    tests() {
        return ["compile", "coveragePost", "coverageRemap", "tslint"];
    }

}