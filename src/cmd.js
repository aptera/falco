const { execSync } = require('child_process'); // run commands

module.exports = {
    run: (command) => {
        execSync(command, { stdio: 'inherit' });
    }
}