import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { vi } from 'vitest';
import { BotContext } from '../../context.js';
import { createTestDatabase } from '../../database.js';
import { createMemberMention } from '../../member.js';
import { createTranslation } from '../../middlewares/createTranslateMiddleware/translate.js';
import { RecursivePartial } from '../types.js';
import { fakeUser } from './fakeUser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createTestBotContext = async (
  contextOverrides: RecursivePartial<BotContext> = {}
) => {
  const databasePath = resolve(
    __dirname,
    './anonymizedDatabase.json'
  );
  const database = await createTestDatabase(databasePath);

  const replyWithMarkdown = vi.fn<
    Parameters<BotContext['replyWithMarkdown']>,
    ReturnType<BotContext['replyWithMarkdown']>
  >();
  const replyWithAutoDestructiveMessage = vi.fn<
    Parameters<BotContext['replyWithAutoDestructiveMessage']>,
    ReturnType<BotContext['replyWithAutoDestructiveMessage']>
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

  const next = vi.fn<[], Promise<void>>();

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
