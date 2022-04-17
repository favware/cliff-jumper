import { doActionAndLog } from '#lib/utils';
import { execa } from 'execa';

export function createTag(tag: string) {
  return doActionAndLog(
    'Creating tag', //
    execa('git', ['tag', tag])
  );
}
