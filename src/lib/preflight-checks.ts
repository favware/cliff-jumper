import { changelogPath, cliffTomlPath, packageCwd } from '#lib/constants';
import { createFile } from '#lib/create-file';
import { fileExists } from '#lib/file-exists';
import { logVerboseError } from '#lib/logger';
import { doActionAndLog, getGitRepo, getGitToken, readJson } from '#lib/utils';
import { isNullishOrEmpty } from '@sapphire/utilities';
import type { Options } from 'commander';
import { join } from 'node:path';

export async function preflightChecks(options: Options) {
  checkName(options);

  checkPackagePath(options);

  await checkGitConfig(options);

  const packageJsonPath = join(packageCwd, 'package.json');

  const packageJsonExistsInCwd = await doActionAndLog(
    'Checking if package.json exists in the current working directory',
    fileExists(packageJsonPath)
  );

  checkPackageJsonExists(packageJsonExistsInCwd, options);

  const packageJsonContent = await doActionAndLog<any>(
    'Checking if package.json has a version property', //
    readJson(packageJsonPath)
  );

  checkPackageHasVersion(packageJsonContent, options);

  if (!options.skipTag) {
    const hasCliffConfigAtCwd = await doActionAndLog(
      'Checking if a cliff.toml exists in the current working directory', //
      fileExists(cliffTomlPath)
    );

    checkHasGitCliffConfig(hasCliffConfigAtCwd, options);

    const hasChangelogFileAtCwd = await doActionAndLog(
      'Checking if a changelog file exists in the current working directory', //
      fileExists(changelogPath(options.changelogPrependFile))
    );

    await checkHasChangelogFile(hasChangelogFileAtCwd, options);
  }
}

function checkName(options: Options) {
  if (isNullishOrEmpty(options.name)) {
    logVerboseError({
      text: ['No package name was provided (`-n`, or `--name` as cli flags, or `name` in config file)'],
      exitAfterLog: true,
      verbose: options.verbose
    });
  }
}

function checkPackagePath(options: Options) {
  if (isNullishOrEmpty(options.packagePath)) {
    logVerboseError({
      text: ['No package path was provided (`-p`, or `--package-path` as cli flags, or `packagePath` in config file)'],
      exitAfterLog: true,
      verbose: options.verbose
    });
  }
}

async function checkGitConfig(options: Options) {
  await doActionAndLog(
    'Checking Git repository configuration', //
    () => {
      if (options.gitRepo === 'auto' && (!options.org || !options.name)) {
        throw new Error(
          '`githubRepo` was set to `auto` and the GitHub repository could not be resolved. When using the auto option, please provide the org and name options'
        );
      }
    }
  );

  const gitRepo = getGitRepo(options);
  const gitToken = getGitToken(options);
  const { gitHostVariant, githubRelease, githubReleaseDraft, githubReleasePrerelease, githubReleaseLatest, githubReleaseNameTemplate, pushTag } =
    options;

  if (
    !isNullishOrEmpty(gitRepo) ||
    githubRelease ||
    githubReleaseDraft ||
    githubReleasePrerelease ||
    githubReleaseLatest ||
    !isNullishOrEmpty(githubReleaseNameTemplate)
  ) {
    if (isNullishOrEmpty(gitToken)) {
      logVerboseError({
        text: [`Git configurations was provided but no token was provided`],
        verboseText: [
          'You can provide the token either through the "--git-token" option one of the possible environment variables',
          '(see --help for the full list)'
        ],
        exitAfterLog: true,
        verbose: options.verbose
      });
    }
  }

  if (gitHostVariant === 'github') {
    await doActionAndLog(
      'Checking GitHub releasing configuration', //
      () => {
        if (
          (!githubRelease || !pushTag) &&
          (githubReleaseDraft || githubReleasePrerelease || githubReleaseLatest || !isNullishOrEmpty(githubReleaseNameTemplate))
        ) {
          throw new Error(
            'You can only use --github-release-draft, --github-release-latest, --github-release-name-template, and --github-release-pre-release when both --github-release and --push-tag are provided'
          );
        }
      }
    );
  }
}

function checkPackageJsonExists(packageJsonExistsInCwd: boolean, options: Options) {
  if (!packageJsonExistsInCwd) {
    logVerboseError({
      text: ['No package.json detected at current directory'],
      exitAfterLog: true,
      verbose: options.verbose
    });
  }
}

function checkPackageHasVersion(packageJsonContent: any, options: Options) {
  if (!packageJsonContent.version) {
    logVerboseError({
      text: ['package.json does not have a version property'],
      exitAfterLog: true,
      verbose: options.verbose
    });
  }
}

function checkHasGitCliffConfig(hasCliffConfigAtCwd: boolean, options: Options) {
  if (!hasCliffConfigAtCwd) {
    logVerboseError({
      text: ['No cliff.toml detected at current directory'],
      exitAfterLog: true,
      verbose: options.verbose
    });
  }
}

async function checkHasChangelogFile(hasChangelogFileAtCwd: boolean, options: Options) {
  if (!hasChangelogFileAtCwd) {
    await doActionAndLog(
      'Creating an empty changelog file in the current working directory', //
      createFile(changelogPath(options.changelogPrependFile))
    );
  }
}
