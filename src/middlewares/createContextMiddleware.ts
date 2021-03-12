import pino from 'pino';
import { Middleware } from 'telegraf';
import { CommandDescriptions } from '../command';
import { Config } from '../config';
import { BotContext } from '../context';
import { createDatabase } from '../database';
import { createMemberMention } from '../member';

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

    if (!ctx.from) {
      if (!ctx.reply) {
        /**
         * This is not a message, but an event from the group
         * For now we can ignore it.
         */
        return;
      }

      return ctx.reply(ctx.i18n.t('failedToIdentifyUser'));
    }

    const database = await createDatabase(
      chatId,
      config.dataPath,
      logger
    );

    ctx.database = database;
    ctx.logger = logger;
    ctx.config = config;
    ctx.safeUser = {
      id: ctx.from.id,
      mention: createMemberMention(ctx.from),
    };

    ctx.setMyCommands(CommandDescriptions);

    return next();
  };

  return middleware;
};
