import { packageCwd } from '#lib/constants';
import { container } from '#lib/container';
import { readPackageJson, writePackageJson } from '#lib/package-json-parser';
import { doActionAndLog, getReleaseType } from '#lib/utils';
import { isNullishOrEmpty } from '@sapphire/utilities';
import type { Options } from 'commander';
import type { BumperRecommendation } from 'conventional-recommended-bump';
import { join } from 'node:path';
import Semver from 'semver';

export function bumpVersion(options: Options, bumperRecommendation: BumperRecommendation) {
  return doActionAndLog('Bumping version in package.json', async () => {
    const packageJsonPath = join(packageCwd, 'package.json');
    const packageJsonContent = await readPackageJson(packageJsonPath);

    const currentVersion = packageJsonContent.version;
    const currentClean = Semver.clean(currentVersion);

    if (isNullishOrEmpty(currentClean)) {
      container.logger.fatal('No current version was found. Make sure there is a package.json at your current working directory');
      process.exit(1);
    }

    const newVersion = Semver.inc(currentClean, `${getReleaseType(options, bumperRecommendation)}`, options.preid ?? '', options.identifierBase);

    if (isNullishOrEmpty(newVersion)) {
      container.logger.fatal('Failed to assign new version.', [
        `The resolved current version is ${currentVersion} which was cleaned to ${currentClean} by semver clean`,
        `A bump with release type ${bumperRecommendation.releaseType} was attempted but failed`,
        'Either validate your setup or contact the developer with reproducible code.'
      ]);
      process.exit(1);
    }

    packageJsonContent.version = newVersion;

    if (!options.dryRun) {
      await writePackageJson(packageJsonPath, packageJsonContent);
    }

    return newVersion;
  });
}
