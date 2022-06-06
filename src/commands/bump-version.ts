import { packageCwd } from '#lib/constants';
import { logVerboseError } from '#lib/logger';
import { readPackageJson, writePackageJson } from '#lib/package-json-parser';
import { doActionAndLog, getReleaseType } from '#lib/utils';
import { isNullishOrEmpty } from '@sapphire/utilities';
import type { OptionValues } from 'commander';
import type { Callback as ConventionalChangelogCallback } from 'conventional-recommended-bump';
import { join } from 'node:path';
import Semver from 'semver';

export function bumpVersion(options: OptionValues, releaseType: ConventionalChangelogCallback.Recommendation.ReleaseType) {
  return doActionAndLog('Bumping version in package.json', async () => {
    const packageJsonPath = join(packageCwd, 'package.json');
    const packageJsonContent = await readPackageJson(packageJsonPath);

    const currentVersion = packageJsonContent.version;
    const currentClean = Semver.clean(currentVersion);

    if (isNullishOrEmpty(currentClean)) {
      return logVerboseError({
        text: ['No current version was found. Make sure there is a package.json at your current working directory'],
        logWithThrownError: true,
        verbose: options.verbose
      });
    }

    const newVersion = Semver.inc(currentClean, `${getReleaseType(options, releaseType)}`, options.preid ?? '');

    if (isNullishOrEmpty(newVersion)) {
      return logVerboseError({
        text: ['Failed to assign new version.'],
        verboseText: [
          `The resolved current version is ${currentVersion} which was cleaned to ${currentClean} by semver clean`,
          `A bump with release type ${releaseType} was attempted but failed`,
          'Either validate your setup or contact the developer with reproducible code.'
        ],
        logWithThrownError: true,
        verbose: options.verbose
      });
    }

    packageJsonContent.version = newVersion;

    if (!options.dryRun) {
      await writePackageJson(packageJsonPath, packageJsonContent);
    }
  });
}
