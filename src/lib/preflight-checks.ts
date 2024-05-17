import { changelogPath, cliffTomlPath, packageCwd } from '#lib/constants';
import { createFile } from '#lib/createFile';
import { fileExists } from '#lib/fileExists';
import { logVerboseError } from '#lib/logger';
import { doActionAndLog, getGitHubRepo, getGitHubToken, readJson } from '#lib/utils';
import { isNullishOrEmpty } from '@sapphire/utilities';
import type { Options } from 'commander';
import { join } from 'node:path';

export async function preflightChecks(options: Options) {
  checkName(options);

  checkPackagePath(options);

  await checkGitHubConfig(options);

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
      'Checking if a CHANGELOG.md exists in the current working directory', //
      fileExists(changelogPath)
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

async function checkGitHubConfig(options: Options) {
  await doActionAndLog(
    'Checking GitHub repository configuration', //
    () => {
      if (options.githubRepo === 'auto' && (!options.org || !options.name)) {
        throw new Error(
          '`githubRepo` was set to `auto` and the GitHub repository could not be resolved. When using the auto option, please provide the org and name options'
        );
      }
    }
  );

  const githubRepo = getGitHubRepo(options);
  const githubToken = getGitHubToken(options);
  const { githubRelease, githubReleaseDraft, githubReleasePrerelease, githubReleaseLatest, githubReleaseNameTemplate, pushTag } = options;

  if (
    !isNullishOrEmpty(githubRepo) ||
    githubRelease ||
    githubReleaseDraft ||
    githubReleasePrerelease ||
    githubReleaseLatest ||
    !isNullishOrEmpty(githubReleaseNameTemplate)
  ) {
    if (isNullishOrEmpty(githubToken)) {
      logVerboseError({
        text: [`GitHub configurations were provided but no token was provided`],
        verboseText: [
          'You can provide the token either through the "--github-token" option one of the possible environment variables',
          '(see --help for the full list)'
        ],
        exitAfterLog: true,
        verbose: options.verbose
      });
    }
  }

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
    if (options.firstRelease) {
      await doActionAndLog(
        'Creating an empty CHANGELOG.md file in the current working directory', //
        createFile(changelogPath)
      );
    } else {
      logVerboseError({
        text: ['No CHANGELOG.md detected at current directory'],
        exitAfterLog: true,
        verbose: options.verbose
      });
    }
  }
}
