import { doActionAndLog, getFullPackageName } from '#lib/utils';
import type { OptionValues } from 'commander';
import { execSync } from 'node:child_process';

export function getNewVersion(options: OptionValues) {
  return doActionAndLog<string>(
    'Retrieving new version', //
    JSON.parse(execSync('npm version --json', { encoding: 'utf-8' }))[getFullPackageName(options)]
  );
}
