const cmd = require('./cmd');
const file = require('./file');

module.exports = {
    run: (command, arg) => {
        const f = commands[command];
        f ? run(f(arg)) : usage();
    }
}

function run(commands) {
    for (const command of commands)
        cmd.run(command);
    cmd.run("git status");
}

function usage() {
    console.log("USAGE");
}

function start() {
    return [
        "git rev-parse --abbrev-ref HEAD > .mob",
        "git checkout -B mobbing",
        "git push --set-upstream origin mobbing"
    ];
}

function commit(message) {
    if (!message)
        throw new Error("Please specify a commit message.");
    const branchName = file.read(".mob");
    file.remove(".mob")
    return merge(branchName, message)
            .concat(clean());
}

function merge(branchName, message) {
    return [
        "git add .",
        "git commit -m 'wip'",
        "git push",
        `git checkout ${branchName}`,
        "git merge mobbing --squash",
        `git commit -m '${message}'`,
        "git push",
        "git push -d origin mobbing"
    ];
}

function drive() {
    return [
        "git fetch",
        "git checkout mobbing",
        "git pull"
    ]
}

function clean() {
    file.remove(".mob")
    return ["git branch -D mobbing"];
}

function pass() {
    return [
        "git add .",
        "git reset .mob",
        "git commit -m 'wip'",
        "git push"
    ];
}

function stop() {
    const branchName = file.read(".mob");
    file.remove(".mob");
    return [
        `git checkout ${branchName}`,
        "git branch -D mobbing",
        "git fetch --prune"
    ]
}

const commands = {
    start: start,
    commit: commit,
    drive: drive,
    pass: pass,
    stop: stop,
    clean: clean
}
