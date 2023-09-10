import { Result } from '@sapphire/result';
import { isFunction, isNullishOrEmpty, isThenable, type Awaitable } from '@sapphire/utilities';
import { cyan, green, red } from 'colorette';
import type { Options } from 'commander';
import type { Recommendation } from 'conventional-recommended-bump';
import { load } from 'js-yaml';
import { execSync } from 'node:child_process';
import type { PathLike } from 'node:fs';
import { readFile } from 'node:fs/promises';
import type { ReleaseType } from 'semver';

/**
 * Attempts to resolve the package managed used by checking the `npm_config_user_agent` environment variable.
 * If the environment variable was not found, it will default to `npm`.
 *
 * If yarn v2 is used then it will be resolved as yarn v3 as they are compatible for our purposes.
 *
 * @returns The package manager used
 */
export function resolveUsedPackageManager(): 'yarn-v1' | 'yarn-v3' | 'npm' | 'pnpm' {
  const npmConfigUserAgentEnvVar = process.env.npm_config_user_agent;

  if (!npmConfigUserAgentEnvVar || npmConfigUserAgentEnvVar.startsWith('npm/')) return 'npm';
  if (npmConfigUserAgentEnvVar.startsWith('pnpm/')) return 'pnpm';

  if (npmConfigUserAgentEnvVar.startsWith('yarn/')) {
    if (npmConfigUserAgentEnvVar.startsWith('yarn/1')) return 'yarn-v1';
    if (npmConfigUserAgentEnvVar.startsWith('yarn/2') || npmConfigUserAgentEnvVar.startsWith('yarn/3')) {
      return 'yarn-v3';
    }
  }

  return 'npm';
}

export function resolvePublishCommand(packageManagerUsed: ReturnType<typeof resolveUsedPackageManager>) {
  if (packageManagerUsed === 'pnpm') return 'pnpm publish';
  if (packageManagerUsed === 'yarn-v1') return 'yarn publish';
  if (packageManagerUsed === 'yarn-v3') return 'yarn npm publish';

  return 'npm publish';
}

export function resolveInstallCommand(packageManagerUsed: ReturnType<typeof resolveUsedPackageManager>) {
  if (packageManagerUsed === 'pnpm') return 'pnpm install';
  if (packageManagerUsed === 'yarn-v1' || packageManagerUsed === 'yarn-v3') return 'yarn install';

  return 'npm install';
}

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

export function getGitRootDirection() {
  const repositoryRoot = execSync('git rev-parse --show-prefix', { encoding: 'utf-8' });

  return repositoryRoot
    .split('/')
    .map((i) => i.trim())
    .filter(Boolean)
    .map(() => '..')
    .join('/');
}

export function getFullPackageName(options: Options) {
  return options.org ? `@${options.org}/${options.name}` : options.name;
}

export async function doActionAndLog<T>(preActionLog: string, action: Awaitable<T> | (() => Awaitable<T>)): Promise<T> {
  process.stdout.write(cyan(`${preActionLog}... `));

  const result = await Result.fromAsync<T, Error>(async () => {
    const executedFunctionResult = isFunction(action) ? action() : action;
    const returnValue = isThenable(executedFunctionResult) ? ((await executedFunctionResult) as T) : executedFunctionResult;
    console.log(green('✅ Done'));
    return returnValue;
  });

  if (result.isErr()) {
    console.log(red('❌ Error'));
    console.error(result.unwrapErr().message);
    process.exit(1);
  }

  return result.unwrap();
}

export function resolveTagTemplate(options: Options, newVersion: string) {
  if (isNullishOrEmpty(options.tagTemplate)) {
    if (isNullishOrEmpty(options.org)) {
      options.tagTemplate = 'v{{new-version}}';
    } else {
      options.tagTemplate = `{{full-name}}@{{new-version}}`;
    }
  }

  options.tagTemplate = options.tagTemplate
    .replaceAll('{{new-version}}', newVersion)
    .replaceAll('{{org}}', options.org)
    .replaceAll('{{name}}', options.name)
    .replaceAll('{{full-name}}', getFullPackageName(options));
}

/** Resolves the release-as prefix */
export const getReleaseType = (options: Options, changelogResolvedReleaseType: Recommendation.ReleaseType): ReleaseType =>
  ((Boolean(options.preid) ? 'pre' : '') + changelogResolvedReleaseType) as ReleaseType;
