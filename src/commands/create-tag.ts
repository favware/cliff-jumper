import { doActionAndLog, resolveTagTemplate } from '#lib/utils';
import type { OptionValues } from 'commander';
import { execSync } from 'node:child_process';

export function createTag(options: OptionValues, newVersion: string) {
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
