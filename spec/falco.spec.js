const rewiremock = require('rewiremock/node');
const strings = require('../src/strings');

describe("Falco", () => {

    describe("given no arguments", () => {
        it("shows usage", () => {
            subject.run();
            expect(mocked.usage.show).toHaveBeenCalled();
        });
    });

    it("starts the mob session", () => {
        spyOn(mocked.cmd, 'read').and.returnValue("working-branch");
        subject.run("start");
        expectCurrentBranchToHaveBeenRead();
        expectCommands([
            "git checkout -B working-branch-mobbing",
            "git push --set-upstream origin working-branch-mobbing",
            "git status"
        ]);
    });

    it("passes the session", () => {
        subject.run("pass");
        expectCommands([
            "git add .",
            "git commit -m 'wip'",
            "git push",
            "git status"
        ]);
    });

    describe("when driving", () => {
        describe("given the user is not on the mobbing branch yet", () => {
            it("checks it out", () => {
                spyOn(mocked.cmd, 'read').and.returnValue("driving-branch");
                subject.run("drive");
                expectCurrentBranchToHaveBeenRead();
                expectCommands(expectedCommands);
            });
        });

        describe("given the user is already on the mobbing branch", () => {
            it("just begins driving", () => {
                spyOn(mocked.cmd, 'read').and.returnValue("driving-branch-mobbing");
                subject.run("drive");
                expectCommands(expectedCommands);
            });
        });

        const expectedCommands = [
            "git fetch",
            "git checkout driving-branch-mobbing",
            "git pull",
            "git status"
        ];
    });

    describe("when committing", () => {

        describe("given no message", () => {
            it("throws an error", () => {
                expect(() => subject.run("commit"))
                    .toThrowError(strings.noCommitMessageError);
            });
        });

        describe("given the user is not on a mobbing branch", () => {
            it("throws an error", () => {
                spyOn(mocked.cmd, 'read').and.returnValue("some-other-branch");
                expect(() => subject.run("commit", "feat: OH YEAH"))
                    .toThrowError(strings.notOnAMobbingBranchError);
            });
        });

        describe("given a message", () => {
            beforeEach(() => {
                spyOn(mocked.cmd, 'read').and.returnValue("committing-branch-mobbing");
                subject.run("commit", "feat: we did it!");
            });

            it("commits the session", () => {
                expectCommands([
                    "git add .",
                    "git commit -m 'wip'",
                    "git push",
                    "git checkout committing-branch",
                    "git merge committing-branch-mobbing --squash",
                    "git commit -m 'feat: we did it!'",
                    "git push",
                    "git push -d origin committing-branch-mobbing",
                    "git branch -D committing-branch-mobbing",
                    "git status"
                ]);
            });
        });
    });

    describe("when stopping", () => {

        beforeEach(() => {
            spyOn(mocked.cmd, 'read').and.returnValue("stopping-branch-mobbing");
            subject.run("stop");
        });

        it("reads the current branch", () => {
            expectCurrentBranchToHaveBeenRead();
        });

        it("stops the session", () => {
            expectCommands([
                "git checkout stopping-branch",
                "git branch -D stopping-branch-mobbing",
                "git fetch --prune",
                "git status"
            ]);
        });

    });

    describe("when cleaning", () => {
        describe("given the user is not on a mobbing branch", () => {
            it("throws an error", () => {
                mocked.cmd.read.and.returnValue("cleaning-branch");
                expect(() => subject.run("clean"))
                    .toThrowError(strings.notOnAMobbingBranchError);
            });
        });

        beforeEach(() => {
            spyOn(mocked.cmd, 'read').and.returnValue("cleaning-branch-mobbing");
            subject.run("clean");
        });

        it("cleans the workspace", () => {
            expectCommands([
                "git branch -D cleaning-branch-mobbing",
                "git status"
            ]);
        });

    });

    beforeEach(() => {
        mock();
        subject = require('../src/falco');
    });

    function mock() {
        rewiremock('../src/cmd').with(mocked.cmd);
        rewiremock('../src/usage').with(mocked.usage);
        rewiremock.enable();
        spyOn(mocked.cmd, 'run');
        spyOn(mocked.usage, 'show');
        spyOn(console, 'log').and.callThrough();
    }

    function expectCurrentBranchToHaveBeenRead() {
        expect(mocked.cmd.read).toHaveBeenCalledWith("git rev-parse --abbrev-ref HEAD");
    }

    function expectCommands(commands) {
        expect(mocked.cmd.run).toHaveBeenCalledTimes(commands.length);
        for (const command of commands)
            expect(mocked.cmd.run).toHaveBeenCalledWith(command);
    }

    const mocked = {
        cmd: {
            run: () => { },
            read: () => { }
        },
        usage: { show: () => { } },
    };
    let subject;
})