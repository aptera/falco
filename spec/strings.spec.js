describe("The strings module", () => {

    it("is under test", () => {
        expect(subject).toBeDefined();
    });

    describe("when mobifying a branch name", () => {
        describe("given a non-mobbing branch", () => {
            it("mobifies it", () => {
                expect(subject.mobified("this-mobbing-branch-right-here"))
                    .toEqual("this-mobbing-branch-right-here-mobbing");
            });
        });

        describe("given a mobbing branch", () => {
            it("leaves it alone", () => {
                expect(subject.mobified("this-branch-right-here-mobbing"))
                    .toEqual("this-branch-right-here-mobbing");
            });
        });
    });

    describe("when workifying a branch name", () => {
        describe("given a mobbing branch", () => {
            it("workifies it", () => {
                expect(subject.workified("that-mobbing-branch-right-there-mobbing"))
                    .toEqual("that-mobbing-branch-right-there");
            });
        });

        describe("given a non-mobbing branch", () => {
            it("leaves it alone", () => {
                expect(subject.workified("that-mobbing-branch-right-there"))
                    .toEqual("that-mobbing-branch-right-there");
            });
        });
    });

    beforeEach(() => {
        subject = require('../src/strings');
    });

    let subject;
});