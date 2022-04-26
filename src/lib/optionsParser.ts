import { cliffJumperRcJsonPath, cliffJumperRcPath, cliffJumperRcYamlPath, cliffJumperRcYmlPath } from '#lib/constants';
import { fileExists } from '#lib/fileExists';
import { logVerboseError } from '#lib/logger';
import { readJson, readYaml } from '#lib/utils';
import type { OptionValues } from 'commander';

/**
 * Parses a YAML or JSON options file and merges that with CLI provided options
 * @param cliOptions The base CLI options to merge with the options found in a YAML or JSON file, if any
 * @returns The YAML or JSON file provided options with anything passed through the CLI overriding it.
 */
export async function parseOptionsFile(cliOptions: OptionValues) {
  const cliffJumperRcExists = await fileExists(cliffJumperRcPath);
  const cliffJumperRcJsonExists = await fileExists(cliffJumperRcJsonPath);
  const cliffJumperRcYmlExists = await fileExists(cliffJumperRcYmlPath);
  const cliffJumperRcYamlExists = await fileExists(cliffJumperRcYamlPath);

  let options = cliOptions;

  if (cliffJumperRcYamlExists || cliffJumperRcYmlExists) {
    try {
      const fileOptions = await readYaml<OptionValues>(cliffJumperRcYamlExists ? cliffJumperRcYamlPath : cliffJumperRcYmlPath);

      options = {
        ...fileOptions,
        ...options,
        monoRepo: fileOptions.monoRepo ?? options.monoRepo ?? (fileOptions.org || options.org ? true : false)
      };
    } catch (err) {
      const typedError = err as Error;

      logVerboseError({
        text: ['Failed to read yaml config file'],
        verbose: options.verbose,
        verboseText: [
          'Attempted to read options file:',
          cliffJumperRcYamlExists ? cliffJumperRcYamlPath : cliffJumperRcYmlPath,
          '',
          'Full error: ',
          typedError.stack ?? typedError.message
        ],
        exitAfterLog: true
      });
    }
  } else if (cliffJumperRcExists || cliffJumperRcJsonExists) {
    try {
      const fileOptions = await readJson<OptionValues>(cliffJumperRcExists ? cliffJumperRcPath : cliffJumperRcJsonPath);

      options = {
        ...fileOptions,
        ...options,
        monoRepo: fileOptions.monoRepo ?? options.monoRepo ?? (fileOptions.org || options.org ? true : false)
      };
    } catch (err) {
      const typedError = err as Error;

      logVerboseError({
        text: ['Failed to read json config file'],
        verbose: options.verbose,
        verboseText: [
          'Attempted to read options file:',
          cliffJumperRcExists ? cliffJumperRcPath : cliffJumperRcJsonPath,
          '',
          'Full error: ',
          typedError.stack ?? typedError.message
        ],
        exitAfterLog: true
      });
    }
  }

  return options;
}
