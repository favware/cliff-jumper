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
import { doActionAndLog, getFullPackageName, usesModernYarn } from '#lib/utils';
import { isNullishOrEmpty } from '@sapphire/utilities';
import { blue, blueBright, cyan, green, yellow } from 'colorette';
import { Command } from 'commander';
import { readFile } from 'node:fs/promises';
import { URL } from 'node:url';

const packageFile = new URL('package.json', cliRootDir);
const packageJson = JSON.parse(await readFile(packageFile, 'utf-8'));

const monoRepoDescription = [
  'Whether the package to be bumped resides in a mono repo,',
  'which enables Lerna-like scanning for what kind of version bump should be applied',
  'Defaults to "true" when "org" is set, false otherwise'
].join('\n');

const command = new Command()
  .version(packageJson.version)
  .option('-n, --name <string>', 'The package name to release')
  .option('-p, --package-path <string>', 'The path to the current package. For non-monorepos this is just "."')
  .option(
    '--dry-run',
    'Whether the package should be bumped or not. When this is set no actions will be taken and only the release strategy will be logged'
  )
  .option('--first-release', 'Whether this is the first release (skips bumping the version)')
  .option('--mono-repo', monoRepoDescription)
  .option('--no-mono-repo', monoRepoDescription)
  .option('-o, --org <string>', 'The NPM org scope that should be used WITHOUT "@" sign or trailing "/"')
  .option('--preid [string]', 'The "prerelease identifier" to use as a prefix for the "prerelease" part of a semver')
  .option(
    '-c, --commit-message-template [string]',
    [
      'A custom commit message template to use.',
      'Defaults to "chore({{name}}): release {{full-name}}@{{new-version}}"',
      'You can use "{{new-version}}" in your template which will be dynamically replaced with whatever the new version is that will be published.',
      'You can use "{{name}}" in your template, this will be replaced with the name provided through "-n", "--name" or the same value set in your config file.',
      'You can use "{{full-name}}" in your template, this will be replaced "{{name}}" (when "org" is not provided), or "@{{org}}/{{name}}" (when "org" is provided).'
    ].join('\n')
  )
  .option(
    '--tag-template [string]',
    [
      'A custom tag template to use.',
      'When "org" is provided this will default to "@{{org}}/{{name}}@{{new-version}}", for example "@favware/cliff-jumper@1.0.0"',
      'When "org" is not provided this will default to "v{{new-version}}", for example "v1.0.0"',
      'You can use "{{new-version}}" in your template which will be dynamically replaced with whatever the new version is that will be published.',
      'You can use "{{org}}" in your template, this will be replaced with the org provided through "-o", "--org" or the same value set in your config file.',
      'You can use "{{name}}" in your template, this will be replaced with the name provided through "-n", "--name" or the same value set in your config file.',
      'You can use "{{full-name}}" in your template, this will be replaced "{{name}}" (when "org" is not provided), or "@{{org}}/{{name}}" (when "org" is provided).'
    ].join('\n')
  )
  .option(
    '--skip-changelog',
    [
      'Whether to skip updating your CHANGELOG.md', //
      'default "true" when CI=true, "false" otherwise'
    ].join('\n'),
    isCi
  )
  .option(
    '-t, --skip-tag',
    [
      'Whether to skip creating a git tag', //
      'default "true" when CI=true, "false" otherwise'
    ].join('\n'),
    isCi
  )
  .option('-v, --verbose', 'Whether to print verbose information', false);

const program = command.parse(process.argv);
const options = await parseOptionsFile(program.opts());

logVerboseInfo(
  [
    'Resolved options: ',
    `${indent}name: ${JSON.stringify(options.name)}`,
    `${indent}package path: ${JSON.stringify(options.packagePath)}`,
    `${indent}dry run: ${JSON.stringify(options.dryRun)}`,
    `${indent}first release: ${JSON.stringify(options.firstRelease)}`,
    `${indent}mono repo: ${JSON.stringify(options.monoRepo)}`,
    `${indent}npm org: ${JSON.stringify(options.org)}`,
    `${indent}preid: ${JSON.stringify(options.preid)}`,
    `${indent}commit message template: ${JSON.stringify(options.commitMessageTemplate)}`,
    `${indent}tag template: ${JSON.stringify(options.tagTemplate)}`,
    `${indent}skip changelog: ${JSON.stringify(options.skipChangelog)}`,
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
  cyan(
    `${blue('ℹ️')} Bumping the ${yellow(`${releasePrefix}${releaseType}`)} version of ${blueBright(getFullPackageName(options))}: ${yellow(reason!)}`
  )
);

if (!options.dryRun) {
  if (!options.firstRelease) {
    await bumpVersion(options, releaseType!);
  }

  if (!options.skipChangelog) {
    const newVersion = await getNewVersion(options);
    const tagForChangelog = options.org && options.monoRepo ? `${getFullPackageName(options)}@${newVersion}` : `v${newVersion}`;

    await updateChangelog(options, tagForChangelog);

    if (!options.skipTag) {
      await stageFiles();

      await commitRelease(options, newVersion);

      await createTag(options, newVersion);

      const hasYarn = await usesModernYarn();

      console.info(blue('ℹ️') + green(` Run \`git push && git push --tags && ${hasYarn ? 'yarn ' : ''}npm publish\` to publish`));
    }
  }
}
