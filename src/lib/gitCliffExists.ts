import { from, isErr } from '@sapphire/result';
import { execSync, type SpawnSyncReturns } from 'node:child_process';

export function gitCliffExists(): boolean {
  const result = from<string, SpawnSyncReturns<string>>(() => execSync('git cliff', { encoding: 'utf-8', stdio: ['ignore', 'ignore', 'pipe'] }));

  if (isErr(result) && result.error.stderr.includes('is not a git command')) {
    return false;
  }

  return true;
}
