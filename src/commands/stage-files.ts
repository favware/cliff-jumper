import { doActionAndLog } from '#lib/utils';
import { execSync } from 'node:child_process';

export function stageFiles() {
  return doActionAndLog(
    'Staging package.json and CHANGELOG.md', //
    execSync('git add package.json CHANGELOG.md')
  );
}
