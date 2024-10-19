import { getFullPackageName, getSHA1HashesRegexp } from '#lib/utils';
import type { Options } from 'commander';
import { Bumper, packagePrefix } from 'conventional-recommended-bump';

export async function getConventionalBump(options: Options) {
  const bumper = new Bumper().commits(
    {
      path: process.cwd(),
      ignore: Array.isArray(options.skipCommit) ? getSHA1HashesRegexp(options.skipCommit) : undefined
    },
    {
      headerPattern: /^(\w*)(?:\((.*)\))?: (.*)$/,
      headerCorrespondence: ['type', 'scope', 'subject'],
      noteKeywords: ['BREAKING CHANGE'],
      revertPattern: /^(?:Revert|revert:)\s"?([\s\S]+?)"?\s*This reverts commit (\w*)\./i,
      revertCorrespondence: ['header', 'hash'],
      breakingHeaderPattern: /^(\w*)(?:\((.*)\))?!: (.*)$/
    }
  );

  if (options.monoRepo) {
    bumper.tag({
      prefix: packagePrefix(getFullPackageName(options))
    });
  }

  return bumper.bump((commits) => {
    let level: 0 | 1 | 2 | 3 = 2;
    let breakings = 0;
    let features = 0;

    commits.forEach((commit) => {
      if (commit.notes.length > 0) {
        breakings += commit.notes.length;
        level = 0;
      } else if (commit.type === 'feat') {
        features += 1;
        if (level === 2) {
          level = 1;
        }
      }
    });

    return Promise.resolve({
      level,
      reason:
        breakings === 1
          ? `There is ${breakings} BREAKING CHANGE and ${features} features`
          : `There are ${breakings} BREAKING CHANGES and ${features} features`
    });
  });
}
