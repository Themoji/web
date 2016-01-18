'use strict';

const fs = require('fs');
const emojis = require('../vendor/emoji');

const minified = emojis
    .filter((e) => e.unified)
    .map((e) => ({
        name: e.name,
        short_names: e.short_names,
        unified: e.unified.split('-').map((cp) => parseInt(cp, 16))
    }));

fs.writeFileSync(__dirname + '/../public/emojis.json', JSON.stringify(minified));
