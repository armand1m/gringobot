import { Middleware } from 'telegraf';
import { BotContext } from '../../context.js';
import { createTranslation } from './translate.js';

export const createTranslateMiddleware = () => {
  const middleware: Middleware<BotContext> = async (ctx, next) => {
    ctx.i18n = await createTranslation(ctx.groupLanguage);
    return next();
  };

  return middleware;
};
