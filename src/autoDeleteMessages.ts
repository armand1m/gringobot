import { BotContext } from './context';

export interface AutoDeleteMessage {
  [messageId: number]: number;
}

export const runMessageRecycling = async (
  ctx: BotContext
): Promise<void> => {
  const database = ctx.database;
  const messages = database.getAutoDeleteMessages();
  const minute = 60000;
  const recycleTimeout = 1;

  Object.entries(messages).map(async ([id, createdAt]) => {
    if (
      Math.floor((Date.now() - createdAt) / minute) >= recycleTimeout
    ) {
      await ctx.deleteMessage(+id);
      await database.removeAutoDeleteMessage(+id);
    }
  });
};
