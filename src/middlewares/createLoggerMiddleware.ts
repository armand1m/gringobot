import pino from 'pino';
import { Middleware } from 'telegraf';
import { BotContext } from '../context';

interface Props {
  logger: pino.Logger;
}

export const createLoggerMiddleware = ({ logger }: Props) => {
  const middleware: Middleware<BotContext> = async (ctx, next) => {
    ctx.logger = logger;
    return next();
  };

  return middleware;
};
