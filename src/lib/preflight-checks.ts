import { commandExists } from '#lib/commandExists';
import { packageCwd } from '#lib/constants';
import { fileExists } from '#lib/fileExists';
import { logVerboseError } from '#lib/logger';
import { doActionAndLog, readJson } from '#lib/utils';
import type { OptionValues } from 'commander';
import { join } from 'path';

export async function preflightChecks(options: OptionValues) {
  const packageJsonPath = join(packageCwd, 'package.json');

  const packageJsonExistsInCwd = await doActionAndLog(
    'Checking if package.json exists in the current working directory',
    fileExists(packageJsonPath)
  );

  if (!packageJsonExistsInCwd) {
    logVerboseError({
      text: ['No package.json detected at current directory'],
      exitAfterLog: true,
      verbose: options.verbose
    });
  }

  const packageJsonContent = await doActionAndLog<any>(
    'Checking if package.json has a version property', //
    readJson(packageJsonPath)
  );

  if (!packageJsonContent.version) {
    logVerboseError({
      text: ['package.json does not have a version property'],
      exitAfterLog: true,
      verbose: options.verbose
    });
  }

  const hasCliffConfigAtCwd = await doActionAndLog(
    'Checking if a cliff.toml exists in the current working directory', //
    fileExists(join(packageCwd, 'cliff.toml'))
  );

  if (!hasCliffConfigAtCwd) {
    logVerboseError({
      text: ['No cliff.toml detected at current directory'],
      exitAfterLog: true,
      verbose: options.verbose
    });
  }

  const hasChangelogFileAtCwd = await doActionAndLog(
    'Checking if a CHANGELOG.md exists in the current working directory', //
    fileExists(join(packageCwd, 'CHANGELOG.md'))
  );

  if (!hasChangelogFileAtCwd) {
    logVerboseError({
      text: ['No CHANGELOG.md detected at current directory'],
      exitAfterLog: true,
      verbose: options.verbose
    });
  }

  const hasGitCliff = await doActionAndLog(
    'Checking if git-cliff is installed', //
    commandExists('git cliff')
  );

  if (!hasGitCliff) {
    logVerboseError({
      text: ['Git Cliff was not detected. You can install it from https://github.com/orhun/git-cliff'],
      exitAfterLog: true,
      verbose: options.verbose
    });
  }
}
