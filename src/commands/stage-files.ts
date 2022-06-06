import { doActionAndLog } from '#lib/utils';
import type { OptionValues } from 'commander';
import { execSync } from 'node:child_process';

export function stageFiles(options: OptionValues) {
  return doActionAndLog(
    'Staging package.json and CHANGELOG.md', //
    () => {
      if (!options.dryRun) {
        execSync('git add package.json CHANGELOG.md');
      }
    }
  );
}
