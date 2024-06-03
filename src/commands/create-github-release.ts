import { OctokitRequestHeaders } from '#lib/constants';
import { removeHeaderFromChangelogSection } from '#lib/parse-cliff-toml';
import { doActionAndLog, getGitHubRepo, getGitHubToken, resolveGitHubReleaseNameTemplate } from '#lib/utils';
import { createTokenAuth } from '@octokit/auth-token';
import { Octokit } from '@octokit/core';
import { retry } from '@octokit/plugin-retry';
import { isNullishOrEmpty } from '@sapphire/utilities';
import type { Options } from 'commander';

export function createGitHubRelease(options: Options, newVersion: string, changelogSection: string | undefined) {
  const HydratedOctokit = Octokit.plugin(retry).defaults({
    userAgent: 'Cliff Jumper CLI/ (@favware/cliff-jumper) (https://github.com/favware/cliff-jumper/tree/main)'
  });

  return doActionAndLog('Creating release', async () => {
    if (!options.dryRun) {
      const githubToken = getGitHubToken(options);
      const githubRepo = getGitHubRepo(options);

      if (!isNullishOrEmpty(githubRepo) && !isNullishOrEmpty(githubToken)) {
        const octokitAuth = createTokenAuth(githubToken);
        const authentication = await octokitAuth();

        const octokit = new HydratedOctokit({ auth: authentication.token });

        const [repoOwner, repoName] = githubRepo.split('/');
        const releaseBody = await removeHeaderFromChangelogSection(changelogSection);
        const isLatestRelease = options.githubReleaseLatest ?? true;

        await octokit.request('POST /repos/{owner}/{repo}/releases', {
          owner: repoOwner,
          repo: repoName,
          tag_name: newVersion,
          body: releaseBody,
          draft: options.githubReleaseDraft,
          generate_release_notes: typeof changelogSection === 'undefined',
          headers: OctokitRequestHeaders,
          make_latest: isLatestRelease ? 'true' : 'false',
          name: resolveGitHubReleaseNameTemplate(options, newVersion),
          prerelease: options.githubReleasePrerelease
        });
      }
    }
  });
}
