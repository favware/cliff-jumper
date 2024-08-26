import { container } from '#lib/container';
import type { Options } from 'commander';
import { Logger } from '@skyra/logger';
import { getGitHubRepo, getGitHubToken } from '#lib/utils';

export function stringify(object: unknown): string {
  return JSON.stringify(object, null, 4);
}

export function setupLogger(options: Options) {
  container.logger = new Logger({ level: options.verbose ? Logger.Level.Debug : Logger.Level.Info });
}

export function logResolvedOptions(options: Options) {
  const clonedRunArgs = JSON.parse(JSON.stringify(options)) as Options;
  clonedRunArgs.githubRepo = getGitHubRepo(options) ?? null!;
  clonedRunArgs.githubToken = getGitHubToken(options) ? 'SECRET([REDACTED])' : null!;

  container.logger.debug('Resolved options:');
  console.log(stringify(clonedRunArgs));
}
