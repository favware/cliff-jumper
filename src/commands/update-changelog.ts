import { doActionAndLog, getGitRepo, getGitRootDirection, getGitToken, getSHA1HashesArray, resolveTagTemplate } from '#lib/utils';
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
      skipCommit: Array.isArray(options.skipCommit) ? getSHA1HashesArray(options.skipCommit) : undefined
    };

    if (!isNullishOrEmpty(repositoryRootDirectory)) {
      gitCliffOptions.repository = repositoryRootDirectory;
      gitCliffOptions.includePath = `${options.packagePath}/*`;
    }

    const gitToken = getGitToken(options);
    const gitRepo = getGitRepo(options);
    const { gitHostVariant } = options;
    if (!isNullishOrEmpty(gitRepo) && !isNullishOrEmpty(gitToken)) {
      const resolvedGitRepo = gitRepo === 'auto' ? `${options.org}/${options.name}` : `${gitRepo}`;

      if (gitHostVariant === 'github') {
        gitCliffOptions.githubRepo = resolvedGitRepo;
        gitCliffOptions.githubToken = gitToken;
      } else if (gitHostVariant === 'gitea') {
        gitCliffOptions.giteaRepo = resolvedGitRepo;
        gitCliffOptions.giteaToken = gitToken;
      } else if (gitHostVariant === 'gitlab') {
        gitCliffOptions.gitlabRepo = resolvedGitRepo;
        gitCliffOptions.gitlabToken = gitToken;
      } else if (gitHostVariant === 'bitbucket') {
        gitCliffOptions.bitbucketRepo = resolvedGitRepo;
        gitCliffOptions.bitbucketToken = gitToken;
      }
    }

    if (!options.dryRun) {
      const result = await runGitCliff(gitCliffOptions, { stdio: options.githubRelease ? 'pipe' : 'ignore' });
      return result.stdout as string;
    }

    return undefined;
  });
}
