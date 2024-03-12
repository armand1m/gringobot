import { to } from 'await-to-js';
import retry, { RetryFunction } from 'async-retry';
import { BotContext } from './context.js';
import { expired } from './utils/expired.js';

export const runMessageRecycling = async (
  ctx: BotContext
): Promise<void> => {
  const database = await ctx.loadDatabase();
  const messages = database.getAutoDeleteMessages();
  const messageTimeout = ctx.config.messageTimeoutInMinutes;

  const promises = Object.entries(messages).map(
    async ([unsafeId, createdAt]) => {
      if (!expired(createdAt, messageTimeout)) {
        return;
      }

      const id = Number(unsafeId);
      const chatId = ctx.chat?.id;

      ctx.logger.info(
        `Trying to delete expired message with id "${id}" from the chat "${chatId}"..`
      );

      const deleteMessage: RetryFunction<void> = async (
        bail,
        attempt
      ) => {
        const [deleteChatMessageError, deleted] = await to(
          ctx.deleteMessage(id)
        );

        if (deleteChatMessageError) {
          ctx.logger.error(
            `[Attempt No ${attempt}]: Failed to delete expired message with id "${id}" from the chat "${chatId}"`
          );

          const errorMessage =
            // @ts-ignore
            deleteChatMessageError.response.description;

          if (
            errorMessage ===
            'Bad Request: message to delete not found'
          ) {
            ctx.logger.info(
              `Message with id "${id}" does not exists in the chat "${chatId}"`
            );
            bail(deleteChatMessageError);
            return;
          }

          throw deleteChatMessageError;
        }

        if (deleted) {
          ctx.logger.info(
            `Deleted expired message with id "${id}" from the chat "${chatId}"`
          );
        }
      };

      const [deleteChatMessageError] = await to(
        retry(deleteMessage, {
          retries: 3,
        })
      );

      if (deleteChatMessageError) {
        ctx.logger.error(
          `Failed to delete expired message with id "${id}" from the chat`
        );
      }

      ctx.logger.info(
        `Trying to delete expired message with id "${id}" from the database..`
      );

      const [deleteDbMessageError] = await to(
        database.removeAutoDeleteMessage(id)
      );

      if (deleteDbMessageError) {
        ctx.logger.error(
          `Failed to delete expired message with id "${id}" from the database`
        );
      } else {
        ctx.logger.info(
          `Deleted expired message with id "${id}" from the database`
        );
      }
    }
  );

  await Promise.all(promises);
};
