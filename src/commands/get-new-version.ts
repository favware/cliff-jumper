import { doActionAndLog, getFullPackageName } from '#lib/utils';
import type { OptionValues } from 'commander';
import { execa } from 'execa';

export async function getNewVersion(options: OptionValues) {
  return doActionAndLog<string>(
    'Retrieving new version', //
    JSON.parse((await execa('npm', ['version', '--json'], { encoding: 'utf-8' })).stdout)[getFullPackageName(options)]
  );
}
