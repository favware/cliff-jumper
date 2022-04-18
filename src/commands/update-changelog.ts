import { doActionAndLog, getGitRootDirection } from '#lib/utils';
import { isNullishOrEmpty } from '@sapphire/utilities';
import type { OptionValues } from 'commander';
import { execSync } from 'node:child_process';

export async function updateChangelog(options: OptionValues, tag: string) {
  const repositoryRootDirectory = await getGitRootDirection();

  return doActionAndLog(
    'Updating Changelog',
    execSync(
      `git cliff --tag ${tag} --prepend ./CHANGELOG.md -u -c ./cliff.toml ${
        isNullishOrEmpty(repositoryRootDirectory) ? '' : `-r ${repositoryRootDirectory}/ --include-path "${options.packagePath}/*"`
      }`
    )
  );
}
