const strings = require('./strings');

module.exports = {
    root: root,
    currentBranch: current,
    mobBranch: () => mobified(current()),
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

// SPIKE
function root() {
    try {
        return cmd.read(`git rev-parse --show-toplevel`);
    } catch (e) {
        return null;
    }
}

// SPIKE
function current() {
    return cmd.read("git rev-parse --abbrev-ref HEAD");
}

// SPIKE
function mobified(branchName) {
    return branchName.endsWith("-mobbing")
        ? branchName
        : `${branchName}-mobbing`;
}

function validateThatBranchIsMobbing(branchName) {
    if (!branchName.endsWith("-mobbing"))
        throw new Error(strings.notOnAMobbingBranchError);
}