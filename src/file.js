const { readFileSync, unlinkSync, existsSync } = require('fs'); 

module.exports = {
    read: (path) => {
        return existsSync(path)
            ? readFileSync(path)
            : "";
    },
    remove: (path) => {
        if (existsSync(path))
            unlinkSync(path);
    }
}