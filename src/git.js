const strings = require('./strings');
const cmd = require('./cmd');

module.exports = {
    root: root,
    currentBranch: current,
    mobBranch: () => strings.mobified(current()),
    validateThatBranchIsMobbing: validateThatBranchIsMobbing,

    status: () => `git status`,
    push: () => `git push`,
    pull: () => `git pull`,
    fetch: () => `git fetch --prune`,

    stage: () => `git add ${root()}`,
    commit: (message) => `git commit -m '${message}'`,

    create: (branch) => `git checkout -B ${branch}`,
    setUpstream: (branch) => `git push --set-upstream origin ${branch}`,
    checkout: (branch) => `git checkout ${branch}`,
    merge: (branch) => `git merge ${branch} --squash`,
    deleteUpstream: (branch) => `git push -d origin ${branch}`,
    deleteLocal: (branch) => `git branch -D ${branch}`,
}

function root() {
    try {
        return cmd.read(`git rev-parse --show-toplevel`);
    } catch (e) {
        return null;
    }
}

function current() {
    return cmd.read(`git rev-parse --abbrev-ref HEAD`);
}

function validateThatBranchIsMobbing(branchName) {
    if (!strings.isMobbing(branchName))
        throw new Error(strings.notOnAMobbingBranchError);
}