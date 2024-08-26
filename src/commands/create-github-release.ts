import { OctokitRequestHeaders } from '#lib/constants';
import { container } from '#lib/container';
import { removeHeaderFromChangelogSection } from '#lib/parse-cliff-toml';
import { stringify } from '#lib/setup-logger';
import { doActionAndLog, getGitHubRepo, getGitHubToken, resolveGitHubReleaseNameTemplate, resolveTagTemplate } from '#lib/utils';
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
        const newVersionName = resolveTagTemplate(options, newVersion);

        const releaseName = resolveGitHubReleaseNameTemplate(options, newVersionName);
        const shouldGenerateReleaseNotes = typeof changelogSection === 'undefined';
        const makeLatestRelease = isLatestRelease ? 'true' : 'false';

        container.logger.debug(
          'GitHub Release Payload: \n',
          stringify({
            owner: repoOwner,
            repo: repoName,
            tag_name: newVersionName,
            body: releaseBody,
            draft: options.githubReleaseDraft,
            generate_release_notes: shouldGenerateReleaseNotes,
            headers: OctokitRequestHeaders,
            make_latest: makeLatestRelease,
            name: releaseName
          })
        );

        await octokit.request('POST /repos/{owner}/{repo}/releases', {
          owner: repoOwner,
          repo: repoName,
          tag_name: newVersionName,
          body: releaseBody,
          draft: options.githubReleaseDraft,
          generate_release_notes: shouldGenerateReleaseNotes,
          headers: OctokitRequestHeaders,
          make_latest: makeLatestRelease,
          name: releaseName,
          prerelease: options.githubReleasePrerelease
        });
      }
    }
  });
}
