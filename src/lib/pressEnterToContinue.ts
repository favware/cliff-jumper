import { cyan } from 'colorette';

export function pressEnterToContinue() {
  process.stdout.write(cyan('If you wish to continue anyway press enter key, if you wish to exit, press any other key...'));

  return new Promise((resolve, reject) => {
    const handler = (buffer: Buffer) => {
      process.stdin.removeListener('data', handler);
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdout.write('\n');

      const bytes = Array.from(buffer);

      if (bytes?.[0] === 13) {
        process.nextTick(resolve);
      } else {
        reject(process.exit(1));
      }
    };

    process.stdin.resume();
    process.stdin.setRawMode(true);
    process.stdin.once('data', handler);
  });
}
