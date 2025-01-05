<div align="center">

# cliff-jumper

**A small CLI tool to create a semantic release and [git-cliff] powered
Changelog**

[![GitHub](https://img.shields.io/github/license/favware/cliff-jumper)](https://github.com/favware/cliff-jumper/blob/main/LICENSE)
[![npm](https://img.shields.io/npm/v/@favware/cliff-jumper?color=crimson&logo=npm)](https://www.npmjs.com/package/@favware/cliff-jumper)

[![Support Server](https://discord.com/api/guilds/512303595966824458/embed.png?style=banner2)](https://join.favware.tech)

</div>

## Description

When managing a collection of projects you often want to follow a standard
CHANGELOG template for all of them, but you also do not want to have to setup
the release flow for every package. This is where [cliff-jumper] comes in.

### How this works

[cliff-jumper] uses a combination of [conventional-recommended-bump] and
[git-cliff] to bump your package using semantic versioning (following a
variation of the [Angular preset][angular-preset] (seen
[here][angular-preset-custom])). It will:

1. Perform preflight checks to verify that the tool can run
1. Resolve which bump strategy should be used by using
   [conventional-recommended-bump]
   - If the CLI tool is ran inside a mono repo then only commits that affect the
     nested package will be considered!
1. Bump the version in your `package.json` using `npm version` with the resolved
   strategy
1. Validate that `-t`, `--skip-tag` (CLI flags) weren't provided or `skipTag`
   wasn't set to `true` in the config file
1. Update the `CHANGELOG.md` (or a different file if configured through
   `--changelog-prepend-file`) file using [git-cliff]
1. If `--install` was provided (or `install: true` set in the config file) then
   run the `install` command of the package manager (`npm install`,
   `yarn install`, or `pnpm install`) you used to call this CLI.

   - **Important:** when you install `@favware/cliff-jumper` globally this will
     always default to `npm` because of how NodeJS works. Therefore, if you wish
     for it to be `yarn` or `npm` make sure to add it as dev dependency to your
     project and call it locally.

1. Stage the `package.json` and `CHANGELOG.md` (or a different file if
   configured through `--changelog-prepend-file`) files
1. Commit the release
1. Tag the release

## Installation

You can use the following command to install this package, or replace
`npm install -D` with your package manager of choice.

```sh
npm install -D @favware/cliff-jumper
```

Or install it globally:

```sh
npm install -g @favware/cliff-jumper
```

Then call the script with `cliff-jumper` or `cj`:

```sh
cliff-jumper --name "my-package" --package-path "." # Add any other flags or use --help
cj --name "my-package" --package-path "." # Add any other flags or use --help
```

Alternatively you can call the CLI directly with `npx`:

```sh
npx @favware/cliff-jumper --name "my-package" --package-path "." # Add any other flags or use --help
```

## Usage

You can provide all options through CLI flags:

```sh
Usage: cliff-jumper [options]

Options:
  -V, --version                            output the version number
  -n, --name <string>                      The package name to release
  -p, --package-path <string>              The path to the current package. For non-monorepos this is just "."
  --dry-run                                Whether the package should be bumped or not. When this is set no actions will be taken and only the release strategy will be logged
  --skip-automatic-bump                    Whether to skip bumping the version (useful if this is the first version, or if you have manually set the version)
  --mono-repo                              Whether the package to be bumped resides in a mono repo,
                                           which enables Lerna-like scanning for what kind of version bump should be applied
                                           Defaults to "true" when "org" is set, false otherwise
  --no-mono-repo                           Whether the package to be bumped resides in a mono repo,
                                           which enables Lerna-like scanning for what kind of version bump should be applied
                                           Defaults to "true" when "org" is set, false otherwise
  -o, --org <string>                       The NPM org scope that should be used WITHOUT "@" sign or trailing "/"
  --preid [string]                         The "prerelease identifier" to use as a prefix for the "prerelease" part of a semver
  --identifier-base <number>               The base number (0 or 1) to be used for the prerelease identifier.
  --no-identifier-base                     Do not use a base number for the prerelease identifier.
  -c, --commit-message-template [string]   A custom commit message template to use.
                                           Defaults to "chore({{name}}): release {{full-name}}@{{new-version}}"
                                           You can use "{{new-version}}" in your template which will be dynamically replaced with whatever the new version is that will be
                                           published.
                                           You can use "{{name}}" in your template, this will be replaced with the name provided through "-n", "--name" or the same value set in
                                           your config file.
                                           You can use "{{full-name}}" in your template, this will be replaced "{{name}}" (when "org" is not provided), or "@{{org}}/{{name}}"
                                           (when "org" is provided).
  --tag-template [string]                  A custom tag template to use.
                                           When "org" is provided this will default to "@{{org}}/{{name}}@{{new-version}}", for example "@favware/cliff-jumper@1.0.0"
                                           When "org" is not provided this will default to "v{{new-version}}", for example "v1.0.0"
                                           You can use "{{new-version}}" in your template which will be dynamically replaced with whatever the new version is that will be
                                           published.
                                           You can use "{{org}}" in your template, this will be replaced with the org provided through "-o", "--org" or the same value set in
                                           your config file.
                                           You can use "{{name}}" in your template, this will be replaced with the name provided through "-n", "--name" or the same value set in
                                           your config file.
                                           You can use "{{full-name}}" in your template, this will be replaced "{{name}}" (when "org" is not provided), or "@{{org}}/{{name}}"
                                           (when "org" is provided).
  -i, --install                            Whether to run npm install after bumping the version but before committing and creating a git tag. This is useful when you have a
                                           mono repo where bumping one package would then cause the lockfile to be out of date.
  --skip-changelog                         Whether to skip updating your changelog file
                                           default "true" when CI=true, "false" otherwise
  --no-skip-changelog                      Whether to skip updating your changelog file
                                           default "true" when CI=true, "false" otherwise
  -t, --skip-tag                           Whether to skip creating a git tag
                                           default "true" when CI=true, "false" otherwise
  --no-skip-tag                            Whether to skip creating a git tag
                                           default "true" when CI=true, "false" otherwise
  --changelog-prepend-file [string]        The file that git-cliff should use for the --prepend flag, defaults to ./CHANGELOG.md. This should be relative to the current working
                                           directory.
  --skip-commit [skipCommit...]            Repeatable, each will be treated as a new entry. A list of SHA1 commit hashes that will be skipped in the changelog.
  --git-host-variant [gitHostVariant]      The git host variant. Git-cliff supports 4 hosting websites, GitHub, GitLab, Gitea, and BitBucket. By setting this option you control
                                           which api is used by git-cliff. Defaults to "github" for backwards compatibility.
  --git-repo                               The git repository to use for linking to issues and PRs in the changelog.
                                           You can pass the unique string "auto" to automatically set this value as {{org}}/{{name}} as provided from --org and --name
                                           This should be in the format "owner/repo"
                                           You can use the "GIT_REPO" environment variable to automatically set this value
  --git-token                              A token to authenticate requests to the Git host API. This can be a GitHub, GitLab, Gitea, or BitBucket token. Which is used is
                                           determined by "--git-host-variant". This is required when using the "--git-repo" option.
                                           You can also set the one of the following environment variables.
                                           - GITHUB_TOKEN
                                           - GITLAB_TOKEN
                                           - GITEA_TOKEN
                                           - BITBUCKET_TOKEN
                                           - GH_TOKEN
  --push-tag                               Whether to push the tag to the remote repository.
                                           This will simply execute "git push && git push --tags" so make sure you have configured git for pushing properly beforehand.
  --no-push-tag                            Whether to push the tag to the remote repository.
                                           This will simply execute "git push && git push --tags" so make sure you have configured git for pushing properly beforehand.
  --github-release                         Note that this is only supported if "--git-host-variant" is set to "github"
                                           Whether to create a release on GitHub, requires "--push-tag" to be enabled, otherwise there will be no tag to create a release from
                                           For the repository the release is created on the value from "--git-repo" will be used
                                           If the changelog section from git-cliff is empty, the release notes will be auto-generated by GitHub.
  --no-github-release                      Note that this is only supported if "--git-host-variant" is set to "github"
                                           Whether to create a release on GitHub, requires "--push-tag" to be enabled, otherwise there will be no tag to create a release from
                                           For the repository the release is created on the value from "--git-repo" will be used
                                           If the changelog section from git-cliff is empty, the release notes will be auto-generated by GitHub.
  --github-release-draft                   Note that this is only supported if "--git-host-variant" is set to "github"
                                           Whether the release should be a draft
  --github-release-pre-release             Note that this is only supported if "--git-host-variant" is set to "github"
                                           Whether the release should be a pre-release
  --github-release-latest                  Note that this is only supported if "--git-host-variant" is set to "github"
                                           Whether the release should be marked as the latest release, will try to read this value, then the value of --github-release, and then
                                           default to false. Please note that when setting --github-release-pre-release to `true` GitHub will prevent the release to be marked
                                           as latest an this option will essentially be ignored.
  --github-release-name-template [string]  Note that this is only supported if "--git-host-variant" is set to "github"
                                           A GitHub release name template to use. Defaults to an empty string, which means GitHub will use the tag name as the release name.
                                           You can use "{{new-version}}" in your template which will be dynamically replaced with whatever the new version is that will be
                                           published.
                                           You can use "{{org}}" in your template, this will be replaced with the org provided through "-o", "--org" or the same value set in
                                           your config file.
                                           You can use "{{name}}" in your template, this will be replaced with the name provided through "-n", "--name" or the same value set in
                                           your config file.
                                           You can use "{{full-name}}" in your template, this will be replaced "{{name}}" (when "org" is not provided), or "@{{org}}/{{name}}"
                                           (when "org" is provided).
  -v, --verbose                            Whether to print verbose information (default: false)
  -h, --help                               display help for command
```

Or, you can set most of these options through a configuration file. This file
should be located at your current working directory (where you're calling this
package). It should be named `.cliff-jumperrc`, optionally suffixed with
`.json`, `.yaml`, or `.yml`.

### Config file fields

- `--name` maps to `name`
- `--package-path` maps to `packagePath`
- `--dry-run` maps to `dryRun`
- `--skip-automatic-bump` maps to `skipAutomaticBump`
- `--mono-repo` and `--no-mono-repo` map to `monoRepo`
- `--org` maps to `org`
- `--preid` maps to `preid`
- `--identifier-base` and `--no-identifier-base` map to `identifierBase`
- `--commit-message-template` maps to `commitMessageTemplate`
- `--tag-template` maps to `tagTemplate`
- `--install` map to `install`
- `--skip-changelog` and `--no-skip-changelog` map to `skipChangelog`
- `--skip-tag` and `--no-skip-tag` map to `skipTag`
- `--changelog-prepend-file` maps to `changelogPrependFile`
- `--skip-commit` maps to `skipCommit`
- `--git-host-variant` maps to `gitHostVariant`
- `--git-repo` maps to `gitRepo`
- `--git-token` maps to `gitToken`
- `--push-tag` and `--no-push-tag` map to `pushTag`
- `--github-release` and `--no-github-release` map to `githubRelease`
- `--github-release-draft` maps to `githubReleaseDraft`
- `--github-release-pre-release` maps to `githubReleasePrerelease`
- `--github-release-latest` maps to `githubReleaseLatest`
- `--github-release-name-template` maps to `githubReleaseNameTemplate`
- `--verbose` maps to `verbose`

When using `.cliff-jumperrc` or `.cliff-jumperrc.json` as your config file you
can also use the JSON schema to get schema validation. To do so, add the
following to your config file:

```json
{
  "$schema": "https://raw.githubusercontent.com/favware/cliff-jumper/main/assets/cliff-jumper.schema.json"
}
```

Alternatively you can reference the local schema in node_modules:

```json
{
  "$schema": "./node_modules/@favware/cliff-jumper/assets/cliff-jumper.schema.json"
}
```

**Example JSON file**:

```json
{
  "$schema": "https://raw.githubusercontent.com/favware/cliff-jumper/main/assets/cliff-jumper.schema.json",
  "name": "my-package",
  "packagePath": ".",
  "verbose": true
}
```

**Example YAML file**:

```yaml
name: my-package
packagePath: .
verbose: true
```

### Default values

This library has opinionated defaults for its options. These are as follows:

- `--dry-run` will default to `undefined`.
- `--skipAutomaticBump` will default to `undefined`.
- `--org` will default to `undefined`.
- `--preid` will default to `undefined`.
- `--identifier-base` will default to `undefined`. Alternatively, you can force
  this to `false` by providing `--no-identifier-base`.
- `--install` will default to `undefined`.
- `--skip-changelog` will default to `false` (`true` when `CI` environment
  variable is `'true'`). Alternatively you can force this to false by providing
  `--no-skip-changelog`.
- `--skip-tag` will default to `false` (`true` when `CI` environment variable is
  `'true'`). Alternatively you can force this to false by providing
  `--no-skip-tag`.
- `--mono-repo` will default to `true` when `org` is set, or `false` when it's
  not. Alternatively you can force this to false by providing `--no-mono-repo`.
- `--commit-message-template` will default to
  `chore({{name}}): release {{full-name}}@{{new-version}}`
  - `{{new-version}}` will be replaced with the new version that will be
    published
  - `{{name}}` will be replaced with the name provided through `-n`, `--name` or
    the same value set in your config file
  - `{{full-name}}` will be replaced with `{{name}}` (when `org` is not
    provided), or `@{{org}}/{{name}}` (when `org` is provided).
- `--tag-template` will default to `{{full-name}}@{{new-version}}` (when `org`
  is provided) **or** `v{{new-version}}` (when `org` is not provided)
  - `{{new-version}}` will be replaced with the new version that will be
    published
  - `{{name}}` will be replaced with the name provided through `-n`, `--name` or
    the same value set in your config file
  - `{{org}}` will be replaced with the org provided through `-o`, `--org` or
    the same value set in your config file
  - `{{full-name}}` will be replaced with `{{name}}` (when `org` is not
    provided), or `@{{org}}/{{name}}` (when `org` is provided).
- `--changelog-prepend-file` will default to `./CHANGELOG.md`.
- `--skip-commit` will default to `[]` (an empty array).
- `--git-host-variant` will default to `'github'`.
- `--git-repo` will default to `undefined`.
- `--git-token` will default to `undefined`.
- `--push-tag` will default to `false`. Alternatively you can force this to
  false by providing `--no-push-tag`.
- `--github-release` will default to `false`. Alternatively you can force this
  to false by providing `--no-github-release`.
- `--github-release-draft` will default to `false`.
- `--github-release-pre-release` will default to `false`.
- `--github-release-latest` will default to `true`.
- `--github-release-name-template` will default to an empty string.
- `--verbose` will default to `false`.

### Merging of config file, defaults and CLI provided flags

When you have a config file the options in the file are merged with the default
options and with any other provided CLI flags. Which source takes highest
priority depends on the type of the option. The priority is as follows (lower
means it gets lower priority):

1. CLI flags
2. Default values
3. Config file

This means that the CLI flags will always have the highest priority. This way
you can have a config file for base options, then overwrite that with CLI flags,
such as in a CI environment.

### Creating a GitHub release

This package provides the options `--push-tag` and `--github-release` to
automatically create a release on GitHub using the output from `git-cliff` as
the release notes. In order to use this feature you have to provide
`--git-host-variant=github`, `--git-repo`, and `--git-token` (or set the latter
respective environment variables). Alternatively, if you want to run this step
from a GitHub workflow you can base your step on the following example.

It is very important that if your main branch is protected by branch protection
you have to provide a Personal Access Token (this can be both a classic or a
fine-grained one) for a user who can bypass branch protections as
`token: ${{ secrets.YOUR_TOKEN_VAR }}` to `actions/checkout`!

```yaml
- name: Checkout Project
  uses: actions/checkout@v4
  with:
    fetch-depth: 0
    ref: main
- name: Use Node.js v20
  uses: actions/setup-node@v4
  with:
    node-version: 20
    cache: yarn
- name: Configure Git
  run: |
    git remote set-url origin "https://${GITHUB_TOKEN}:x-oauth-basic@github.com/${GITHUB_REPOSITORY}.git"
    git config --local user.email "${GITHUB_EMAIL}"
    git config --local user.name "${GITHUB_USER}"
  env:
    GITHUB_USER: github-actions[bot]
    GITHUB_EMAIL: 41898282+github-actions[bot]@users.noreply.github.com
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
- name: Bump Versions & Publish
  run: npx @favware/cliff-jumper
  env:
    GITHUB_TOKEN: ${{ secrets.BOT_TOKEN }}
```

This will create a GitHub commit, release, and tag using the GitHub Actions bot
account. This ensures that you do not need a
[Personal Access Token](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token)
to create a release. The `GITHUB_TOKEN` secret is provided by GitHub Actions and
is a token that has the necessary permissions to create a release. It also be
noted that classic Personal Access Tokens will not even work for this, you will
_at least_ need a
[Fine-Grained Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token)
which is at time of writing (2024-06-03) a beta feature. You can find more
information about there
[here](https://docs.github.com/en/rest/releases/releases?apiVersion=2022-11-28#create-a-release).

Lastly, the example above assumes a cliff-jumper config file similar to the one
in this repository ([.cliff-jumperrc](./.cliff-jumperrc)). As an alternative
example for a package that is not scoped by an npm/github org here is another
example. Replace the values in between `<>` with your desired values.

```yaml
name: <package-name>
packagePath: .
pushTag: true
gitRepo: <repo-owner>/<repo-name>
githubRelease: true
githubReleaseLatest: true
```

### Example Configuration setups

Following are JSON examples of how you can configure this package based on
different situations.

#### Scoped packages in a non-mono repo

**This is for versioning `@my-org/my-package` that does not reside in a mono
repo, for example [sapphiredev/shapeshift][shapeshift]**

```json
{
  "name": "package-name",
  "packagePath": ".",
  "org": "my-org",
  "monoRepo": false,
  "commitMessageTemplate": "chore(release): release {{new-version}}",
  "tagTemplate": "v{{new-version}}"
}
```

#### Scoped packages in a mono repo

**This is for versioning `@my-org/my-package` that resides in a mono repo, for
example [sapphiredev/utilities][utilities]**

```json
{
  "name": "package-name",
  "org": "my-org",
  "packagePath": "packages/decorators"
}
```

#### Non-scoped packages in a non-mono repo

**This is for versioning `my-package` that does not reside in a mono repo, for
example
[favware/esbuild-plugin-version-injector][esbuild-plugin-version-injector]**

```json
{
  "name": "my-package",
  "packagePath": ".",
  "commitMessageTemplate": "chore(release): release {{new-version}}",
  "tagTemplate": "v{{new-version}}"
}
```

#### Non-scoped packages in a mono repo

**This is for versioning `my-package` that resides in a mono repo, for example
[discord.js/discordjs][discordjs]**

```json
{
  "name": "my-package",
  "packagePath": "packages/discord.js",
  "tagTemplate": "{{new-version}}"
}
```

### Git Cliff commands executed

The following commands are executed by [git-cliff] after options are parsed,
depending on the scenario:

#### In a regular repository

```bash
git cliff --tag "TAG_TEMPLATE_OPTION" --prepend ./CHANGELOG.md --unreleased --config ./cliff.toml
```

For example this could be:

```bash
git cliff --tag "@favware/cliff-jumper@1.0.0" --prepend ./CHANGELOG.md --unreleased --config ./cliff.toml
```

#### In a mono repository

```bash
git cliff --tag "TAG_TEMPLATE_OPTION" --prepend ./CHANGELOG.md --unreleased --config ./cliff.toml --repository RELATIVE_PATH_TO_REPOSITORY_ROOT --include-path "PACKAGE_PATH_OPTIONS/*"
```

For example this could be:

```bash
git cliff --tag "@sapphire/utilities@1.0.0" --prepend ./CHANGELOG.md --unreleased --config ./cliff.toml --repository ../../ --include-path "packages/utilities/*"
```

## Buy us some doughnuts

Favware projects are and always will be open source, even if we don't get
donations. That being said, we know there are amazing people who may still want
to donate just to show their appreciation. Thank you very much in advance!

We accept donations through Ko-fi, Paypal, Patreon, GitHub Sponsorships, and
various cryptocurrencies. You can use the buttons below to donate through your
method of choice.

|   Donate With   |                      Address                      |
| :-------------: | :-----------------------------------------------: |
|      Ko-fi      |  [Click Here](https://donate.favware.tech/kofi)   |
|     Patreon     | [Click Here](https://donate.favware.tech/patreon) |
|     PayPal      | [Click Here](https://donate.favware.tech/paypal)  |
| GitHub Sponsors |  [Click Here](https://github.com/sponsors/Favna)  |
|     Bitcoin     |       `1E643TNif2MTh75rugepmXuq35Tck4TnE5`        |
|    Ethereum     |   `0xF653F666903cd8739030D2721bF01095896F5D6E`    |
|    LiteCoin     |       `LZHvBkaJqKJRa8N7Dyu41Jd1PDBAofCik6`        |

## Contributors

Please make sure to read the [Contributing Guide][contributing] before making a
pull request.

Thank you to all the people who already contributed to Sapphire!

<a href="https://github.com/favware/cliff-jumper/graphs/contributors">
  <img alt="contributors" src="https://contrib.rocks/image?repo=favware/cliff-jumper" />
</a>

[contributing]: ./.github/CONTRIBUTING.md
[git-cliff]: https://github.com/orhun/git-cliff
[cliff-jumper]: https://github.com/favware/cliff-jumper
[angular-preset]:
  https://github.com/angular/angular/blob/master/CONTRIBUTING.md#type
[conventional-recommended-bump]:
  https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-recommended-bump
[shapeshift]: https://github.com/sapphiredev/shapeshift
[utilities]:
  https://github.com/sapphiredev/utilities/tree/main/packages/utilities
[esbuild-plugin-version-injector]:
  https://github.com/favware/esbuild-plugin-version-injector
[discordjs]:
  https://github.com/discordjs/discord.js/tree/main/packages/discord.js
[angular-preset-custom]: ./src/commands/get-conventional-bump.ts
