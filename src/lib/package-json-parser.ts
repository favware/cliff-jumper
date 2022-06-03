/**
 * This code is based on https://github.com/npm/json-parse-even-better-errors
 * @license MIT
 * @copyright 2017 Kat Marchán Copyright npm, Inc.
 */

import type { PathLike } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';

/** A {@link Symbol} for the indent identifier in a parsed package.json */
const packageJsonParseIndentSymbol = Symbol.for('indent');

/** A {@link Symbol} for the newline identifier in a parsed package.json */
const packageJsonParseNewlineSymbol = Symbol.for('newline');

/**
 * Parses a package.json file while preserving the indents and newlines
 * as {@link packageJsonParseIndentSymbol} and {@link packageJsonParseNewlineSymbol}
 *
 * @param pathLike The {@link PathLike} to read with {@link readFile}
 */
export async function readPackageJson(pathLike: PathLike): Promise<PackageJsonStructure> {
  // only respect indentation if we got a line break, otherwise squash it
  // things other than objects and arrays aren't indented, so ignore those
  // Important: in both of these regexps, the $1 capture group is the newline
  // or undefined, and the $2 capture group is the indent, or undefined.
  const formatRE = /^\s*[{\[]((?:\r?\n)+)([\s\t]*)/;
  const emptyRE = /^(?:\{\}|\[\])((?:\r?\n)+)?$/;

  const parseJson = (txt: string | any[]) => {
    const parseText = stripBOM(txt);

    // get the indentation so that we can save it back nicely
    // if the file starts with {" then we have an indent of '', ie, none
    // otherwise, pick the indentation of the next line after the first \n
    // If the pattern doesn't match, then it means no indentation.
    // JSON.stringify ignores symbols, so this is reasonably safe.
    // if the string is '{}' or '[]', then use the default 2-space indent.
    // eslint-disable-next-line no-sparse-arrays
    const [, newline = '\n', indent = '  '] = parseText.match(emptyRE) || parseText.match(formatRE) || [, '', ''];

    const result = JSON.parse(parseText);
    if (result && typeof result === 'object') {
      result[packageJsonParseNewlineSymbol] = newline;
      result[packageJsonParseIndentSymbol] = indent;
    }
    return result;
  };

  // Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
  // because the buffer-to-string conversion in `fs.readFileSync()`
  // translates it to FEFF, the UTF-16 BOM.
  const stripBOM = (txt: string | any[]) => String(txt).replace(/^\uFEFF/, '');

  return parseJson(await readFile(pathLike, { encoding: 'utf-8' }));
}

/**
 * Writes to a package.json file
 * @param pathLike The {@link PathLike} to read with {@link readFile}
 * @param pkg The package.json data to write
 */
export async function writePackageJson(pathLike: PathLike, pkg: Record<any, any>): Promise<void> {
  const indent = Reflect.get(pkg, packageJsonParseIndentSymbol) ?? 2;
  const newline = Reflect.get(pkg, packageJsonParseNewlineSymbol) ?? '\n';

  Reflect.deleteProperty(pkg, '_id');

  const raw = `${JSON.stringify(pkg, null, indent)}\n`;

  const data = newline === '\n' ? raw : raw.split('\n').join(newline);

  return writeFile(pathLike, data);
}

interface PackageJsonStructure {
  name: string;
  version: string;
  [packageJsonParseIndentSymbol]: number;
  [packageJsonParseNewlineSymbol]: string;
}
