import { doActionAndLog, type resolveUsedPackageManager } from '#lib/utils';
import type { Options } from 'commander';
import { execSync } from 'node:child_process';

export function stageFiles(options: Options, packageManagerUsed: ReturnType<typeof resolveUsedPackageManager>) {
  return doActionAndLog(
    'Staging package.json and CHANGELOG.md', //
    () => {
      if (!options.dryRun) {
        execSync(`git add package.json CHANGELOG.md ${lockfile(options, packageManagerUsed)}`);
      }
    }
  );
}

function lockfile(
  options: Options,
  packageManagerUsed: ReturnType<typeof resolveUsedPackageManager>
): 'package-lock.json' | 'yarn.lock' | 'pnpm-lock.yaml' | '' {
  if (!options.install) return '';

  if (packageManagerUsed === 'pnpm') return 'pnpm-lock.yaml';
  if (packageManagerUsed === 'yarn-v1' || packageManagerUsed === 'yarn-v3') return 'yarn.lock';

  return 'package-lock.json';
}
