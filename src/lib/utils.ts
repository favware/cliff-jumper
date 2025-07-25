import { Spinner } from '@favware/colorette-spinner';
import { Result } from '@sapphire/result';
import { isFunction, isNullishOrEmpty, isThenable, type Awaitable } from '@sapphire/utilities';
import { red } from 'colorette';
import type { Options } from 'commander';
import type { BumperRecommendation } from 'conventional-recommended-bump';
import { execa } from 'execa';
import { load } from 'js-yaml';
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
export function resolveUsedPackageManager(): 'yarn-v1' | 'yarn-v2' | 'yarn-v3' | 'yarn-v4' | 'npm' | 'pnpm' {
  const npmConfigUserAgentEnvVar = process.env.npm_config_user_agent;

  if (!npmConfigUserAgentEnvVar || npmConfigUserAgentEnvVar.startsWith('npm/')) return 'npm';
  if (npmConfigUserAgentEnvVar.startsWith('pnpm/')) return 'pnpm';

  if (npmConfigUserAgentEnvVar.startsWith('yarn/')) {
    if (npmConfigUserAgentEnvVar.startsWith('yarn/1')) return 'yarn-v1';
    if (npmConfigUserAgentEnvVar.startsWith('yarn/2')) return 'yarn-v2';
    if (npmConfigUserAgentEnvVar.startsWith('yarn/3')) return 'yarn-v3';
    if (npmConfigUserAgentEnvVar.startsWith('yarn/4')) return 'yarn-v4';
  }

  return 'npm';
}

export function resolvePublishCommand(packageManagerUsed: ReturnType<typeof resolveUsedPackageManager>) {
  switch (packageManagerUsed) {
    case 'pnpm':
      return 'pnpm publish';
    case 'yarn-v1':
      return 'yarn publish';
    case 'yarn-v2':
    case 'yarn-v3':
    case 'yarn-v4':
      return 'yarn npm publish';
    default:
      return 'npm publish';
  }
}

export function resolveInstallCommand(packageManagerUsed: ReturnType<typeof resolveUsedPackageManager>) {
  switch (packageManagerUsed) {
    case 'pnpm':
      return 'pnpm install';
    case 'yarn-v1':
      return 'yarn install';
    case 'yarn-v2':
    case 'yarn-v3':
    case 'yarn-v4':
      return 'yarn install --mode=update-lockfile';
    case 'npm':
    default:
      return 'npm install';
  }
}

/**
 * Parsed a YAML file into an `Object` of type `T`
 * @param pathLike The {@link PathLike} to read with {@link readFile}
 */
export async function readYaml<T>(pathLike: PathLike): Promise<T> {
  return load(await readFile(pathLike, { encoding: 'utf-8' })) as T;
}

/**
 * Parses a JSON file into an `Object` of type `T`
 * @param pathLike The {@link PathLike} to read with {@link readFile}
 */
export async function readJson<T>(pathLike: PathLike): Promise<T> {
  return JSON.parse(await readFile(pathLike, { encoding: 'utf-8' })) as T;
}

export async function getGitRootDirection() {
  const repositoryRoot = await execa('git', ['rev-parse', '--show-prefix']);

  return repositoryRoot.stdout
    ?.split('/')
    .map((i) => i.trim())
    .filter(Boolean)
    .map(() => '..')
    .join('/');
}

export function getFullPackageName(options: Options) {
  return options.org ? `@${options.org}/${options.name}` : options.name;
}

export async function doActionAndLog<T>(preActionLog: string, action: Awaitable<T> | (() => Awaitable<T>)): Promise<T> {
  const spinner = new Spinner(`${preActionLog}... `).start();

  const result = await Result.fromAsync<T, Error>(async () => {
    const executedFunctionResult = isFunction(action) ? action() : action;
    const returnValue = isThenable(executedFunctionResult) ? ((await executedFunctionResult) as T) : executedFunctionResult;
    return returnValue;
  });

  if (result.isErr()) {
    spinner.error({ text: red(result.unwrapErr().message) });
    process.exit(1);
  }

  spinner.success();
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

  return options.tagTemplate
    .replaceAll('{{new-version}}', newVersion)
    .replaceAll('{{org}}', options.org)
    .replaceAll('{{name}}', options.name)
    .replaceAll('{{full-name}}', getFullPackageName(options));
}

export function resolveGitHubReleaseNameTemplate(options: Options, newVersion: string) {
  if (isNullishOrEmpty(options.githubReleaseNameTemplate)) return undefined;

  return options.githubReleaseNameTemplate
    .replaceAll('{{new-version}}', newVersion)
    .replaceAll('{{org}}', options.org)
    .replaceAll('{{name}}', options.name)
    .replaceAll('{{full-name}}', getFullPackageName(options));
}

/** Resolves the release-as prefix */
export function getReleaseType(options: Options, bumperRecommendation: BumperRecommendation): ReleaseType {
  return ((options.preid ? 'pre' : '') + bumperRecommendation.releaseType) as ReleaseType;
}

/**
 * Retrieves the GitHub repo, either from the environment variables or from the config
 *
 * The order of precedence is:
 * 1. Environment variable `GIT_REPO`
 * 2. The `githubRepo` property in the options object
 *
 * @param options The options object
 * @returns The GitHub repo or `undefined` if it was not found
 */
export function getGitRepo(options: Options): string | undefined {
  return process.env.GIT_REPO ?? (options.gitRepo === 'auto' ? `${options.org}/${options.name}` : options.gitRepo) ?? undefined;
}

/**
 * Retrieves the GitHub token, either from the environment variables or from the config
 *
 * The order of precedence is:
 * 1. Environment variable `GITHUB_TOKEN`
 * 2. Environment variable `GH_TOKEN`
 * 3. Environment variable `GITLAB_TOKEN`
 * 4. Environment variable `GITEA_TOKEN`
 * 4. Environment variable `BITBUCKET_TOKEN`
 * 5. The `githubToken` property in the options object
 *
 * @param options The options object
 * @returns The GitHub token or `undefined` if it was not found
 */
export function getGitToken(options: Options): string | undefined {
  return (
    process.env.GITHUB_TOKEN ??
    process.env.GH_TOKEN ??
    process.env.GITLAB_TOKEN ??
    process.env.GITEA_TOKEN ??
    process.env.BITBUCKET_TOKEN ??
    options.gitToken ??
    undefined
  );
}

/**
 * Gets SHA1 hashes for the given array of commits.
 *
 * @param commits - The array of commits to calculate the SHA1 hashes for.
 * @returns The concatenated SHA1 hashes separated by a space.
 */
export function getSHA1HashesArray(commits?: string[]): string[] {
  return (commits ?? []).filter(isValidSHA1);
}

/**
 * Generates a regular expression pattern that matches any of the SHA1 hashes in the given array of commits.
 *
 * @param commits - An array of SHA1 hashes representing commits.
 * @returns A regular expression pattern that matches any of the SHA1 hashes.
 */
export function getSHA1HashesRegexp(commits?: string[]): RegExp {
  return new RegExp(getSHA1HashesArray(commits ?? []).join('|'));
}

const sha1regex = /^[a-fA-F0-9]{40}$/;
/**
 * Checks if a given string is a valid SHA1 hash.
 *
 * @param string - The string to be checked.
 * @returns `true` if the string is a valid SHA1 hash, `false` otherwise.
 */
function isValidSHA1(string: string): boolean {
  return sha1regex.test(string);
}
