import { doActionAndLog } from '#lib/utils';
import { execSync } from 'node:child_process';

export function createTag(tag: string) {
  return doActionAndLog(
    'Creating tag', //
    execSync(`git tag ${tag}`)
  );
}
