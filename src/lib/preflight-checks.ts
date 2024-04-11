import { packageCwd } from '#lib/constants';
import { createFile } from '#lib/createFile';
import { fileExists } from '#lib/fileExists';
import { logVerboseError } from '#lib/logger';
import { doActionAndLog, getGitHubRepo, getGitHubToken, readJson } from '#lib/utils';
import { isNullishOrEmpty } from '@sapphire/utilities';
import type { Options } from 'commander';
import { join } from 'node:path';

export async function preflightChecks(options: Options) {
  checkName(options);

  checkPacakgePath(options);

  checkGitHubConfig(options);

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
      fileExists(join(packageCwd, 'cliff.toml'))
    );

    checkHasGitCliffConfig(hasCliffConfigAtCwd, options);

    const hasChangelogFileAtCwd = await doActionAndLog(
      'Checking if a CHANGELOG.md exists in the current working directory', //
      fileExists(join(packageCwd, 'CHANGELOG.md'))
    );

    if (!hasChangelogFileAtCwd) {
      if (options.firstRelease) {
        await doActionAndLog(
          'Creating an empty CHANGELOG.md file in the current working directory', //
          createFile(join(packageCwd, 'CHANGELOG.md'))
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

function checkPacakgePath(options: Options) {
  if (isNullishOrEmpty(options.packagePath)) {
    logVerboseError({
      text: ['No package path was provided (`-p`, or `--package-path` as cli flags, or `packagePath` in config file)'],
      exitAfterLog: true,
      verbose: options.verbose
    });
  }
}

function checkGitHubConfig(options: Options) {
  const githubRepo = getGitHubRepo(options);
  if (!isNullishOrEmpty(githubRepo)) {
    const githubToken = getGitHubToken(options);

    if (isNullishOrEmpty(githubToken)) {
      logVerboseError({
        text: [`GitHub Repository was configured as ${githubRepo} but no token was provided`],
        verboseText: [
          'You can provide the token either through the "--github-token" option one of the possible environment variables',
          '(see --help for the full list)'
        ],
        exitAfterLog: true,
        verbose: options.verbose
      });
    }
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
