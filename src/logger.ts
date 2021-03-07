import pino from 'pino';
import { Config } from './config';

export const createLogger = (environment: Config['environment']) => {
  const logger = pino({
    prettyPrint: environment === 'development',
  });

  return logger;
};
