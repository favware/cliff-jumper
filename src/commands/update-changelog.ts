import { doActionAndLog, getGitHubRepo, getGitHubToken, getGitRootDirection, resolveTagTemplate } from '#lib/utils';
import { isNullishOrEmpty } from '@sapphire/utilities';
import type { Options } from 'commander';
import { execSync } from 'node:child_process';

export function updateChangelog(options: Options, newVersion: string) {
  const repositoryRootDirectory = getGitRootDirection();

  resolveTagTemplate(options, newVersion);

  return doActionAndLog('Updating Changelog', () => {
    if (!options.dryRun) {
      const monoRepoConfig = isNullishOrEmpty(repositoryRootDirectory)
        ? ''
        : `-r ${repositoryRootDirectory}/ --include-path "${options.packagePath}/*"`;
      let githubConfig = '';

      const githubToken = getGitHubToken(options);
      const githubRepo = getGitHubRepo(options);
      if (!isNullishOrEmpty(githubRepo) && !isNullishOrEmpty(githubToken)) {
        const resolvedGitHubRepo = githubRepo === 'auto' ? `${options.org}/${options.name}` : `${githubRepo}`;
        githubConfig = `--github-repo ${resolvedGitHubRepo} --github-token ${githubToken}`;
      }

      execSync(`npx git-cliff --tag ${options.tagTemplate} --prepend ./CHANGELOG.md -u -c ./cliff.toml ${githubConfig} ${monoRepoConfig}`);
    }
  });
}
