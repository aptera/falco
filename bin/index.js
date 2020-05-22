#!/usr/bin/env node
const falco = require('../src/falco');

try {
    falco.run(...process.argv.slice(2));
} catch (e) {
    e.message
        ? console.error(e.message)
        : console.error(e);
}