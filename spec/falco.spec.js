const rewiremock = require('rewiremock/node');
const strings = require('../src/strings');
const git = require('../src/git');

describe("Falco", () => {

    describe("given no arguments", () => {
        it("shows usage", () => {
            subject.run();
            expect(mocked.usage.show).toHaveBeenCalled();
        });
    });

    describe("given the user is not in a git repo", () => {
        it("throws an error", () => {
            git.root.and.returnValue(null);
            expect(() => subject.run("start"))
                .toThrowError(strings.notUnderAGitRepoError);
        });
    });

    it("starts the mob session", () => {
        git.currentBranch.and.returnValue("working-branch");
        git.mobBranch.and.returnValue("working-branch-mobbing");
        subject.run("start");
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
        it("begins driving", () => {
            git.currentBranch.and.returnValue("driving-branch");
            git.mobBranch.and.returnValue("driving-branch-mobbing");
            subject.run("drive");
            expectCommands(expectedCommands);
        });

        const expectedCommands = [
            "git fetch --prune",
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
                git.currentBranch.and.returnValue("some-other-branch");
                expect(() => subject.run("commit", "feat: OH YEAH"))
                    .toThrowError(strings.notOnAMobbingBranchError);
            });
        });

        describe("given a message", () => {
            beforeEach(() => {
                git.currentBranch.and.returnValue("committing-branch-mobbing");
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
            git.currentBranch.and.returnValue("stopping-branch-mobbing");
            git.mobBranch.and.returnValue("stopping-branch-mobbing");
            subject.run("stop");
        });

        it("reads the current branch", () => {
            expect(git.currentBranch).toHaveBeenCalled();
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
        beforeEach(() => {
            git.currentBranch.and.returnValue("cleaning-branch-mobbing");
            subject.run("clean");
        });

        describe("given the user is not on a mobbing branch", () => {
            it("throws an error", () => {
                git.currentBranch.and.returnValue("cleaning-branch");
                expect(() => subject.run("clean"))
                    .toThrowError(strings.notOnAMobbingBranchError);
            });
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
        mockCmd();
        mockUsage();
        mockGit();
        rewiremock.enable();
    }

    function mockGit() {
        rewiremock('../src/git').with(git);
        spyOn(git, 'currentBranch');
        spyOn(git, 'mobBranch');
        spyOn(git, 'root').and.returnValue("/path/to/my/git/repo");
        spyOn(git, 'stage').and.returnValue("git add .");
    }

    function mockUsage() {
        rewiremock('../src/usage').with(mocked.usage);
        spyOn(mocked.usage, 'show');
    }

    function mockCmd() {
        rewiremock('../src/cmd').with(mocked.cmd);
        spyOn(mocked.cmd, 'run');
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