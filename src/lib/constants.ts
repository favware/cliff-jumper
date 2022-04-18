import conventionalRecommendedBump, {
  type Callback as ConventionalChangelogCallback,
  type Options as ConventionalChangelogOptions
} from 'conventional-recommended-bump';
import { join } from 'node:path';
import { URL } from 'node:url';
import { promisify } from 'node:util';

/** Whether the CLI is being ran in a CI environment */
export const isCi = process.env.CI === 'true';

/** The release-as prefix */
export const releasePrefix = isCi ? 'pre' : '';

/** The root directory of the CLI tool */
export const cliRootDir = new URL('../../', import.meta.url);

/** Current working directory from which the script is called */
export const packageCwd = process.cwd();

/** Path to the config file in proprietary format */
export const cliffJumperRcPath = join(packageCwd, '.cliff-jumperrc');

/** Path to the config file in .json format */
export const cliffJumperRcJsonPath = `${cliffJumperRcPath}.json`;

/** Path to the config file in .yml format */
export const cliffJumperRcYmlPath = `${cliffJumperRcPath}.yml`;

/** Path to the config file in .yaml format */
export const cliffJumperRcYamlPath = `${cliffJumperRcPath}.yaml`;

/** 4 spaces indent for logging */
export const indent = ' '.repeat(4);

export const asyncConventionalRecommendBump: (options: ConventionalChangelogOptions) => Promise<ConventionalChangelogCallback.Recommendation> =
  promisify(conventionalRecommendedBump);
