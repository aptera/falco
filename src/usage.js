const usage = require('cli-usage');

module.exports = {
    show: () => {
        const content = usage.get("./falco/usage.md");
        console.log(content);
    }
}