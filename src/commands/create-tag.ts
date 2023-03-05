import { doActionAndLog, resolveTagTemplate } from '#lib/utils';
import type { Options } from 'commander';
import { execSync } from 'node:child_process';

export function createTag(options: Options, newVersion: string) {
  resolveTagTemplate(options, newVersion);

  return doActionAndLog(
    'Creating tag', //
    () => {
      if (!options.dryRun) {
        execSync(`git tag ${options.tagTemplate}`);
      }
    }
  );
}
