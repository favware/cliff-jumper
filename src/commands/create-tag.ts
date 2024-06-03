import { doActionAndLog, resolveTagTemplate } from '#lib/utils';
import type { Options } from 'commander';
import { execa } from 'execa';

export function createTag(options: Options, newVersion: string) {
  return doActionAndLog('Creating tag', async () => {
    if (!options.dryRun) {
      await execa('git', ['tag', resolveTagTemplate(options, newVersion)]);
    }
  });
}
