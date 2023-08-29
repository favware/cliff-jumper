import { asyncConventionalRecommendBump } from '#lib/constants';
import { getFullPackageName } from '#lib/utils';
import type { Options } from 'commander';
import compareFunc from 'compare-func';
import type { Context } from 'conventional-changelog-writer';
import type { Commit } from 'conventional-commits-parser';
import { readFile } from 'node:fs/promises';

export async function getConventionalBump(options: Options) {
  const [template, header, commit, footer] = await Promise.all([
    readFile(new URL('../../conventional-templates/template.hbs', import.meta.url), 'utf-8'),
    readFile(new URL('../../conventional-templates/header.hbs', import.meta.url), 'utf-8'),
    readFile(new URL('../../conventional-templates/commit.hbs', import.meta.url), 'utf-8'),
    readFile(new URL('../../conventional-templates/footer.hbs', import.meta.url), 'utf-8')
  ]);

  return asyncConventionalRecommendBump({
    config: {
      parserOpts: {
        headerPattern: /^(\w*)(?:\((.*)\))?: (.*)$/,
        headerCorrespondence: ['type', 'scope', 'subject'],
        noteKeywords: ['BREAKING CHANGE'],
        revertPattern: /^(?:Revert|revert:)\s"?([\s\S]+?)"?\s*This reverts commit (\w*)\./i,
        revertCorrespondence: ['header', 'hash'],
        breakingHeaderPattern: /^(\w*)(?:\((.*)\))?!: (.*)$/
      },
      writerOpts: {
        mainTemplate: template,
        headerPartial: header,
        commitPartial: commit,
        footerPartial: footer,
        transform: (commit: Commit, context: Context) => {
          let discard = true;
          const issues: any[] = [];

          commit.notes.forEach((note) => {
            note.title = 'BREAKING CHANGES';
            discard = false;
          });

          if (commit.type === 'feat') {
            commit.type = 'Features';
          } else if (commit.type === 'fix') {
            commit.type = 'Bug Fixes';
          } else if (commit.type === 'perf') {
            commit.type = 'Performance Improvements';
          } else if (commit.type === 'revert' || commit.revert) {
            commit.type = 'Reverts';
          } else if (discard) {
            return false;
          } else if (commit.type === 'docs') {
            commit.type = 'Documentation';
          } else if (commit.type === 'style') {
            commit.type = 'Styles';
          } else if (commit.type === 'refactor') {
            commit.type = 'Code Refactoring';
          } else if (commit.type === 'test') {
            commit.type = 'Tests';
          } else if (commit.type === 'build') {
            commit.type = 'Build System';
          } else if (commit.type === 'ci') {
            commit.type = 'Continuous Integration';
          }

          if (commit.scope === '*') {
            commit.scope = '';
          }

          if (typeof commit.hash === 'string') {
            commit.shortHash = commit.hash.substring(0, 7);
          }

          if (typeof commit.subject === 'string') {
            let url = context.repository ? `${context.host}/${context.owner}/${context.repository}` : context.repoUrl;
            if (url) {
              url = `${url}/issues/`;
              // Issue URLs.
              commit.subject = commit.subject.replace(/#([0-9]+)/g, (_, issue) => {
                issues.push(issue);
                return `[#${issue}](${url}${issue})`;
              });
            }
            if (context.host) {
              // User URLs.
              commit.subject = commit.subject.replace(/\B@([a-z0-9](?:-?[a-z0-9/]){0,38})/g, (_, username) => {
                if (username.includes('/')) {
                  return `@${username}`;
                }

                return `[@${username}](${context.host}/${username})`;
              });
            }
          }

          // remove references that already appear in the subject
          commit.references = commit.references.filter((reference) => {
            if (!issues.includes(reference.issue)) {
              return true;
            }

            return false;
          });

          return commit;
        },
        groupBy: 'type',
        commitGroupsSort: 'title',
        commitsSort: ['scope', 'subject'],
        noteGroupsSort: 'title',
        notesSort: compareFunc as any
      }
    },
    whatBump: (commits) => {
      let level = 2;
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

      return {
        level,
        reason:
          breakings === 1
            ? `There is ${breakings} BREAKING CHANGE and ${features} features`
            : `There are ${breakings} BREAKING CHANGES and ${features} features`
      };
    },
    path: process.cwd(),
    ...(options.monoRepo ? { lernaPackage: getFullPackageName(options) } : {})
  });
}

declare module 'conventional-changelog-core' {
  export interface ParserOptions {
    breakingHeaderPattern?: RegExp;
  }
}
