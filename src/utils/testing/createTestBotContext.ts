import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ChatMemberAdministrator } from 'telegraf/types';
import { vi } from 'vitest';
import { BotContext } from '../../context.js';
import { createMemberMention } from '../../member.js';
import { createTranslation } from '../../middlewares/createTranslateMiddleware/translate.js';
import { RecursivePartial } from '../types.js';
import { createTestDatabase } from './createTestDatabase.js';
import {
  createFakeUser,
  mainFakeTestUser,
  fakeUserIds,
} from './fakeUser.js';

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
      id: mainFakeTestUser.id,
      mention: createMemberMention(mainFakeTestUser),
    },
    database: database,
    userCommand: {
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

  ctx.fetchRemoteMembersMentionList = async (
    silenced: boolean = false
  ) => {
    const allMembers = ctx.database.getAllRemoteMembers();

    const membersFetchResult = Object.keys(allMembers).map(
      (userId) => {
        return createMemberMention(
          {
            id: Number(userId),
            first_name: `testuser_${userId}`,
            is_bot: false,
          },
          silenced
        );
      }
    );

    return membersFetchResult;
  };

  ctx.getChatAdministrators = async () => {
    return fakeUserIds.map(
      (id) =>
        ({
          user: createFakeUser(id),
          status: 'administrator',
          is_anonymous: false,
        } as ChatMemberAdministrator)
    );
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

    throw new Error(
      'replyWithAutoDestructiveMessage nor replyWithMarkdown were invoked.'
    );
  };

  return {
    ctx,
    next,
    reply,
  };
};
