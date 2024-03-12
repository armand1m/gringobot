import { to } from 'await-to-js';
import retry, { RetryFunction } from 'async-retry';
import { BotContext } from './context.js';
import { expired } from './utils/expired.js';
import { createMemberMention } from './member.js';

// TODO: make timeout configurable
const messageTimeout = 2;

export const runCaptchaRecycling = async (
  ctx: BotContext
): Promise<void> => {
  const database = await ctx.loadDatabase();

  if (!database.isCaptchaEnabled) {
    return;
  }

  const captcha = await database.getCaptcha();
  const waitingUsers = captcha?.waitingUsers ?? {};

  const promises = Object.entries(waitingUsers).map(
    async ([userId, entry]) => {
      const hasExpired = expired(entry.timestamp, messageTimeout);

      ctx.logger.info(
        `Captcha issued at ${entry.timestamp}: expiration status: '${
          hasExpired ? 'expired' : 'not expired'
        }'`
      );

      if (!hasExpired) {
        /** the captcha still hasn't expired. */
        return;
      }

      const id = Number(userId);
      const chatId = ctx.chat?.id;

      ctx.logger.info(
        `Trying to kick user with id "${id}" from the chat "${chatId}", since captcha expired..`
      );

      const kickUser: RetryFunction<void> = async (bail, attempt) => {
        const [kickUserError, kicked] = await to(
          ctx.banChatMember(id, undefined, {
            revoke_messages: true,
          })
        );

        if (kicked) {
          ctx.logger.info(
            `Kicked user with id "${id}" from the chat "${chatId}"`
          );
          return;
        }

        if (kickUserError) {
          ctx.logger.error(
            `[Attempt No ${attempt}]: Failed to kick user with id "${id}" from the chat "${chatId}"`
          );

          const errorMessage =
            // @ts-ignore
            kickUserError.response.description;

          ctx.logger.error(errorMessage);

          throw kickUserError;
        }
      };

      const [kickUserError] = await to(
        retry(kickUser, {
          retries: 3,
        })
      );

      if (kickUserError) {
        ctx.logger.error(
          `Failed to kick user with id "${id}" from the chat:`
        );
        ctx.logger.error(kickUserError);
      }

      if (!kickUserError) {
        ctx.logger.info(
          `Kicked user with id "${id}" from the chat "${chatId}". Adding user to chat kicklist.`
        );

        const { t } = ctx.i18n;
        await ctx.database.removeUserFromCaptchaWaitlist(entry.user);
        await ctx.database.addUserToCaptchaKicklist(entry.user);
        await ctx.replyWithMarkdown(
          t('kick', 'userGotKickedCaptcha', {
            kickedUser: createMemberMention(entry.user),
          })
        );
      }
    }
  );

  await Promise.all(promises);
};
