import { doActionAndLog, getFullPackageName } from '#lib/utils';
import type { OptionValues } from 'commander';
import { execSync } from 'node:child_process';

export function commitRelease(options: OptionValues, newVersion: string) {
  return doActionAndLog(
    'Committing release', //
    execSync(`git commit --no-verify -m chore(${options.name}): release ${getFullPackageName(options)}@${newVersion}`)
  );
}
