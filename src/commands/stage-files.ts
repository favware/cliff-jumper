import { doActionAndLog } from '#lib/utils';
import { execa } from 'execa';

export function stageFiles() {
  return doActionAndLog(
    'Staging package.json and CHANGELOG.md', //
    execa('git', ['add', 'package.json', 'CHANGELOG.md'])
  );
}
