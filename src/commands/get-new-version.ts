import { packageCwd } from '#lib/constants';
import { readPackageJson } from '#lib/package-json-parser';
import { doActionAndLog } from '#lib/utils';
import { join } from 'node:path';

export function getNewVersion() {
  return doActionAndLog<string>(
    'Retrieving new version', //
    async () => {
      const packageJsonPath = join(packageCwd, 'package.json');
      const packageJsonContent = await readPackageJson(packageJsonPath);
      return packageJsonContent.version;
    }
  );
}
