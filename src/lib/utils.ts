import { fromAsync, isErr } from '@sapphire/result';
import { Awaitable, isThenable } from '@sapphire/utilities';
import { cyan, green, red } from 'colorette';
import type { OptionValues } from 'commander';
import { execa } from 'execa';
import { load } from 'js-yaml';
import type { PathLike } from 'node:fs';
import { readFile } from 'node:fs/promises';

/**
 * Parsed a YAML file into an `Object` of type `T`
 * @param pathLike The {@link PathLike} to read with {@link readFile}
 */
export async function readYaml<T>(pathLike: PathLike): Promise<T> {
  return load(await readFile(pathLike, { encoding: 'utf-8' })) as unknown as T;
}

/**
 * Parses a JSON file into an `Object` of type `T`
 * @param pathLike The {@link PathLike} to read with {@link readFile}
 */
export async function readJson<T>(pathLike: PathLike): Promise<T> {
  return JSON.parse(await readFile(pathLike, { encoding: 'utf-8' })) as T;
}

export async function getGitRootDirection() {
  const repositoryRoot = await doActionAndLog(
    'Retrieving the root directory of the Git repository',
    execa('git', ['rev-parse', '--show-prefix'], { encoding: 'utf-8' })
  );

  return repositoryRoot.stdout
    .split('/')
    .map((i) => i.trim())
    .filter(Boolean)
    .map(() => '..')
    .join('/');
}

export function getFullPackageName(options: OptionValues) {
  return options.org ? `@${options.org}/${options.name}` : options.name;
}

export async function doActionAndLog<T>(preActionLog: string, action: Awaitable<T>): Promise<T> {
  process.stdout.write(cyan(`${preActionLog}... `));

  const result = await fromAsync(async () => {
    const returnValue = isThenable(action) ? ((await action) as T) : action;
    console.log(green('✅ Done'));
    return returnValue;
  });

  if (isErr(result)) {
    console.log(red('❌ Error'));
    console.error((result.error as Error).message);
    process.exit(1);
  }

  return result.value;
}
