import { fromAsync, isErr } from '@sapphire/result';
import { execa, type ExecaReturnValue } from 'execa';

export async function gitCliffExists(): Promise<boolean> {
  const result = await fromAsync(() => execa('git', ['cliff']));

  if (isErr(result) && (result.error as ExecaReturnValue).stderr.includes('is not a git command')) {
    return false;
  }

  return true;
}
