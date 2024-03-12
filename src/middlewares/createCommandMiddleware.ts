import { Middleware } from 'telegraf';
import { BotContext } from '../context.js';

const commandPartsRegex = /^\/([^@\s]+)@?(?:(\S+)|)\s?([\s\S]+)?$/i;

export const createCommandMiddleware = () => {
  const middleware: Middleware<BotContext> = async (ctx, next) => {
    // @ts-ignore
    const messageText = ctx.message?.text;

    const parts = commandPartsRegex.exec(messageText);

    if (!parts) return next();

    const command = {
      text: messageText,
      command: parts[1],
      bot: parts[2],
      args: parts[3],
    };

    ctx.userCommand = command;

    return next();
  };

  return middleware;
};
