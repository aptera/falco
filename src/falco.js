const usage = require('./usage');
const cmd = require('./cmd');
const git = require('./git');
const strings = require('./strings');

module.exports = {
    run: (command, arg) => {
        const f = commands[command];
        f ? run(f(arg)) : usage.show();
    }
}

const commands = {
    start,
    commit,
    drive,
    pass,
    stop,
    clean
}

function run(commands) {
    if (!git.root())
        throw new Error(strings.notUnderAGitRepoError);

    for (const command of commands)
        cmd.run(command);
    cmd.run(git.status());
}

function start() {
    const mobBranch = git.mobBranch();
    return [
        git.create(mobBranch),
        git.setUpstream(mobBranch)
    ];
}

function commit(message) {
    if (!message)
        throw new Error(strings.noCommitMessageError);

    const mobBranch = git.currentBranch();
    git.validateThatBranchIsMobbing(mobBranch);

    return [
        ...pass(),
        git.checkout(strings.workified(mobBranch)),
        git.merge(mobBranch),
        git.commit(message),
        git.push(),
        git.deleteUpstream(mobBranch),
        git.deleteLocal(mobBranch)
    ];
}

function drive() {
    return [
        git.fetch(),
        git.checkout(git.mobBranch()),
        git.pull()
    ]
}

function clean() {
    const mobBranch = git.currentBranch();
    git.validateThatBranchIsMobbing(mobBranch);

    return [git.deleteLocal(mobBranch)];
}

function pass() {
    return [
        git.stage(),
        git.commit(strings.wipCommitMessage),
        git.push()
    ];
}

function stop() {
    const branch = git.currentBranch();
    return [
        git.checkout(strings.workified(branch)),
        git.deleteLocal(git.mobBranch()),
        git.fetch()
    ]
}
