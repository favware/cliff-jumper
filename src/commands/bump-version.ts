import { releasePrefix } from '#lib/constants';
import { doActionAndLog } from '#lib/utils';
import type { OptionValues } from 'commander';
import type { Callback as ConventionalChangelogCallback } from 'conventional-recommended-bump';
import { execa } from 'execa';

export function bumpVersion(options: OptionValues, releaseType: ConventionalChangelogCallback.Recommendation.ReleaseType) {
  return doActionAndLog(
    'Bumping version in package.json',
    execa(`npm`, ['version', `${releasePrefix}${releaseType}`, '--git-tag-version=false', `--preid=${options.preid}`])
  );
}
