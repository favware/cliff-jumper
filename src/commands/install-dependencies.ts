import { doActionAndLog, resolveInstallCommand, type resolveUsedPackageManager } from '#lib/utils';
import type { Options } from 'commander';
import { execa } from 'execa';

export function installDependencies(options: Options, packageManagerUsed: ReturnType<typeof resolveUsedPackageManager>) {
  return doActionAndLog(
    `Installing dependencies with ${packageManager(packageManagerUsed)}`, //
    async () => {
      if (!options.dryRun) {
        const installCommand = resolveInstallCommand(packageManagerUsed).split(' ');
        await execa(installCommand[0], installCommand.slice(1));
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
