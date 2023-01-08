import { asyncConventionalRecommendBump } from '#lib/constants';
import { getFullPackageName } from '#lib/utils';
import type { OptionValues } from 'commander';

export function getConventionalBump(options: OptionValues) {
  return asyncConventionalRecommendBump({
    preset: '@favware/angular',
    path: process.cwd(),
    ...(options.monoRepo ? { lernaPackage: getFullPackageName(options) } : {})
  });
}
