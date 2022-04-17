#!/usr/bin/env node

import { bumpVersion } from '#commands/bump-version';
import { commitRelease } from '#commands/commit-release';
import { createTag } from '#commands/create-tag';
import { getConventionalBump } from '#commands/get-conventional-bump';
import { getNewVersion } from '#commands/get-new-version';
import { stageFiles } from '#commands/stage-files';
import { updateChangelog } from '#commands/update-changelog';
import { cliRootDir, indent, isCi, releasePrefix } from '#lib/constants';
import { logVerboseError, logVerboseInfo } from '#lib/logger';
import { parseOptionsFile } from '#lib/optionsParser';
import { preflightChecks } from '#lib/preflight-checks';
import { doActionAndLog, getFullPackageName } from '#lib/utils';
import { isNullishOrEmpty } from '@sapphire/utilities';
import { blueBright, cyan, yellow } from 'colorette';
import { Command } from 'commander';
import { readFile } from 'node:fs/promises';
import { URL } from 'node:url';

const packageFile = new URL('package.json', cliRootDir);
const packageJson = JSON.parse(await readFile(packageFile, 'utf-8'));

const command = new Command()
  .version(packageJson.version)
  .option('-n, --name <string>', 'The package name to release')
  .option('-p, --package-path <string>', 'The path to the current package. For non-monorepos this is just "."')
  .option('-b, --bump', 'Whether the package should be bumped or not', false)
  .option('--first-release', 'Whether this is the first release (skips bumping the version)', false)
  .option('-o, --org <string>', 'The NPM org scope that should be used WITHOUT "@" sign or trailing "/"', '')
  .option('--preid [string]', 'The "prerelease identifier" to use as a prefix for the "prerelease" part of a semver', '')
  .option('-t, --skip-tag', 'Whether to skip creating a git tag (default `true` when CI=true, `false` otherwise)', isCi)
  .option('-v, --verbose', 'Whether to print verbose information', false);

const program = command.parse(process.argv);
const options = await parseOptionsFile(program.opts());

logVerboseInfo(
  [
    'Resolved options: ',
    `${indent}name: ${JSON.stringify(options.name)}`,
    `${indent}package path: ${JSON.stringify(options.packagePath)}`,
    `${indent}bump: ${JSON.stringify(options.bump)}`,
    `${indent}npm org: ${JSON.stringify(options.org)}`,
    `${indent}preid: ${JSON.stringify(options.preid)}`,
    `${indent}skip tag: ${JSON.stringify(options.skipTag)}`,
    `${indent}verbose: ${JSON.stringify(options.verbose)}`,
    ''
  ],
  options.verbose
);

await preflightChecks(options);

const { reason, releaseType } = await doActionAndLog(
  'Retrieving the strategy to use for bumping the package', //
  getConventionalBump(options)
);

if (isNullishOrEmpty(reason) || isNullishOrEmpty(releaseType)) {
  logVerboseError({
    text: [`No recommended bump level found for ${getFullPackageName(options)}`],
    exitAfterLog: true,
    verbose: options.verbose
  });
}

console.info(
  cyan(`ℹ️ Bumping the ${yellow(`${releasePrefix}${releaseType}`)} version of ${blueBright(getFullPackageName(options))}: ${yellow(reason!)}`)
);

if (options.bump) {
  if (!options.firstRelease) {
    await bumpVersion(options, releaseType!);
  }

  if (!options.skipTag) {
    const newVersion = await getNewVersion(options);
    const tag = options.org ? `${getFullPackageName(options)}@${newVersion}` : `v${newVersion}`;

    await updateChangelog(options, tag);

    await stageFiles();

    await commitRelease(options, newVersion);

    await createTag(tag);
  }
}
