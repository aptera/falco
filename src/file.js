const { readFileSync, unlinkSync, existsSync } = require('fs'); 

module.exports = {
    read: (path) => {
        if (existsSync(path))
            return readFileSync(path);
        return "";
    },
    remove: (path) => {
        if (existsSync(path))
            unlinkSync(path);
    }
}