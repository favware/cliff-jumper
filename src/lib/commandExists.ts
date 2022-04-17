/*
	The MIT License (MIT)

	Copyright (c) 2019 Raphaël Thériault

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
*/

import { fileExists } from '#lib/fileExists';
import { fromAsync, isErr } from '@sapphire/result';
import { execa } from 'execa';
import { constants } from 'node:fs';
import { access } from 'node:fs/promises';

const windows = process.platform === 'win32';

async function isExecutable(command: string): Promise<boolean> {
  const result = await fromAsync(() => access(command, constants.X_OK));

  return isErr(result);
}

function cleanWindowsCommand(input: string) {
  if (/[^A-Za-z0-9_\/:=-]/.test(input)) {
    input = `'${input.replace(/'/g, "'\\''")}'`;
    input = input.replace(/^(?:'')+/g, '').replace(/\\'''/g, "\\'");
  }

  return input;
}

async function commandExistsUnix(command: string): Promise<boolean> {
  if (await fileExists(command)) {
    if (await isExecutable(command)) {
      return true;
    }
  }

  const result = await fromAsync(() => execa('which', [command]));

  if (isErr(result)) {
    return false;
  }

  return Boolean(result.value.stdout);
}

const invalidWindowsCommandNameRegex = /[\x00-\x1f<>:"|?*]/;

async function commandExistsWindows(command: string): Promise<boolean> {
  if (invalidWindowsCommandNameRegex.test(command)) {
    return false;
  }

  const result = await fromAsync(async () => execa('where', [cleanWindowsCommand(command)]));

  if (isErr(result)) {
    return fileExists(command);
  }

  return true;
}

export async function commandExists(command: string): Promise<boolean> {
  return windows ? commandExistsWindows(command) : commandExistsUnix(command);
}
