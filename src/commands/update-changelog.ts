import { doActionAndLog, getFullPackageName, getGitRootDirection } from '#lib/utils';
import { isNullishOrEmpty } from '@sapphire/utilities';
import type { OptionValues } from 'commander';
import { execSync } from 'node:child_process';

export function updateChangelog(options: OptionValues, newVersion: string) {
  const repositoryRootDirectory = getGitRootDirection();

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

  return doActionAndLog(
    'Updating Changelog',
    execSync(
      `git cliff --tag ${options.tagTemplate} --prepend ./CHANGELOG.md -u -c ./cliff.toml ${
        isNullishOrEmpty(repositoryRootDirectory) ? '' : `-r ${repositoryRootDirectory}/ --include-path "${options.packagePath}/*"`
      }`
    )
  );
}
