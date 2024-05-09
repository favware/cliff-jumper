import { doActionAndLog } from '#lib/utils';
import type { Options } from 'commander';
import { execa } from 'execa';

export function pushTag(options: Options) {
  return doActionAndLog('Pushing tag', async () => {
    if (!options.dryRun) {
      await execa('git', ['push']);
      await execa('git', ['push', '--tags']);
    }
  });
}
