const { readFileSync, unlinkSync, existsSync } = require('fs'); 

module.exports = {
    read: (path) => {
        return existsSync(path)
            ? readFileSync(path, "utf8")
            : "";
    },
    remove: (path) => {
        if (existsSync(path))
            unlinkSync(path);
    }
}