import { asyncConventionalRecommendBump } from '#lib/constants';
import { getFullPackageName } from '#lib/utils';
import type { OptionValues } from 'commander';

export function getConventionalBump(options: OptionValues) {
  return asyncConventionalRecommendBump({
    preset: 'angular',
    path: process.cwd(),
    ...(options.org ? { lernaPackage: getFullPackageName(options) } : {})
  });
}
