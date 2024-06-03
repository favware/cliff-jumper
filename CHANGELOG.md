# Changelog

All notable changes to this project will be documented in this file.

# [@favware/cliff-jumper@4.0.0](https://github.com/favware/cliff-jumper/compare/@favware/cliff-jumper@3.0.3...@favware/cliff-jumper@4.0.0) - (2024-06-03)

## 🏠 Refactor

- Rename `first-release` to `skip-automatic-bump` ([fe244a0](https://github.com/favware/cliff-jumper/commit/fe244a074addc7cd183d2bcdda420f266e684ffc))
  - 💥 **fixes #** 177
  - 💥 **BREAKING CHANGE:** `first-release` has been renamed to `skip-automatic-bump`
in order to better describe what it does
- Remove automatic `CI` env detection ([775f02e](https://github.com/favware/cliff-jumper/commit/775f02e86da45a694e2db6e272de4dd6e8aac531))
  - 💥 **BREAKING CHANGE:** Previously when running with `CI` env `--skip-changelog` and `--skip-tag` were
automatically enabled. This is no longer the case, because the new GitHub releasing feature
makes it more appealing to run this tool in CI. To restore the old functionality for your
pipelines please explicitly add these tags to your command line.
- **deps:** Update dependency conventional-recommended-bump to v10 ([da1d45d](https://github.com/favware/cliff-jumper/commit/da1d45d5929be5ae8597da27736431b3e5c9c93d))
  - 💥 **BREAKING CHANGE:** Node 18 is now required as per the new version of `conventional-recommended-bump`
  - 💥 **BREAKING CHANGE:** The base `conventional-changelog-angular` is now used instead of a customization of it. This should not affect the semver resolution, but if it does please create a GitHub issue

## 🐛 Bug Fixes

- Respect the tag-template for github releases ([85f4272](https://github.com/favware/cliff-jumper/commit/85f42725648210265a6d5fe3910802c7c1e9839f))
- **deps:** Update all non-major dependencies ([93640e2](https://github.com/favware/cliff-jumper/commit/93640e207b3f78eb32e0216e4151d45e139a49be))
- **deps:** Update dependency execa to v9 ([07e39ae](https://github.com/favware/cliff-jumper/commit/07e39ae3a94ae50326ba3d250f4c16a23d665c84)) ([#175](https://github.com/favware/cliff-jumper/pull/175))

## 📝 Documentation

- **readme:** Document github releases ([32208f2](https://github.com/favware/cliff-jumper/commit/32208f2f7602031ae6904d6ce5b73ad27e64f152))
- Update readme with missing flags ([ffaf31a](https://github.com/favware/cliff-jumper/commit/ffaf31a6d79ee2ec9e2fda58a143229c6849172b))
- **readme:** Document which git-cliff commands get executed ([7527ae9](https://github.com/favware/cliff-jumper/commit/7527ae92e8604ef0f93f7bab394a3e5848a08a6e))

## 🚀 Features

- Add `--no-push-tag` to override config file for prereleases ([6f5d748](https://github.com/favware/cliff-jumper/commit/6f5d748041fae5ec9465d49fc9c66ee351bacde7))
- Add `--no-github-release` to override config file for prereleases ([656c8ec](https://github.com/favware/cliff-jumper/commit/656c8ec9ab20e6f6ebc90ed67a98f856b420fcdf))
- Add option `--changelog-prepend-file` to customize to which file the changelog is prepended ([35e9731](https://github.com/favware/cliff-jumper/commit/35e97314a272e7b0e02f70e4e43060176d20b1f2))
- Add `--push-tag` and `--github-release` to automatically push a Git tag and create a release on GitHub ([b66bfa1](https://github.com/favware/cliff-jumper/commit/b66bfa1bdefc2ef7988ba1119c083bce0dbd7a19))

# [@favware/cliff-jumper@3.0.3](https://github.com/favware/cliff-jumper/compare/@favware/cliff-jumper@3.0.2...@favware/cliff-jumper@3.0.3) - (2024-04-23)

## 🏠 Refactor

- Code cleanup ([207a5d6](https://github.com/favware/cliff-jumper/commit/207a5d669bffa22311aa7d3fbef10889254e0040))

## 🐛 Bug Fixes

- **commit-release:** Remove quotes from commit message template ([9fcab96](https://github.com/favware/cliff-jumper/commit/9fcab96137ee677cf18b60cf66f427e01e556c68)) ([#169](https://github.com/favware/cliff-jumper/pull/169))
- Add `GH_TOKEN`, `TOKEN_GITHUB` and `TOKEN_GH` to the list possible env vars for github token ([0ab906a](https://github.com/favware/cliff-jumper/commit/0ab906ae5cb25edf782e9744a5416e0af34d9745))

# [@favware/cliff-jumper@3.0.2](https://github.com/favware/cliff-jumper/compare/@favware/cliff-jumper@3.0.1...@favware/cliff-jumper@3.0.2) - (2024-04-11)

## 🐛 Bug Fixes

- **deps:** Update dependency git-cliff to ^2.2.1 ([1acd9b2](https://github.com/favware/cliff-jumper/commit/1acd9b274c0510e2cae0ac1c9c7bf46c3f2f8817)) ([#166](https://github.com/favware/cliff-jumper/pull/166))

# [@favware/cliff-jumper@3.0.1](https://github.com/favware/cliff-jumper/compare/@favware/cliff-jumper@3.0.0...@favware/cliff-jumper@3.0.1) - (2024-03-03)

## 🏠 Refactor

- Switch to `execa` for a full async code ([74c09c7](https://github.com/favware/cliff-jumper/commit/74c09c7e1627f5a38af5de0579f8b90fe4d4f5cc))
- Add spinner for cli command progress ([6945d21](https://github.com/favware/cliff-jumper/commit/6945d21eb273beff55342c8092e5ceacdc4353db))
- Git cliff programmatic api ([d542c51](https://github.com/favware/cliff-jumper/commit/d542c51aaffef696b75f5716a8fd719e0c5b2ce3))

## 🐛 Bug Fixes

- Bump git-cliff for windows github integration support, remove warning for the same ([a68359d](https://github.com/favware/cliff-jumper/commit/a68359d48d42ba6463685d943432514b1ff632d2)) ([#158](https://github.com/favware/cliff-jumper/pull/158))

# [@favware/cliff-jumper@3.0.0](https://github.com/favware/cliff-jumper/compare/@favware/cliff-jumper@2.2.3...@favware/cliff-jumper@3.0.0) - (2024-03-01)

## 🐛 Bug Fixes

- **deps:** Update dependency git-cliff to v2 ([508b7ad](https://github.com/favware/cliff-jumper/commit/508b7adbf04d79e18a51abcd07b6b69c59d142a7)) ([#157](https://github.com/favware/cliff-jumper/pull/157))
  - 💥 **BREAKING CHANGE:** Bumped git-cliff to v2, please see https://github.com/orhun/git-cliff/blob/main/CHANGELOG.md#200---2024-02-19 for their breaking changes
  - 💥 **Co-authored-by:** renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>
- **deps:** Update dependency commander to v12 ([dd7684e](https://github.com/favware/cliff-jumper/commit/dd7684e27216d270e859f0e683efae2347602f52)) ([#151](https://github.com/favware/cliff-jumper/pull/151))
- **deps:** Update all non-major dependencies ([411713e](https://github.com/favware/cliff-jumper/commit/411713e4267c1e373e16de7a13d14e329869266e)) ([#148](https://github.com/favware/cliff-jumper/pull/148))
- **deps:** Update all non-major dependencies ([e3ab8b9](https://github.com/favware/cliff-jumper/commit/e3ab8b912480091db3c5056738b28bd23408556f)) ([#144](https://github.com/favware/cliff-jumper/pull/144))
- Make schema use https ([e7104f2](https://github.com/favware/cliff-jumper/commit/e7104f28ca53dc82ddd186687c14d8d86f677d71))

## 🚀 Features

- Implement a press enter to continue system for GH integration for windows ([22737c6](https://github.com/favware/cliff-jumper/commit/22737c66c6e988a882f15989165a64e559e2728f))
- Add support for `--github-repo` and `--github-token` ([7ec4f9d](https://github.com/favware/cliff-jumper/commit/7ec4f9dde6135008bd8194cf33ef2df0e44b1055))

# [@favware/cliff-jumper@2.2.3](https://github.com/favware/cliff-jumper/compare/@favware/cliff-jumper@2.2.3...@favware/cliff-jumper@2.2.3) - (2023-11-14)

## 🐛 Bug Fixes

- Actually support yarn v4 oops ([8e25acd](https://github.com/favware/cliff-jumper/commit/8e25acd18a5e3bcf34f9e658b0af42ef08ecb0b0))

# [@favware/cliff-jumper@2.2.2](https://github.com/favware/cliff-jumper/compare/@favware/cliff-jumper@2.2.2...@favware/cliff-jumper@2.2.2) - (2023-11-14)

## 🐛 Bug Fixes

- Add support for yarn v4 ([35af4dc](https://github.com/favware/cliff-jumper/commit/35af4dcb9ef1e45cda742f7aac5ac58a5bf485b1))

# [@favware/cliff-jumper@2.2.1](https://github.com/favware/cliff-jumper/compare/@favware/cliff-jumper@2.2.1...@favware/cliff-jumper@2.2.1) - (2023-11-05)

## 🐛 Bug Fixes

- Update to git cliff v1.4.0 ([46f1357](https://github.com/favware/cliff-jumper/commit/46f1357268e71bb2f18035b69e34c44f24c3ebea))

# [@favware/cliff-jumper@2.2.0](https://github.com/favware/cliff-jumper/compare/@favware/cliff-jumper@2.2.0...@favware/cliff-jumper@2.2.0) - (2023-09-22)

## 🚀 Features

- Add support for `identifierBase` (#117) ([37c919e](https://github.com/favware/cliff-jumper/commit/37c919e4da511c28e9926745194016202c78c84a))

# [@favware/cliff-jumper@2.1.3](https://github.com/favware/cliff-jumper/compare/@favware/cliff-jumper@2.1.3...@favware/cliff-jumper@2.1.3) - (2023-09-10)

## 🏠 Refactor

- Bump `conventional-recommended-bump` and remove manual promisify ([fe1dc29](https://github.com/favware/cliff-jumper/commit/fe1dc29d97358d3a95b020e4d157f69b395be424))

# [@favware/cliff-jumper@2.1.2](https://github.com/favware/cliff-jumper/compare/@favware/cliff-jumper@2.1.1...@favware/cliff-jumper@2.1.2) - (2023-08-29)

## 🏠 Refactor

- Update dependencies ([9dbeb18](https://github.com/favware/cliff-jumper/commit/9dbeb18623be7e198f4241da8a17761def19361f))

## 🐛 Bug Fixes

- **deps:** Update dependency commander to v11 (#94) ([a80e63e](https://github.com/favware/cliff-jumper/commit/a80e63e826312f5f067dd98ce5f964fe5855aaf5))

# [@favware/cliff-jumper@2.1.1](https://github.com/favware/cliff-jumper/compare/@favware/cliff-jumper@2.1.0...@favware/cliff-jumper@2.1.1) - (2023-06-13)

## 🐛 Bug Fixes

- Fixed finding of package lock file ([8c9905b](https://github.com/favware/cliff-jumper/commit/8c9905bcacaaf5910fc5244ccbcfb2d4b0b62087))

# [@favware/cliff-jumper@2.1.0](https://github.com/favware/cliff-jumper/compare/@favware/cliff-jumper@2.0.1...@favware/cliff-jumper@2.1.0) - (2023-06-09)

## 🐛 Bug Fixes

- Include JSON schema in published tarball ([e106743](https://github.com/favware/cliff-jumper/commit/e10674363bba5e646828e667384b3126897760c3))
- Update conventional-recommended-bump to v7 ([27691f9](https://github.com/favware/cliff-jumper/commit/27691f94ab417d8d732274656dd1e8e6f0c9a3ee))
- Update non major dependencies ([fc68720](https://github.com/favware/cliff-jumper/commit/fc6872096fa511e3a3bbe519ab778e93e2725962))
- Do not check for git cliff in preflish as the lib provides it ([2a2a8b4](https://github.com/favware/cliff-jumper/commit/2a2a8b4d795948affa5d8bd5111ed0ba0eda9c35))

## 📝 Documentation

- Update readme ([40c099b](https://github.com/favware/cliff-jumper/commit/40c099b53ad88fa8102bb64ab87eaf57ddd6e65a))

## 🚀 Features

- Add `--install` option which runs package manager install before staging files ([63b13d4](https://github.com/favware/cliff-jumper/commit/63b13d4e66f28e8fbd3fa493d5acbdac660d0e2b))

# [@favware/cliff-jumper@2.0.1](https://github.com/favware/cliff-jumper/compare/@favware/cliff-jumper@2.0.0...@favware/cliff-jumper@2.0.1) - (2023-05-27)

## 🐛 Bug Fixes

- Move typescript to dev dependencies ([3396e8c](https://github.com/favware/cliff-jumper/commit/3396e8ca56465e464494441feb27555e9661f516))
- **deps:** Update all non-major dependencies ([f8b8476](https://github.com/favware/cliff-jumper/commit/f8b847630a5877561460e452ce0dbd4ffb2967e7))
- Update dependencies ([83134e7](https://github.com/favware/cliff-jumper/commit/83134e741bb803a6026aa2a0689a356da81f01e6))
- **deps:** Update all non-major dependencies ([1981fa6](https://github.com/favware/cliff-jumper/commit/1981fa6dc2ea4bbd88a3f3758b43799fa126a63f))

# [@favware/cliff-jumper@2.0.0](https://github.com/favware/cliff-jumper/compare/@favware/cliff-jumper@1.10.0...@favware/cliff-jumper@2.0.0) - (2023-03-05)

## 🐛 Bug Fixes

- Fixed npx executable for `git-cliff` ([cde7e4c](https://github.com/favware/cliff-jumper/commit/cde7e4c053bd1f1fa6931b6c8ef2030711f6f0c4))
- **changelog-angular:** Updated source files to latest from mirror ([a831453](https://github.com/favware/cliff-jumper/commit/a831453c24d3632c6c1c11ee01fd5b6069ed250b))
- **deps:** Update dependency commander to v10 (#65) ([f725495](https://github.com/favware/cliff-jumper/commit/f72549586434f15180843b382a0268d1b7586754))
  - 💥 **BREAKING CHANGE:** `@favware/cliff-jumper` v2 requires Node.js v14 or higher due to the dependency of Commander@10.x

## 🚀 Features

- **deps:** Use `git-cliff` from npm instead of relying on native install (#68) ([0494e92](https://github.com/favware/cliff-jumper/commit/0494e9224911fa613e961bcdaffab424e774df0b))
  - 💥 **BREAKING CHANGE:** `@favware/cliff-jumper` v2 uses `v1.1.2` of git-cliff, refer to the changelog of git cliff for their breaking changes at v1.x

# [@favware/cliff-jumper@1.10.0](https://github.com/favware/cliff-jumper/compare/@favware/cliff-jumper@1.9.0...@favware/cliff-jumper@1.10.0) - (2023-01-08)

## 🚀 Features

- Change to @favware/conventional-changelog-angular to solve issue with breaking change headers ([96c885b](https://github.com/favware/cliff-jumper/commit/96c885ba972e86467cbd870ac787bdfaa195071a))

# [@favware/cliff-jumper@1.9.0](https://github.com/favware/cliff-jumper/compare/@favware/cliff-jumper@1.8.8...@favware/cliff-jumper@1.9.0) - (2022-11-19)

## 🐛 Bug Fixes

- **deps:** Update dependency @sapphire/result to ^2.6.0 ([9ed7289](https://github.com/favware/cliff-jumper/commit/9ed728932c05e1322ccb0fc92b5cb3772cbb7aa9))
- **deps:** Update dependency @sapphire/utilities to v3.11.0 ([0919bf6](https://github.com/favware/cliff-jumper/commit/0919bf6b62d9260b014caa6c6560dca367cd10b8))
- Bump @sapphire/utilities ([50ec6ac](https://github.com/favware/cliff-jumper/commit/50ec6ac475560f6b20e91255f9e128b721845f0f))

## 📝 Documentation

- Add imranbarbhuiya as a contributor for code (#54) ([00e8c2f](https://github.com/favware/cliff-jumper/commit/00e8c2f58e7ef6dadd1858f406d00282a7f6444f))
- **readme:** Add configuration examples ([5e891b0](https://github.com/favware/cliff-jumper/commit/5e891b0ecde8f520e0b230c195b727f6b6a6ae40))

## 🚀 Features

- Create an empty changelog file when it does not yet exist and first release was provided (#31) ([90acb2a](https://github.com/favware/cliff-jumper/commit/90acb2a8d7827a5a93d57392c6f9854a6de09a88))

# [@favware/cliff-jumper@1.8.8](https://github.com/favware/cliff-jumper/compare/@favware/cliff-jumper@1.8.7...@favware/cliff-jumper@1.8.8) - (2022-10-02)

## 🐛 Bug Fixes

- **deps:** Update dependency @sapphire/result to ^2.5.0 ([02bcb09](https://github.com/favware/cliff-jumper/commit/02bcb09e45cce1e12b798f57d5dc51f83b408bd4))
- **deps:** Update sapphire dependencies ([e230602](https://github.com/favware/cliff-jumper/commit/e230602586403b3dc2129e41dfe7329442319291))

# [@favware/cliff-jumper@1.8.7](https://github.com/favware/cliff-jumper/compare/@favware/cliff-jumper@1.8.6...@favware/cliff-jumper@1.8.7) - (2022-08-20)

## 🐛 Bug Fixes

- Bump dependencies ([5b2e69a](https://github.com/favware/cliff-jumper/commit/5b2e69aab48860d4c6492635cfb179ad45bc2cd9))
- **deps:** Update sapphire dependencies ([431ed48](https://github.com/favware/cliff-jumper/commit/431ed4890fec20c6b8687ce48ff89c8d09b5bdb5))

# [@favware/cliff-jumper@1.8.6](https://github.com/favware/cliff-jumper/compare/@favware/cliff-jumper@1.8.5...@favware/cliff-jumper@1.8.6) - (2022-07-30)

## 🐛 Bug Fixes

- Update dependecies ([93eab72](https://github.com/favware/cliff-jumper/commit/93eab72d1b986511e5808c1f5a36c61f7cd9f72e))
- **deps:** Update dependency @sapphire/result to ^2.0.1 ([cc26aa0](https://github.com/favware/cliff-jumper/commit/cc26aa0209d924542bdc1f6333289e36051be10e))
- **deps:** Update dependency @sapphire/utilities to ^3.7.0 ([e9bfa0a](https://github.com/favware/cliff-jumper/commit/e9bfa0ac1aa13ba8999b6e3e65d3d7c8cdf08969))

# [@favware/cliff-jumper@1.8.5](https://github.com/favware/cliff-jumper/compare/@favware/cliff-jumper@1.8.4...@favware/cliff-jumper@1.8.5) - (2022-06-29)

## 🐛 Bug Fixes

- Use resolved new version if available ([eacdb59](https://github.com/favware/cliff-jumper/commit/eacdb59b6694b063423ab4c19379b4ed1fb76cb1))

# [@favware/cliff-jumper@1.8.4](https://github.com/favware/cliff-jumper/compare/@favware/cliff-jumper@1.8.3...@favware/cliff-jumper@1.8.4) - (2022-06-26)

## 🏠 Refactor

- Update to sapphire result v2 ([eaeb14a](https://github.com/favware/cliff-jumper/commit/eaeb14a00baa53881c55c8c0410bf86b4ecfd16a))

# [@favware/cliff-jumper@1.8.3](https://github.com/favware/cliff-jumper/compare/@favware/cliff-jumper@1.8.2...@favware/cliff-jumper@1.8.3) - (2022-06-06)

## 🏠 Refactor

- Change dry run method for comitting ([40190cd](https://github.com/favware/cliff-jumper/commit/40190cd22a010f4822569122fd8804824b156623))
- Deduplicate tag template resolver ([ad95276](https://github.com/favware/cliff-jumper/commit/ad95276226da43454351f84f3dad34c15f64ef9b))

## 🐛 Bug Fixes

- Ensure `--dry-run` goes through the whole process while not writing anything ([1dc7709](https://github.com/favware/cliff-jumper/commit/1dc77099966b10eb71c3f3585277042a184cdddf))
- Use tagTemplate for git cliff ([5a59274](https://github.com/favware/cliff-jumper/commit/5a592745023d194af0797cbbfa5a140aabe71daf))
- **deps:** Update all non-major dependencies ([9f55cb5](https://github.com/favware/cliff-jumper/commit/9f55cb5e293be2aaa1de60479b91c997fbd46bb6))

# [@favware/cliff-jumper@1.8.2](https://github.com/favware/cliff-jumper/compare/@favware/cliff-jumper@1.8.0...@favware/cliff-jumper@1.8.2) - (2022-06-03)

## 🏠 Refactor

- Stop using npm to read new version and instead read and parse JSON ([7207e45](https://github.com/favware/cliff-jumper/commit/7207e4503350c7469648292e418948847e72b7be))

## 🐛 Bug Fixes

- Properly resolve pre-releases ([cc760af](https://github.com/favware/cliff-jumper/commit/cc760af56ee5f1dfc00264334d42ec95b3520d69))
- Stop using `npm version` to bump package and instead use `semver` directly ([662b90e](https://github.com/favware/cliff-jumper/commit/662b90e9b8acb2f6419a599cbac569f33ccb45a2))

## 📝 Documentation

- Add @renovate[bot] as a contributor ([75da1b1](https://github.com/favware/cliff-jumper/commit/75da1b1f9dcccc53071c77189fe9f3245fd5a3a5))
- Add @renovate-bot as a contributor ([a3558eb](https://github.com/favware/cliff-jumper/commit/a3558eb64ded8671567e4e79c4a1e40f025af014))
- Fix JSON schema ([df316de](https://github.com/favware/cliff-jumper/commit/df316deeb67f9c64fd38fc8138f73dd9a28e55c7))

# [@favware/cliff-jumper@1.8.0](https://github.com/favware/cliff-jumper/compare/@favware/cliff-jumper@1.7.0...@favware/cliff-jumper@1.8.0) - (2022-05-13)

## 🚀 Features

- Allow forcing `skipChangelog` and `skipTag` to `false` with `--no-*` flags ([99ffe13](https://github.com/favware/cliff-jumper/commit/99ffe132c154bea0d4c6fd9aafac95576977498f))

# [@favware/cliff-jumper@1.7.0](https://github.com/favware/cliff-jumper/compare/@favware/cliff-jumper@1.6.0...@favware/cliff-jumper@1.7.0) - (2022-05-07)

## 🐛 Bug Fixes

- Log the package and version and bumping the version ([c50a27e](https://github.com/favware/cliff-jumper/commit/c50a27ec0f0ed0ba7f609b9fd6784e0a26012788))

## 🚀 Features

- Revert b4bc73d99482416e73a69320ad09f2b853a26509 (do not auto disable changelog generation in CI) ([41fb85a](https://github.com/favware/cliff-jumper/commit/41fb85acca94fc46fc3a86ed1d35f1060c526388))

# [@favware/cliff-jumper@1.6.0](https://github.com/favware/cliff-jumper/compare/@favware/cliff-jumper@1.5.1...@favware/cliff-jumper@1.6.0) - (2022-05-07)

## 🐛 Bug Fixes

- Do not auto disable changelog generation in CI ([b4bc73d](https://github.com/favware/cliff-jumper/commit/b4bc73d99482416e73a69320ad09f2b853a26509))

## 🚀 Features

- Log the package and version after generating the changelog ([71ab681](https://github.com/favware/cliff-jumper/commit/71ab681081b237beb9adfff716094820cca5eb5a))

## 🪞 Styling

- Change emoji from 📦 to 📝 ([6304346](https://github.com/favware/cliff-jumper/commit/630434640e07a34da181906c60387ca92a1baef7))

# [@favware/cliff-jumper@1.5.1](https://github.com/favware/cliff-jumper/compare/@favware/cliff-jumper@1.5.0...@favware/cliff-jumper@1.5.1) - (2022-05-07)

## 🐛 Bug Fixes

- List tag template in verbose options log ([87393a2](https://github.com/favware/cliff-jumper/commit/87393a2d823dabaaeddd2a305ea9e620f09fa363))
- Only require `options.monoRepo` to use mono repo detection for conventional recommended bump ([f1548f3](https://github.com/favware/cliff-jumper/commit/f1548f37533e3d96b3add115376203294b2da600))

# [@favware/cliff-jumper@1.5.0](https://github.com/favware/cliff-jumper/compare/@favware/cliff-jumper@1.4.0...@favware/cliff-jumper@1.5.0) - (2022-05-07)

## 🚀 Features

- Add tag template option ([1e047b6](https://github.com/favware/cliff-jumper/commit/1e047b660303495812fcdecaeb26ec205856323b))

# [@favware/cliff-jumper@1.4.0](https://github.com/favware/cliff-jumper/compare/@favware/cliff-jumper@1.3.1...@favware/cliff-jumper@1.4.0) - (2022-04-28)

## Features

- Log `yarn npm publish` when the package is using Yarn v3 ([983b191](https://github.com/favware/cliff-jumper/commit/983b19154e930177ac344a726c746fc87076b0ae))
- Introduce new flag `--skip-changelog` and separate `skip-tag` from it. Follows same behaviour to ensure non-breaking ([b21b772](https://github.com/favware/cliff-jumper/commit/b21b772dd2196689c934b7a0f3af18a60d89af5b))

# [@favware/cliff-jumper@1.3.1](https://github.com/favware/cliff-jumper/compare/@favware/cliff-jumper@1.3.0...@favware/cliff-jumper@1.3.1) - (2022-04-26)

## Bug Fixes

- **tag:** Only tag with package name in mono repos ([bb73dc3](https://github.com/favware/cliff-jumper/commit/bb73dc3b65a536a021f251116e7caa27dcdf25a6))

# [@favware/cliff-jumper@1.3.0](https://github.com/favware/cliff-jumper/compare/@favware/cliff-jumper@1.2.0...@favware/cliff-jumper@1.3.0) - (2022-04-26)

## Features

- Add `--mono-repo` and `--no-mono-repo` flags ([6d86477](https://github.com/favware/cliff-jumper/commit/6d86477335a39a13c7f074b7502b05067ebd47fc))

# [@favware/cliff-jumper@1.2.0](https://github.com/favware/cliff-jumper/compare/@favware/cliff-jumper@1.1.3...@favware/cliff-jumper@1.2.0) - (2022-04-21)

## Features

- Add `commitMessageTemplate` ([933a6e5](https://github.com/favware/cliff-jumper/commit/933a6e5c4ec88e48e9de88aa995ea1a2d94c3d20))

# [@favware/cliff-jumper@1.1.3](https://github.com/favware/cliff-jumper/compare/@favware/cliff-jumper@1.1.2...@favware/cliff-jumper@1.1.3) - (2022-04-18)

## Bug Fixes

- Fixed commit message being invalid after execa->execSync change ([37ed667](https://github.com/favware/cliff-jumper/commit/37ed667493470d8d912312377b81a5994e36301a))
- Switch from `execa` to `execSync` ([4f26562](https://github.com/favware/cliff-jumper/commit/4f265626317e831c7ceb8567853e6a598f8c5120))

# [@favware/cliff-jumper@1.1.2](https://github.com/favware/cliff-jumper/compare/@favware/cliff-jumper@1.1.1...@favware/cliff-jumper@1.1.2) - (2022-04-18)

## Bug Fixes

- Properly check if git cliff exists or not ([5ab2727](https://github.com/favware/cliff-jumper/commit/5ab2727f0a6909c53173db0303b32a6a3c9c56fa))

# [@favware/cliff-jumper@1.1.1](https://github.com/favware/cliff-jumper/compare/@favware/cliff-jumper@1.1.0...@favware/cliff-jumper@1.1.1) - (2022-04-18)

## Bug Fixes

- Only check for changelog and git-cliff when `skip-tag` is `false` ([7d3a2c8](https://github.com/favware/cliff-jumper/commit/7d3a2c87a48fa72cc94a3c121eed50093d78237a))
- Fixed bundle published to npm ([c1d996d](https://github.com/favware/cliff-jumper/commit/c1d996d2a89cd65d08ad784dc3ab5b8306ab3156))

# [@favware/cliff-jumper@1.1.0](https://github.com/favware/cliff-jumper/compare/@favware/cliff-jumper@1.0.2...@favware/cliff-jumper@1.1.0) - (2022-04-18)

## Features

- Add notice once done about pushing and publishing ([a9a54a5](https://github.com/favware/cliff-jumper/commit/a9a54a5dd81b97690e1ecb8b33c0526419f1dbbf))

## Refactor

- Improve checking for `git cliff` ([82c9500](https://github.com/favware/cliff-jumper/commit/82c9500f13267d759f63257e6bdbcd30554afde1))

# [@favware/cliff-jumper@1.0.2](https://github.com/favware/cliff-jumper/compare/@favware/cliff-jumper@1.0.1...@favware/cliff-jumper@1.0.2) - (2022-04-18)

## Bug Fixes

- Add missing `conventional-changelog-angular` dependency ([f3efcc8](https://github.com/favware/cliff-jumper/commit/f3efcc811f5d9b980db735f6e64239302c0d2261))

# [@favware/cliff-jumper@1.0.1](https://github.com/favware/cliff-jumper/compare/@favware/cliff-jumper@1.0.0...@favware/cliff-jumper@1.0.1) - (2022-04-18)

## Bug Fixes

- **github-release:** Use yarn publish ([8453aa4](https://github.com/favware/cliff-jumper/commit/8453aa45da4bf6c007b9dcb845e454cb52792329))

# [@favware/cliff-jumper@1.0.0]
(https://github.com/favware/cliff-jumper/tree/@favware/cliff-jumper@1.0.0) - (2022-04-17)

## Bug Fixes

- **commit:** Remove wrapping quotes from commit ([9891524](https://github.com/favware/cliff-jumper/commit/98915241438c4a420d3377b668cf72356985265f))
- Fixed tag in changelog ([14ac52f](https://github.com/favware/cliff-jumper/commit/14ac52f71711ec4c5d10894fbfcdf11f4ce0225b))
- Fixed resolving git-cliff options ([ae7eb84](https://github.com/favware/cliff-jumper/commit/ae7eb84a9fe7e1e235449e24d74906f1e02ba01e))
- Fixed resolving repository root ([7fb9f72](https://github.com/favware/cliff-jumper/commit/7fb9f72f3cef01afa0724cdeb922acb44880dced))
- Better fix for parsing options ([867abe1](https://github.com/favware/cliff-jumper/commit/867abe14ab5f3afa68f2fbdd88d3b9fd24e108a3))
- Resolved issue with merging of options ([b1abe16](https://github.com/favware/cliff-jumper/commit/b1abe16c0eb49b14c00c3e15ae46d4804d5b2903))
- Fixed boolean options ([4bf2b0b](https://github.com/favware/cliff-jumper/commit/4bf2b0b23b05dd8832140f4df41ed3ad9537bdc0))
- Ensure git-cliff can properly be detected ([bea671a](https://github.com/favware/cliff-jumper/commit/bea671ab5a687a94bbfbefa14940c7b03eb1e27e))
- Manually check required options ([8d54298](https://github.com/favware/cliff-jumper/commit/8d54298fb4a9b5e3a81f5bc9f526fc75216aa002))

## Features

- Hello github 🎉 ([765fe15](https://github.com/favware/cliff-jumper/commit/765fe15f005d36e674b08dd0dd82b2fe74546c98))

## Refactor

- Rename bump to dry-run ([87b3ba0](https://github.com/favware/cliff-jumper/commit/87b3ba02550aaa7181b974b14e70ebf6bc09031f))

