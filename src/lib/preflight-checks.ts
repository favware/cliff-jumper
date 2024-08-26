import { changelogPath, cliffTomlPath, packageCwd } from '#lib/constants';
import { container } from '#lib/container';
import { createFile } from '#lib/create-file';
import { fileExists } from '#lib/file-exists';
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

  checkPackageJsonExists(packageJsonExistsInCwd);

  const packageJsonContent = await doActionAndLog<any>(
    'Checking if package.json has a version property', //
    readJson(packageJsonPath)
  );

  checkPackageHasVersion(packageJsonContent);

  if (!options.skipTag) {
    const hasCliffConfigAtCwd = await doActionAndLog(
      'Checking if a cliff.toml exists in the current working directory', //
      fileExists(cliffTomlPath)
    );

    checkHasGitCliffConfig(hasCliffConfigAtCwd);

    const hasChangelogFileAtCwd = await doActionAndLog(
      'Checking if a changelog file exists in the current working directory', //
      fileExists(changelogPath(options.changelogPrependFile))
    );

    await checkHasChangelogFile(hasChangelogFileAtCwd, options);
  }
}

function checkName(options: Options) {
  if (isNullishOrEmpty(options.name)) {
    container.logger.fatal('No package name was provided (`-n`, or `--name` as cli flags, or `name` in config file)');
    process.exit(1);
  }
}

function checkPackagePath(options: Options) {
  if (isNullishOrEmpty(options.packagePath)) {
    container.logger.fatal('No package path was provided (`-p`, or `--package-path` as cli flags, or `packagePath` in config file)');
    process.exit(1);
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
      container.logger.fatal(
        'GitHub configurations was provided but no token was provided',
        'You can provide the token either through the "--github-token" option one of the possible environment variables',
        '(see --help for the full list)'
      );
      process.exit(1);
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

function checkPackageJsonExists(packageJsonExistsInCwd: boolean) {
  if (!packageJsonExistsInCwd) {
    container.logger.fatal('No package.json detected at current directory');
    process.exit(1);
  }
}

function checkPackageHasVersion(packageJsonContent: any) {
  if (!packageJsonContent.version) {
    container.logger.fatal('package.json does not have a version property');
    process.exit(1);
  }
}

function checkHasGitCliffConfig(hasCliffConfigAtCwd: boolean) {
  if (!hasCliffConfigAtCwd) {
    container.logger.fatal('No cliff.toml detected at current directory');
    process.exit(1);
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
