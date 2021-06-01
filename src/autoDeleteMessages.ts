import to from 'await-to-js';
import { BotContext } from './context';

const expired = (createdAt: number, timeout: number) => {
  const minute = 60000;
  return Math.floor((Date.now() - createdAt) / minute) >= timeout;
};

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

      const [deleteChatMessageError, deleted] = await to(
        ctx.deleteMessage(id)
      );

      if (deleteChatMessageError) {
        ctx.logger.error(
          `Failed to delete expired message with id "${id}" from the chat "${chatId}"`
        );
      }

      if (deleted) {
        ctx.logger.info(
          `Deleted expired message with id "${id}" from the chat "${chatId}"`
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
