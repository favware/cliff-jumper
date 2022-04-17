export default undefined;

declare module 'commander' {
  export interface OptionValues {
    bump: true;
    name: string;
    org: string;
    packagePath: string;
    preid: string;
    verbose: boolean;
    skipTag: boolean;
    firstRelease: boolean;
  }
}
