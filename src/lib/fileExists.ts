import { Result } from '@sapphire/result';
import type { PathLike } from 'node:fs';
import { access } from 'node:fs/promises';

export async function fileExists(path: PathLike) {
  const result = await Result.fromAsync<unknown, Error>(() => access(path));

  if (result.isErr()) {
    return false;
  }

  return true;
}
