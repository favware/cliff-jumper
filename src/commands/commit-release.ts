import { doActionAndLog, getFullPackageName } from '#lib/utils';
import { isNullishOrEmpty } from '@sapphire/utilities';
import type { Options } from 'commander';
import { execSync } from 'node:child_process';

export function commitRelease(options: Options, newVersion: string) {
  if (isNullishOrEmpty(options.commitMessageTemplate)) {
    options.commitMessageTemplate = 'chore({{name}}): release {{full-name}}@{{new-version}}';
  }

  options.commitMessageTemplate = options.commitMessageTemplate
    .replaceAll('{{new-version}}', newVersion)
    .replaceAll('{{name}}', options.name)
    .replaceAll('{{full-name}}', getFullPackageName(options));

  return doActionAndLog(
    'Committing release', //
    () => {
      if (!options.dryRun) {
        execSync(`git commit --no-verify -m "${options.commitMessageTemplate}"`);
      }
    }
  );
}
