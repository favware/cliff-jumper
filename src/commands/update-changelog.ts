import { doActionAndLog, getGitRootDirection } from '#lib/utils';
import type { OptionValues } from 'commander';
import { execa } from 'execa';

export async function updateChangelog(options: OptionValues, tag: string) {
  return doActionAndLog(
    'Updating Changelog',
    execa('git-cliff', [
      '--tag',
      `"${tag}"`,
      '--prepend',
      './CHANGELOG.md',
      '-u',
      '-c',
      './cliff.toml',
      '-r',
      `${(await getGitRootDirection()) || '.'}/`,
      '--include-path',
      `"${options.packagePath}/*"`
    ])
  );
}
