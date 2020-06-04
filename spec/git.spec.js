const rewiremock = require('rewiremock/node');
const strings = require('../src/strings');

describe("The git module", () => {

    it("is under test", () => {
        expect(subject).toBeDefined();
    });

    it("gets the git root", () => {
        mocked.cmd.read.and.returnValue("/path/to/repo");
        const result = subject.root();
        expect(mocked.cmd.read).toHaveBeenCalledWith(`git rev-parse --show-toplevel`);
        expect(result).toEqual("/path/to/repo");
    });

    describe("when run outside a git repo", () => {
        it("returns null", () => {
            mocked.cmd.read.and.throwError(new Error());
            expect(subject.root()).toBeNull();
        });
    });

    it("gets the current branch", () => {
        mocked.cmd.read.and.returnValue("my-branch");
        const result = subject.currentBranch();
        expect(mocked.cmd.read).toHaveBeenCalledWith(`git rev-parse --abbrev-ref HEAD`);
        expect(result).toEqual("my-branch");
    });

    describe("when validating the branch", () => {

        describe("given a mobbing branch", () => {
            it("does not throw an error", () => {
                expect(subject.validateThatBranchIsMobbing("my-changes-mobbing"))
            });
        });

        describe("given a non-mobbing branch", () => {
            it("throws an error", () => {
                expect(() => {
                    subject.validateThatBranchIsMobbing("my-mobbing-changes")
                }).toThrowError(strings.notOnAMobbingBranchError);
            });
        });

    });


    beforeEach(() => {
        mock();
        subject = require('../src/git');
    });

    function mock() {
        rewiremock('../src/cmd').with(mocked.cmd);
        spyOn(mocked.cmd, 'run');
        spyOn(mocked.cmd, 'read');
        rewiremock.enable();
    }

    const mocked = {
        cmd: {
            run: () => { },
            read: () => { }
        }
    };
    let subject;
});