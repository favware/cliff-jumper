import { getFullPackageName } from '#lib/utils';
import type { Options } from 'commander';
import { Bumper, packagePrefix } from 'conventional-recommended-bump';

export async function getConventionalBump(options: Options) {
  const bumper = new Bumper().loadPreset('angular').commits(
    {
      path: process.cwd()
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

  return bumper.bump();
}
