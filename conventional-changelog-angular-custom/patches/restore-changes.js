const parserOpts = require('../parser-opts.js');
const { writeFileSync } = require('node:fs');
const { inspect } = require('node:util');
const { resolve } = require('node:path');

Reflect.deleteProperty(parserOpts, 'breakingHeaderPattern');

const pathToParserOpts = resolve(__dirname, '../parser-opts.js');

const content = `'use strict';

module.exports = ${inspect(parserOpts)};
`;

writeFileSync(pathToParserOpts, content);
