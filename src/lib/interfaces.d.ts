export default undefined;

declare module 'commander' {
  export interface OptionValues {
    name: string;
    org: string;
    packagePath: string;
    preid: string;
    dryRun: boolean;
    verbose: boolean;
    skipTag: boolean;
    firstRelease: boolean;
    monoRepo: boolean;
    commitMessageTemplate: string;
  }
}
