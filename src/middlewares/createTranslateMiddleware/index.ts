import { Middleware } from 'telegraf';
import { BotContext } from '../../context';
import { createTranslation } from './translate';

export const createTranslateMiddleware = () => {
  const middleware: Middleware<BotContext> = async (ctx, next) => {
    ctx.i18n = await createTranslation('ptbr');
    return next();
  };

  return middleware;
};
