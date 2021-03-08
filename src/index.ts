import path from 'path';
import { Telegraf } from 'telegraf';
import TelegrafI18n from 'telegraf-i18n';
import {
  Command,
  CommandAliases,
  CommandDescriptions,
} from './command';
import { cmdDeregisterMemberFrom } from './commands/deregisterMemberFrom';
import { cmdPingAdmins } from './commands/pingAdmins';
import { cmdPingMemberAt } from './commands/pingMembersAt';
import { cmdRegisterMemberAt } from './commands/registerMemberAt';
import { loadConfiguration } from './config';
import { BotContext } from './context';
import { createDatabase } from './database';
import { createLogger } from './logger';

const main = async () => {
  const config = await loadConfiguration();
  const logger = createLogger(config.environment);
  const databaseLogger = logger.child({ source: 'database' });
  const bot = new Telegraf<BotContext>(config.botToken);

  const i18n = new TelegrafI18n({
    defaultLanguage: 'ptbr',
    allowMissing: false,
    directory: path.resolve(process.cwd(), config.localesPath),
  });

  bot.use(i18n.middleware());

  bot.use(async (ctx, next) => {
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
      databaseLogger
    );

    ctx.database = database;
    ctx.logger = logger;
    ctx.config = config;

    ctx.setMyCommands(CommandDescriptions);

    return next();
  });

  bot.command(CommandAliases[Command.PingAdmins], cmdPingAdmins);
  bot.command(CommandAliases[Command.PingMembersAt], cmdPingMemberAt);
  bot.command(
    CommandAliases[Command.RegisterMemberAt],
    cmdRegisterMemberAt
  );
  bot.command(
    CommandAliases[Command.DeregisterMemberFrom],
    cmdDeregisterMemberFrom
  );

  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));

  await bot.launch();

  logger.info('Bot is running.');
};

main();
