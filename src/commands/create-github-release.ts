import { doActionAndLog, getGitHubRepo, getGitHubToken } from '#lib/utils';
import { isNullishOrEmpty } from '@sapphire/utilities';
import type { Options } from 'commander';

export async function createGitHubRelease(options: Options, newVersion: string) {
  return doActionAndLog('Creating release', async () => {
    if (!options.dryRun) {
      const githubToken = getGitHubToken(options);
      const githubRepo = getGitHubRepo(options);
      if (!isNullishOrEmpty(githubRepo) && !isNullishOrEmpty(githubToken)) {
      }
    }
  });
}
