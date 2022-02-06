import { Alpha2Code } from 'i18n-iso-countries';
import pino from 'pino';
import { Context } from 'telegraf';
import TelegrafI18n from 'telegraf-i18n';
import { Config } from './config';
import { DatabaseInstance } from './database';

interface AutoDestructiveMessageOptions {
  deleteCommandMessage: boolean;
  deleteReplyMessage: boolean;
}

export interface BotContext extends Context {
  config: Config;
  database: DatabaseInstance;
  loadDatabase: () => Promise<DatabaseInstance>;
  fetchMembersMentionList: (
    countryCode: Alpha2Code,
    silenced?: boolean
  ) => Promise<string[]>;
  fetchRemoteMembersMentionList: (
    silenced?: boolean
  ) => Promise<string[]>;
  replyWithAutoDestructiveMessage: (
    markdownMessage: string,
    options?: AutoDestructiveMessageOptions
  ) => ReturnType<Context['replyWithMarkdown']>;
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
