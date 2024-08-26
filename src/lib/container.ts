import type { Logger } from '@skyra/logger';

interface Container {
  logger: Logger;
}

export const container: Container = {} as Container;
