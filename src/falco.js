const usage = require('./usage');
const cmd = require('./cmd');
const strings = require('./strings');

module.exports = {
    run: (command, arg) => {
        const f = commands[command];
        f ? run(f(arg)) : usage.show();
    }
}

function run(commands) {
    for (const command of commands)
        cmd.run(command);
    cmd.run("git status");
}

function start() {
    const mobBranchName = mobified(currentBranchName());
    return [
        `git checkout -B ${mobBranchName}`,
        `git push --set-upstream origin ${mobBranchName}`
    ];
}

function commit(message) {
    if (!message)
        throw new Error(strings.noCommitMessageError);

    const mobBranchName = currentBranchName();
    validateThatBranchIsMobbing(mobBranchName);

    return [
        "git add .",
        "git commit -m 'wip'",
        "git push",
        `git checkout ${mobBranchName.replace("-mobbing", "")}`,
        `git merge ${mobBranchName} --squash`,
        `git commit -m '${message}'`,
        "git push",
        `git push -d origin ${mobBranchName}`,
        `git branch -D ${mobBranchName}`
    ];
}

function drive() {
    return [
        "git fetch",
        `git checkout ${mobified(currentBranchName())}`,
        "git pull"
    ]
}

function clean() {
    const mobBranchName = currentBranchName();
    validateThatBranchIsMobbing(mobBranchName);

    return [`git branch -D ${mobBranchName}`];
}

function pass() {
    return [
        "git add .",
        "git commit -m 'wip'",
        "git push"
    ];
}

function stop() {
    const branchName = currentBranchName();
    return [
        `git checkout ${branchName.replace("-mobbing", "")}`,
        `git branch -D ${mobified(branchName)}`,
        "git fetch --prune"
    ]
}

function currentBranchName() {
    return cmd.read("git rev-parse --abbrev-ref HEAD");
}

function mobified(branchName) {
    return branchName.endsWith("-mobbing") 
         ? branchName
         : `${branchName}-mobbing`;
}

function validateThatBranchIsMobbing(branchName) {
    if (!branchName.endsWith("-mobbing"))
        throw new Error(strings.notOnAMobbingBranchError);
}

const commands = {
    start,
    commit,
    drive,
    pass,
    stop,
    clean
}
