const usage = require('./usage');
const cmd = require('./cmd');
const file = require('./file');
const mobFile = ".mob";

module.exports = {
    run: (command, arg) => {
        const f = commands[command];
        if (f)
            run(f(arg));
        else {
            usage.show();
        }
    }
}

function run(commands) {
    for (const command of commands)
        cmd.run(command);
    cmd.run("git status");
}

function start() {
    return [
        `git rev-parse --abbrev-ref HEAD > ${mobFile}`,
        "git checkout -B mobbing",
        "git push --set-upstream origin mobbing"
    ];
}

function commit(message) {
    if (!message)
        throw new Error("Please specify a commit message.");

    const branchName = file.read(mobFile);
    file.remove(mobFile);

    return [
        "git add .",
        "git commit -m 'wip'",
        "git push",
        `git checkout ${branchName}`,
        "git merge mobbing --squash",
        `git commit -m '${message}'`,
        "git push",
        "git push -d origin mobbing",
        "git branch -D mobbing"
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
    file.remove(mobFile)
    return ["git branch -D mobbing"];
}

function pass() {
    return [
        "git add .",
        `git reset ${mobFile}`,
        "git commit -m 'wip'",
        "git push"
    ];
}

function stop() {
    const branchName = file.read(mobFile);
    file.remove(mobFile);
    return [
        `git checkout ${branchName}`,
        "git branch -D mobbing",
        "git fetch --prune"
    ]
}

const commands = {
    start,
    commit,
    drive,
    pass,
    stop,
    clean
}
