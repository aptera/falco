const mobbingRegex = /-mobbing$/;
const mobbingSuffix = "-mobbing";

module.exports = {
    noCommitMessageError: "Please specify a commit message.",
    notOnAMobbingBranchError: "You are not on a mobbing branch!",
    notUnderAGitRepoError: "You are not under a git repo",
    wipCommitMessage: "wip",
    mobbingSuffix: mobbingSuffix,
    mobified: mobified,
    workified: workified,
    isMobbing: isMobbing
}

// SPIKE
function isMobbing(branchName) {
    return new RegExp(mobbingRegex).test(branchName);
}

function mobified(branchName) {
    return isMobbing(branchName)
        ? branchName
        : branchName + mobbingSuffix;
}

function workified(branchName) {
    return branchName.replace(mobbingRegex, "");
}
