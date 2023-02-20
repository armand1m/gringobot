import { Alpha2Code } from 'i18n-iso-countries';
import pino from 'pino';
import { Context } from 'telegraf';
import { Config } from './config';
import { DatabaseInstance } from './database';
import {
  AvailableLocales,
  Translation,
} from './middlewares/createTranslateMiddleware/translate';

interface AutoDestructiveMessageOptions {
  deleteCommandMessage: boolean;
  deleteReplyMessage: boolean;
}

export interface BotContext extends Context {
  config: Config;
  database: DatabaseInstance;
  loadDatabase: () => Promise<DatabaseInstance>;
  groupLanguage: AvailableLocales;
  checkAdminAccess: () => Promise<boolean>;
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
  i18n: Translation;
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
