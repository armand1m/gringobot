import pino from 'pino';
import { Middleware } from 'telegraf';
import { runMessageRecycling } from '../autoDeleteMessages';
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
  let interval: NodeJS.Timeout;

  const middleware: Middleware<BotContext> = async (ctx, next) => {
    /**
     * telegraf-i18n uses the user session to determine
     * which locale to use. This basically forces
     * all answers to be sent in ptbr.
     */
    ctx.i18n.locale('ptbr');

    const chatId = ctx?.chat?.id;

    if (!chatId) {
      if (!ctx.reply) {
        return;
      }

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
    ctx.config = config;
    ctx.safeUser = {
      id: ctx.from.id,
      mention: createMemberMention(ctx.from),
    };

    ctx.setMyCommands(CommandDescriptions);

    if (!interval) {
      interval = setInterval(() => callMessageRecycling(), 5000);
    }

    const callMessageRecycling = () => {
      runMessageRecycling(ctx);
    };

    return next();
  };

  return middleware;
};
