const { execSync } = require('child_process'); 

module.exports = {
    run: (command) => {
        execSync(command, { stdio: 'inherit' });
    }
}