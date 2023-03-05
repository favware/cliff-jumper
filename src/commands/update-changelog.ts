import { doActionAndLog, getGitRootDirection, resolveTagTemplate } from '#lib/utils';
import { isNullishOrEmpty } from '@sapphire/utilities';
import type { Options } from 'commander';
import { execSync } from 'node:child_process';

export function updateChangelog(options: Options, newVersion: string) {
  const repositoryRootDirectory = getGitRootDirection();

  resolveTagTemplate(options, newVersion);

  return doActionAndLog('Updating Changelog', () => {
    if (!options.dryRun) {
      execSync(
        `npx git-cliff --tag ${options.tagTemplate} --prepend ./CHANGELOG.md -u -c ./cliff.toml ${
          isNullishOrEmpty(repositoryRootDirectory) ? '' : `-r ${repositoryRootDirectory}/ --include-path "${options.packagePath}/*"`
        }`
      );
    }
  });
}
