import { LoggerOptions, pino } from 'pino';
import { Config } from './config.js';

export const createLogger = (environment: Config['environment']) => {
  const loggerOptions: LoggerOptions =
    environment === 'development'
      ? {
          transport: {
            target: 'pino-pretty',
          },
        }
      : {};

  const logger = pino(loggerOptions);

  return logger;
};
