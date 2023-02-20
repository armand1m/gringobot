import path from 'path';
import { jest } from '@jest/globals';
import { User } from 'telegraf/types';
import { BotContext } from '../../context.js';
import {
  createDatabaseInstance,
  DatabaseSchema,
} from '../../database.js';
import { createMemberMention } from '../../member.js';
import { createTranslation } from '../../middlewares/createTranslateMiddleware/translate.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P];
};

const fakeUser: User = {
  first_name: 'test',
  id: 128256,
  is_bot: false,
  language_code: 'en',
  last_name: 'user',
  username: 'testuser',
};

export const createTestBotContext = async (
  contextOverrides: RecursivePartial<BotContext> = {},
  _dataOverrides: RecursivePartial<DatabaseSchema> = {}
) => {
  const databasePath = path.resolve(
    __dirname,
    './anonymizedDatabase.json'
  );
  const database = await createDatabaseInstance(databasePath);

  const replyWithMarkdown = jest.fn<
    BotContext['replyWithMarkdown']
  >();
  const replyWithAutoDestructiveMessage = jest.fn<
    BotContext['replyWithAutoDestructiveMessage']
  >();

  const baseContext: RecursivePartial<BotContext> = {
    safeUser: {
      id: fakeUser.id,
      mention: createMemberMention(fakeUser),
    },
    database: database,
    command: {
      bot: 'GringoBot',
    },
    replyWithMarkdown,
    replyWithAutoDestructiveMessage,
    groupLanguage: 'en',
    i18n: await createTranslation('en'),
  };

  const ctx = {
    ...baseContext,
    ...contextOverrides,
  } as BotContext;

  const next = jest.fn<() => Promise<void>>();

  const reply = () => {
    if (replyWithAutoDestructiveMessage.mock.calls.length > 0) {
      return replyWithAutoDestructiveMessage.mock.calls[0][0];
    }

    if (replyWithMarkdown.mock.calls.length > 0) {
      return replyWithMarkdown.mock.calls[0][0];
    }

    return replyWithMarkdown.mock.calls;
  };

  return {
    ctx,
    next,
    reply,
  };
};
