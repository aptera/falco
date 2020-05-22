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

    const mobBranchName = git.currentBranch();
    git.validateThatBranchIsMobbing(mobBranchName);

    return [
        ...pass(),
        git.checkout(mobBranchName.replace("-mobbing", "")),
        git.merge(mobBranchName),
        git.commit(message),
        git.push(),
        git.deleteUpstream(mobBranchName),
        git.deleteLocal(mobBranchName)
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
    const mobBranchName = git.currentBranch();
    git.validateThatBranchIsMobbing(mobBranchName);

    return [git.deleteLocal(mobBranchName)];
}

function pass() {
    return [
        git.stage(),
        git.commit('wip'),
        git.push()
    ];
}

function stop() {
    const branchName = git.currentBranch();
    return [
        git.checkout(branchName.replace("-mobbing", "")),
        git.deleteLocal(git.mobBranch()),
        git.fetch()
    ]
}
