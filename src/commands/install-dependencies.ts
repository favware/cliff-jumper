import { doActionAndLog, resolveInstallCommand, type resolveUsedPackageManager } from '#lib/utils';
import type { Options } from 'commander';
import { execSync } from 'node:child_process';

export function installDependencies(options: Options, packageManagerUsed: ReturnType<typeof resolveUsedPackageManager>) {
  return doActionAndLog(
    `Installing dependencies with ${packageManager(packageManagerUsed)}`, //
    () => {
      if (!options.dryRun) {
        execSync(resolveInstallCommand(packageManagerUsed));
      }
    }
  );
}

function packageManager(packageManagerUsed: ReturnType<typeof resolveUsedPackageManager>) {
  switch (packageManagerUsed) {
    case 'npm':
      return 'npm';
    case 'pnpm':
      return 'pnpm';
    case 'yarn-v1':
    case 'yarn-v2':
    case 'yarn-v3':
    case 'yarn-v4':
      return 'yarn';
  }
}
