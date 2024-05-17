import { cliffTomlPath } from '#lib/constants';
import { Result, err, ok } from '@sapphire/result';
import { isObject } from '@sapphire/utilities';
import { readFile } from 'fs/promises';
import { parse, type TomlPrimitive } from 'smol-toml';

export async function removeHeaderFromChangelogSection(changelogSection: string | undefined): Promise<string | undefined> {
  if (!changelogSection) return undefined;

  const cliffToml = await parseCliffToml();

  return cliffToml.match({
    err: () => changelogSection,
    ok: (tomlContent) => {
      const header = tomlContent.changelog?.header;

      if (header) {
        return changelogSection.replace(header, '');
      }

      return changelogSection;
    }
  });
}

async function parseCliffToml(): Promise<Result<CliffTomlish, Error>> {
  const tomlFile = await readFile(cliffTomlPath, { encoding: 'utf-8' });
  const tomlParsed = parse(tomlFile);

  if (!valueIsObject(tomlParsed)) return err(new Error('Invalid TOML file'));

  return ok(tomlParsed);
}

function valueIsObject(value: TomlPrimitive | CliffTomlish): value is CliffTomlish {
  return isObject(value);
}

type CliffTomlish = Partial<{
  changelog: Partial<{
    header: string;
    body: string;
    trim: boolean;
    footer: string;
  }>;
  git: Partial<{
    conventionalCommits: boolean;
    filterUnconventional: boolean;
    commitParsers: Partial<{
      message: string;
      body: string;
      group: string;
      skip: boolean;
    }>[];
    commitPreprocessors: Partial<{ pattern: string; replace: string }>[];
    filterCommits: boolean;
    tagPattern: string;
    ignoreTags: string;
    topoOrder: boolean;
    sortCommits: string;
  }>;
}>;
