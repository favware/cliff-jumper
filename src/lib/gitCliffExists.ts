import { fromAsync, isOk } from '@sapphire/result';
import { execa } from 'execa';

export async function gitCliffExists(): Promise<boolean> {
  const result = await fromAsync(() => execa('git', ['cliff']));

  return isOk(result);
}
