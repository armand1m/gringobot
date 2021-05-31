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
  const messageTimeout = 1;

  Object.entries(messages).map(async ([unsafeId, createdAt]) => {
    if (!expired(createdAt, messageTimeout)) {
      return;
    }

    const id = Number(unsafeId);

    try {
      ctx.logger.info(
        `Trying to delete expired message with id "${id}" from the chat "${ctx.chat?.id}"`
      );

      await ctx.deleteMessage(id);

      ctx.logger.info(
        `Deleted expired message with id "${id}" from the chat "${ctx.chat?.id}"`
      );
    } catch (err) {
      ctx.logger.warn(
        `Failed to delete expired message with id "${id}" from the chat "${ctx.chat?.id}"`
      );
    }

    try {
      ctx.logger.info(
        `Trying to delete expired message with id "${id}" from the database`
      );

      await database.removeAutoDeleteMessage(id);

      ctx.logger.info(
        `Deleted expired message with id "${id}" from the database`
      );
    } catch (err) {
      ctx.logger.warn(
        `Failed to delete expired message with id "${id}" from the database`
      );
    }
  });
};
