import { Middleware } from 'telegraf';
import { BotContext } from '../../context';
import { createTranslation } from './translate';

export const createTranslateMiddleware = () => {
  const middleware: Middleware<BotContext> = async (ctx, next) => {
    const language = await ctx.database.getGroupLanguage();
    ctx.i18n = await createTranslation(language);
    return next();
  };

  return middleware;
};
