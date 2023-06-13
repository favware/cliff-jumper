import { packageCwd } from '#lib/constants';
import { fileExists } from '#lib/fileExists';
import { doActionAndLog, getGitRootDirection, type resolveUsedPackageManager } from '#lib/utils';
import { isNullishOrEmpty } from '@sapphire/utilities';
import type { Options } from 'commander';
import { execSync } from 'node:child_process';
import { join } from 'node:path';

export async function stageFiles(options: Options, packageManagerUsed: ReturnType<typeof resolveUsedPackageManager>) {
  const lockfilePath = await getLockFilePath(options, packageManagerUsed);

  return doActionAndLog(
    'Staging package.json and CHANGELOG.md', //
    () => {
      if (!options.dryRun) {
        execSync(`git add package.json CHANGELOG.md ${lockfilePath}`);
      }
    }
  );
}

async function getLockFilePath(options: Options, packageManagerUsed: ReturnType<typeof resolveUsedPackageManager>) {
  const lockfile = resolveLockfile(options, packageManagerUsed);

  if (!isNullishOrEmpty(lockfile)) {
    const repositoryRootDirectory = getGitRootDirection();
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

  if (packageManagerUsed === 'pnpm') return 'pnpm-lock.yaml';
  if (packageManagerUsed === 'yarn-v1' || packageManagerUsed === 'yarn-v3') return 'yarn.lock';

  return 'package-lock.json';
}
