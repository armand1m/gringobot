import path from 'path';
import { Telegraf } from 'telegraf';
import TelegrafI18n from 'telegraf-i18n';
import { BotContext } from './context';
import { createLogger } from './logger';
import { loadConfiguration } from './config';
import { Command, CommandAliases } from './command';
import { cmdHelp } from './commands/help';
import { cmdFindMember } from './commands/findMember';
import { cmdPingAdmins } from './commands/pingAdmins';
import { cmdPingMemberAt } from './commands/pingMembersAt';
import { cmdRegisterMemberAt } from './commands/registerMemberAt';
import { cmdDeregisterMemberFrom } from './commands/deregisterMemberFrom';
import { createContextMiddleware } from './middleware/createContextMiddleware';
import { createCommandMiddleware } from './middleware/createCommandMiddleware';

const main = async () => {
  const config = await loadConfiguration();
  const logger = createLogger(config.environment);
  const bot = new Telegraf<BotContext>(config.botToken);

  const i18n = new TelegrafI18n({
    defaultLanguage: 'ptbr',
    allowMissing: false,
    directory: path.resolve(process.cwd(), config.localesPath),
  });

  bot.use(i18n.middleware());
  bot.use(createCommandMiddleware());
  bot.use(
    createContextMiddleware({
      config,
      logger: logger.child({ source: 'database' }),
    })
  );

  bot.command(CommandAliases[Command.Help], cmdHelp);
  bot.command(CommandAliases[Command.FindMember], cmdFindMember);
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

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));

  await bot.launch();

  logger.info('Bot is running.');
};

main();
