const rewiremock = require('rewiremock/node');

describe("Falco", () => {

    describe("given no arguments", () => {
        it("shows usage", () => {
            subject.run();
            expect(global.console.log).toHaveBeenCalledWith("USAGE")
        });
    });

    it("starts the mob session", () => {
        subject.run("start");
        expectCommands([
            "git rev-parse --abbrev-ref HEAD > .mob",
            "git checkout -B mobbing",
            "git push --set-upstream origin mobbing",
            "git status"
        ]);
    });

    it("passes the session", () => {
        subject.run("pass");
        expectCommands([
            "git add .",
            "git reset .mob",
            "git commit -m 'wip'",
            "git push",
            "git status"
        ]);
    });

    it("begins driving", () => {
        subject.run("drive");
        expectCommands([
            "git fetch",
            "git checkout mobbing",
            "git pull",
            "git status"
        ]);
    });

    describe("when committing", () => {

        describe("given no message", () => {
            it("throws an error", () => {
                expect(() => subject.run("commit"))
                    .toThrowError("Please specify a commit message.");
            });
        });

        describe("given a message", () => {

            it("commits the session", () => {
                expectCommands([
                    "git add .",
                    "git commit -m 'wip'",
                    "git push",
                    "git checkout working-branch",
                    "git merge mobbing --squash",
                    "git commit -m 'feat: we did it!'",
                    "git push",
                    "git push -d origin mobbing",
                    "git branch -D mobbing",
                    "git status"
                ]);
            });

            it("deletes the mob file", () => {
                expect(mocked.file.read).toHaveBeenCalledWith(".mob");
            });

            beforeEach(() => {
                spyOn(mocked.file, 'read').and.returnValue("working-branch");
                subject.run("commit", "feat: we did it!");
            });
        });
    });

    describe("when stopping", () => {

        it("reads from the mob file", () => {
            expect(mocked.file.read).toHaveBeenCalledWith(".mob");
        });

        it("deletes the mob file", () => {
            expect(mocked.file.remove).toHaveBeenCalledWith(".mob");
        });

        it("stops the session", () => {
            expectCommands([
                "git checkout feature-branch",
                "git branch -D mobbing",
                "git fetch --prune",
                "git status"
            ]);
        });

        beforeEach(() => {
            spyOn(mocked.file, 'read').and.returnValue("feature-branch");
            subject.run("stop");
        });
    });

    describe("when cleaning", () => {

        it("deletes the mob file", () => {
            expect(mocked.file.remove).toHaveBeenCalledWith(".mob");
        });

        it("cleans the workspace", () => {
            expectCommands([
                "git branch -D mobbing",
                "git status"
            ]);
        });

        beforeEach(() => {
            subject.run("clean");
        })
    });

    beforeEach(() => {
        mock();
        subject = require('../src/falco');
    });

    function mock() {
        rewiremock('../src/cmd').with(mocked.cmd);
        rewiremock('../src/file').with(mocked.file);
        rewiremock.enable();
        spyOn(mocked.cmd, 'run');
        spyOn(mocked.file, 'remove');
        spyOn(console, 'log');
    }

    function expectCommands(commands) {
        expect(mocked.cmd.run).toHaveBeenCalledTimes(commands.length);
        for (const command of commands)
            expect(mocked.cmd.run).toHaveBeenCalledWith(command);
    }

    const mocked = {
        cmd: { run: () => { } },
        file: {
            read: () => { },
            remove: () => { },
        }
    };
    let subject;
})