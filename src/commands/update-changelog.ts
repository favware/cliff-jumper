import { doActionAndLog, getGitHubRepo, getGitHubToken, getGitRootDirection, resolveTagTemplate } from '#lib/utils';
import { isNullishOrEmpty } from '@sapphire/utilities';
import type { Options } from 'commander';
import { runGitCliff, type Options as GitCliffOptions } from 'git-cliff';

export async function updateChangelog(options: Options, newVersion: string) {
  const repositoryRootDirectory = await getGitRootDirection();

  resolveTagTemplate(options, newVersion);

  return doActionAndLog('Updating Changelog', async () => {
    if (!options.dryRun) {
      const gitCliffOptions: GitCliffOptions = {
        tag: options.tagTemplate,
        prepend: './CHANGELOG.md',
        unreleased: true,
        config: './cliff.toml'
      };

      if (!isNullishOrEmpty(repositoryRootDirectory)) {
        gitCliffOptions.repository = repositoryRootDirectory;
        gitCliffOptions.includePath = `${options.packagePath}/*`;
      }

      const githubToken = getGitHubToken(options);
      const githubRepo = getGitHubRepo(options);
      if (!isNullishOrEmpty(githubRepo) && !isNullishOrEmpty(githubToken)) {
        const resolvedGitHubRepo = githubRepo === 'auto' ? `${options.org}/${options.name}` : `${githubRepo}`;

        gitCliffOptions.githubRepo = resolvedGitHubRepo;
        gitCliffOptions.githubToken = githubToken;
      }

      await runGitCliff(gitCliffOptions, { stdio: 'ignore' });
    }
  });
}
