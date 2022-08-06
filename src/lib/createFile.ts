import { Result } from '@sapphire/result';
import type { PathLike } from 'node:fs';
import { writeFile } from 'node:fs/promises';

export async function createFile(path: PathLike) {
  const result = await Result.fromAsync<unknown, Error>(() => writeFile(path, ''));

  return !result.isErr();
}
