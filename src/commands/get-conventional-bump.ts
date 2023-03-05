import { asyncConventionalRecommendBump } from '#lib/constants';
import { getFullPackageName } from '#lib/utils';
import type { Options } from 'commander';

export function getConventionalBump(options: Options) {
  return asyncConventionalRecommendBump({
    preset: '@favware/angular',
    path: process.cwd(),
    ...(options.monoRepo ? { lernaPackage: getFullPackageName(options) } : {})
  });
}
