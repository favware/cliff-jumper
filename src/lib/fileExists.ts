import { fromAsync, isErr } from '@sapphire/result';
import type { PathLike } from 'node:fs';
import { access } from 'node:fs/promises';

export async function fileExists(path: PathLike) {
  const result = await fromAsync(() => access(path));

  if (isErr(result)) return false;

  return true;
}
