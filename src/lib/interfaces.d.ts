import type { IdentifierBase } from 'semver/functions/inc.js';

export default undefined;

declare module 'commander' {
  export interface Options {
    name: string;
    org: string;
    packagePath: string;
    preid: string;
    identifierBase: IdentifierBase | false;
    dryRun: boolean;
    verbose: boolean;
    skipChangelog: boolean;
    skipTag: boolean;
    install: boolean;
    firstRelease: boolean;
    monoRepo: boolean;
    commitMessageTemplate: string;
    tagTemplate: string;
  }
}
