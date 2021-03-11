import pino from 'pino';
import { Context } from 'telegraf';
import TelegrafI18n from 'telegraf-i18n';
import { Config } from './config';
import { DatabaseInstance } from './database';

export interface BotContext extends Context {
  config: Config;
  database: DatabaseInstance;
  logger: pino.Logger;
  i18n: TelegrafI18n;
  safeUser: {
    mention: string;
    id: number;
  };
  command: {
    text: string;
    command: string;
    bot?: string;
    args?: string;
  };
}
