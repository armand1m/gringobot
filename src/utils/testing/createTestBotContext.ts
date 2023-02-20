import { Alpha2Code } from 'i18n-iso-countries';
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

  let ctx = {
    ...baseContext,
  } as BotContext;

  /**
   * We override the fetch members mention list function
   * so we can have test user mentions in a consistent way
   */
  ctx.fetchMembersMentionList = async (countryCode, silenced) => {
    const memberIds = ctx.database.getMembersAt(countryCode);
    const membersFetchResult = memberIds.map((userId) => {
      return createMemberMention(
        {
          id: userId,
          first_name: `testuser_${userId}`,
          is_bot: false,
        },
        silenced
      );
    });

    return membersFetchResult;
  };

  /**
   * We override the random values function here to always
   * return the first items of the list given the amount.
   *
   * This only happens in test so we can have deterministics results.
   */
  ctx.getRandomValues = (list, amount) => {
    return list.slice(0, amount);
  };

  ctx = {
    ...ctx,
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
