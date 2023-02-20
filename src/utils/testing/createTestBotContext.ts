import path from 'path';
import { User } from 'telegraf/typings/telegram-types';
import { BotContext } from '../../context';
import { createDatabaseInstance } from '../../database';
import { createMemberMention } from '../../member';
import { createTranslation } from '../../middlewares/createTranslateMiddleware/translate';

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
  overrides: RecursivePartial<BotContext> = {}
) => {
  const databasePath = path.resolve(
    __dirname,
    './anonymizedDatabase.json'
  );
  const database = await createDatabaseInstance(databasePath);

  const baseContext: RecursivePartial<BotContext> = {
    safeUser: {
      id: fakeUser.id,
      mention: createMemberMention(fakeUser),
    },
    database: database,
    command: {
      bot: 'GringoBot',
    },
    replyWithMarkdown: jest.fn(),
    replyWithAutoDestructiveMessage: jest.fn(),
    groupLanguage: 'en',
    i18n: await createTranslation('en'),
  };

  const ctx = {
    ...baseContext,
    ...overrides,
  } as BotContext;

  const next = jest.fn();

  return {
    ctx,
    next,
  };
};
