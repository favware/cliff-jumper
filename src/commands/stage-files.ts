import { packageCwd } from '#lib/constants';
import { fileExists } from '#lib/fileExists';
import { doActionAndLog, getGitRootDirection, type resolveUsedPackageManager } from '#lib/utils';
import { filterNullish, isNullishOrEmpty } from '@sapphire/utilities';
import type { Options } from 'commander';
import { execa } from 'execa';
import { join } from 'node:path';

export async function stageFiles(options: Options, packageManagerUsed: ReturnType<typeof resolveUsedPackageManager>) {
  const lockfilePath = await getLockFilePath(options, packageManagerUsed);

  return doActionAndLog('Staging package.json and CHANGELOG.md', async () => {
    if (!options.dryRun) {
      await execa('git', ['add', 'package.json', 'CHANGELOG.md', lockfilePath || null].filter(filterNullish));
    }
  });
}

async function getLockFilePath(options: Options, packageManagerUsed: ReturnType<typeof resolveUsedPackageManager>) {
  const lockfile = resolveLockfile(options, packageManagerUsed);

  if (!isNullishOrEmpty(lockfile)) {
    const repositoryRootDirectory = await getGitRootDirection();
    const resolvedLockfilePath = join(packageCwd, repositoryRootDirectory, lockfile);

    const lockfileExists = await fileExists(resolvedLockfilePath);

    if (lockfileExists) {
      return resolvedLockfilePath;
    }
  }

  return '';
}

function resolveLockfile(
  options: Options,
  packageManagerUsed: ReturnType<typeof resolveUsedPackageManager>
): 'package-lock.json' | 'yarn.lock' | 'pnpm-lock.yaml' | '' {
  if (!options.install) return '';

  switch (packageManagerUsed) {
    case 'pnpm':
      return 'pnpm-lock.yaml';
    case 'yarn-v1':
    case 'yarn-v2':
    case 'yarn-v3':
    case 'yarn-v4':
      return 'yarn.lock';
    default:
      return 'package-lock.json';
  }
}
