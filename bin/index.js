#!/usr/bin/env node
const falco = require('../src/falco');
const cmd = require('../src/cmd');


try {
    console.log(cmd.read("git rev-parse --show-toplevel"));
    // falco.run(...process.argv.slice(2));
} catch (e) {
    e.message 
        ? console.error(e.message)
        : console.error(e);
}