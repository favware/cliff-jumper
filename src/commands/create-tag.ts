import { doActionAndLog, getFullPackageName } from '#lib/utils';
import { isNullishOrEmpty } from '@sapphire/utilities';
import type { OptionValues } from 'commander';
import { execSync } from 'node:child_process';

export function createTag(options: OptionValues, newVersion: string) {
  if (isNullishOrEmpty(options.tagTemplate)) {
    if (isNullishOrEmpty(options.org)) {
      options.tagTemplate = 'v{{new-version}}';
    } else {
      options.tagTemplate = `{{full-name}}@{{new-version}}`;
    }
  }

  options.tagTemplate = options.tagTemplate
    .replaceAll('{{new-version}}', newVersion)
    .replaceAll('{{org}}', options.org)
    .replaceAll('{{name}}', options.name)
    .replaceAll('{{full-name}}', getFullPackageName(options));

  return doActionAndLog(
    'Creating tag', //
    execSync(`git tag ${options.tagTemplate}`)
  );
}
