import { filterNullish } from '@sapphire/utilities';
import { cyan, red } from 'colorette';

/**
 * Logs an error and appends extra information if verbose is on
 * @param param See {@link LogVerboseErrorOptions}
 */
export function logVerboseError({
  text,
  verbose = false,
  verboseText = [],
  exitAfterLog = false,
  logWithThrownError = false
}: LogVerboseErrorOptions) {
  if (verbose) {
    text = text.concat(verboseText.filter(filterNullish));
  }

  const message = red(text.join('\n'));

  if (logWithThrownError) {
    throw new Error(message);
  } else {
    console.error('\n', message);
  }

  if (exitAfterLog && !logWithThrownError) {
    process.exit(1);
  }
}

export function logVerboseInfo(text: string[], verbose = false) {
  if (verbose) {
    console.log(cyan(text.join('\n')));
  }
}

/**
 * Options for {@link logVerboseError}
 */
interface LogVerboseErrorOptions {
  /** The text to always log, regardless of whether {@link LogVerboseErrorOptions.verbose} is `true` or `false` */
  text: string[];
  /** Whether to output {@link LogVerboseErrorOptions.verboseText} */
  verbose?: boolean;
  /** The text to log if {@link LogVerboseErrorOptions.verbose} is `true` */
  verboseText?: (string | undefined)[];
  /** Whether to call `process.exit(1)` after logging */
  exitAfterLog?: boolean;
  /** Whether instead of using `console.error` this should use `throw new Error` */
  logWithThrownError?: boolean;
}
