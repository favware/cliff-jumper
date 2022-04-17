import { doActionAndLog, getFullPackageName } from '#lib/utils';
import type { OptionValues } from 'commander';
import { execa } from 'execa';

export function commitRelease(options: OptionValues, newVersion: string) {
  return doActionAndLog(
    'Committing release', //
    execa('git', ['commit', '--no-verify', '-m', `chore(${options.name}): release ${getFullPackageName(options)}@${newVersion}`])
  );
}
