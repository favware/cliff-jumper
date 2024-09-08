import { doActionAndLog, getGitHubRepo, getGitHubToken, getGitRootDirection, getSHA1HashesArray, resolveTagTemplate } from '#lib/utils';
import { isNullishOrEmpty } from '@sapphire/utilities';
import type { Options } from 'commander';
import { runGitCliff, type Options as GitCliffOptions } from 'git-cliff';

export async function updateChangelog(options: Options, newVersion: string) {
  const repositoryRootDirectory = await getGitRootDirection();

  return doActionAndLog('Updating Changelog', async () => {
    const gitCliffOptions: GitCliffOptions = {
      tag: resolveTagTemplate(options, newVersion),
      prepend: options.changelogPrependFile ?? './CHANGELOG.md',
      unreleased: true,
      config: './cliff.toml',
      output: '-',
      skipCommit: getSHA1HashesArray(options.skipCommit)
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

    if (!options.dryRun) {
      const result = await runGitCliff(gitCliffOptions, { stdio: options.githubRelease ? 'pipe' : 'ignore' });
      return result.stdout;
    }

    return undefined;
  });
}
