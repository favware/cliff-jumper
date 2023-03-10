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
1. Update the `CHANGELOG.md` file using [git-cliff]
1. Stage the `package.json` and `CHANGELOG.md` files
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
  -V, --version                           output the version number
  -n, --name <string>                     The package name to release
  -p, --package-path <string>             The path to the current package. For non-monorepos this is just "."
  --dry-run                               Whether the package should be bumped or not. When this is set no actions will be taken and only the release strategy will be logged
  --first-release                         Whether this is the first release (skips bumping the version)
  --mono-repo                             Whether the package to be bumped resides in a mono repo,
                                          which enables Lerna-like scanning for what kind of version bump should be applied
                                          Defaults to "true" when "org" is set, false otherwise
  --no-mono-repo                          Whether the package to be bumped resides in a mono repo,
                                          which enables Lerna-like scanning for what kind of version bump should be applied
                                          Defaults to "true" when "org" is set, false otherwise
  -o, --org <string>                      The NPM org scope that should be used WITHOUT "@" sign or trailing "/"
  --preid [string]                        The "prerelease identifier" to use as a prefix for the "prerelease" part of a semver
  -c, --commit-message-template [string]  A custom commit message template to use.
                                          Defaults to "chore({{name}}): release {{full-name}}@{{new-version}}"
                                          You can use "{{new-version}}" in your template which will be dynamically replaced with whatever the new version is that will be
                                          published.
                                          You can use "{{name}}" in your template, this will be replaced with the name provided through "-n", "--name" or the same value set
                                          in your config file.
                                          You can use "{{full-name}}" in your template, this will be replaced "{{name}}" (when "org" is not provided), or "@{{org}}/{{name}}"
                                          (when "org" is provided).
  --tag-template [string]                 A custom tag template to use.
                                          When "org" is provided this will default to "@{{org}}/{{name}}@{{new-version}}", for example "@favware/cliff-jumper@1.0.0"
                                          When "org" is not provided this will default to "v{{new-version}}", for example "v1.0.0"
                                          You can use "{{new-version}}" in your template which will be dynamically replaced with whatever the new version is that will be
                                          published.
                                          You can use "{{org}}" in your template, this will be replaced with the org provided through "-o", "--org" or the same value set in
                                          your config file.
                                          You can use "{{name}}" in your template, this will be replaced with the name provided through "-n", "--name" or the same value set
                                          in your config file.
                                          You can use "{{full-name}}" in your template, this will be replaced "{{name}}" (when "org" is not provided), or "@{{org}}/{{name}}"
                                          (when "org" is provided).
  --skip-changelog                        Whether to skip updating your CHANGELOG.md
                                          default "true" when CI=true, "false" otherwise (default: false)
  --no-skip-changelog                     Whether to skip updating your CHANGELOG.md
                                          default "true" when CI=true, "false" otherwise
  -t, --skip-tag                          Whether to skip creating a git tag
                                          default "true" when CI=true, "false" otherwise (default: false)
  --no-skip-tag                           Whether to skip creating a git tag
                                          default "true" when CI=true, "false" otherwise
  -v, --verbose                           Whether to print verbose information (default: false)
  -h, --help                              display help for command
```

Or, you can set most of these options through a configuration file. This file
should be located at your current working directory (where you're calling this
package). It should be named `.cliff-jumperrc`, optionally suffixed with
`.json`, `.yaml`, or `.yml`.

### Config file fields

- `--name` maps to `name`
- `--package-path` maps to `packagePath`
- `--dry-run` maps to `dryRun`
- `--first-release` maps to `firstRelease`
- `--mono-repo` and `--no-mono-repo` map to `monoRepo`
- `--org` maps to `org`
- `--preid` maps to `preid`
- `--commit-message-template` maps to `commitMessageTemplate`
- `--tag-template` maps to `tagTemplate`
- `--skip-changelog` and `--no-skip-changelog` map to `skipChangelog`
- `--skip-tag` and `--no-skip-tag` map to `skipTag`
- `--verbose` maps to `verbose`

When using `.cliff-jumperrc` or `.cliff-jumperrc.json` as your config file you
can also use the JSON schema to get schema validation. To do so, add the
following to your config file:

```json
{
  "$schema": "https://raw.githubusercontent.com/favware/cliff-jumper/main/assets/cliff-jumper.schema.json"
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
- `--first-release` will default to `undefined`.
- `--org` will default to `undefined`.
- `--preid` will default to `undefined`.
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
[angular-preset-custom]: ./conventional-changelog-angular-custom/
