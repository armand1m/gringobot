import pino from 'pino';
import { Middleware } from 'telegraf';
import { CommandDescriptions } from '../command';
import { Config } from '../config';
import { BotContext } from '../context';
import { createDatabase } from '../database';

interface Props {
  config: Config;
  logger: pino.Logger;
}

export const createContextMiddleware = ({
  config,
  logger,
}: Props) => {
  const middleware: Middleware<BotContext> = async (ctx, next) => {
    /**
     * telegraf-i18n uses the user session to determine
     * which locale to use. This basically forces
     * all answers to be sent in ptbr.
     */
    ctx.i18n.locale('ptbr');

    const chatId = ctx?.chat?.id;

    if (!chatId) {
      return ctx.reply(
        'GringoBot does not support this type of chat.'
      );
    }

    const database = await createDatabase(
      chatId,
      config.dataPath,
      logger
    );

    ctx.database = database;
    ctx.logger = logger;
    ctx.config = config;

    ctx.setMyCommands(CommandDescriptions);

    return next();
  };

  return middleware;
};
