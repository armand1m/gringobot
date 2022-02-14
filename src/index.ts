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
import { cmdFindMembersAt } from './commands/findMembersAt';
import { cmdRegisterMemberAt } from './commands/registerMemberAt';
import { cmdDeregisterMemberFrom } from './commands/deregisterMemberFrom';
import { cmdListCountryMemberCount } from './commands/listCountryMemberCount';
import { cmdRankCountryMemberCount } from './commands/rankCountryMemberCount';
import { createContextMiddleware } from './middlewares/createContextMiddleware';
import { createCommandMiddleware } from './middlewares/createCommandMiddleware';
import { createBlockMiddleware } from './middlewares/createBlockMiddleware';
import { createLoggerMiddleware } from './middlewares/createLoggerMiddleware';
import { cmdRegisterRemoteMember } from './commands/registerRemoteMember';
import { cmdDeregisterRemoteMember } from './commands/deregisterRemoteMember';
import { cmdPingRemote } from './commands/pingRemote';

const main = async () => {
  const config = await loadConfiguration();
  const logger = createLogger(config.environment);
  const bot = new Telegraf<BotContext>(config.botToken);

  const i18n = new TelegrafI18n({
    defaultLanguage: 'en',
    allowMissing: false,
    directory: path.resolve(process.cwd(), config.localesPath),
  });

  bot.use(i18n.middleware());
  bot.use(createLoggerMiddleware({ logger }));
  bot.use(createCommandMiddleware());
  bot.use(
    createContextMiddleware({
      config,
    })
  );
  bot.use(createBlockMiddleware());

  if (config.helpCommandEnabled) {
    bot.command(CommandAliases[Command.Help], cmdHelp);
  }

  bot.command(CommandAliases[Command.FindMember], cmdFindMember);
  bot.command(CommandAliases[Command.PingAdmins], cmdPingAdmins);
  bot.command(CommandAliases[Command.PingMembersAt], cmdPingMemberAt);
  bot.command(
    CommandAliases[Command.ListCountryMemberCount],
    cmdListCountryMemberCount
  );
  bot.command(
    CommandAliases[Command.RankCountryMemberCount],
    cmdRankCountryMemberCount
  );
  bot.command(
    CommandAliases[Command.FindMembersAt],
    cmdFindMembersAt
  );
  bot.command(
    CommandAliases[Command.RegisterMemberAt],
    cmdRegisterMemberAt
  );
  bot.command(
    CommandAliases[Command.DeregisterMemberFrom],
    cmdDeregisterMemberFrom
  );
  bot.command(
    CommandAliases[Command.RegisterRemoteMember],
    cmdRegisterRemoteMember
  );
  bot.command(
    CommandAliases[Command.DeregisterRemoteMember],
    cmdDeregisterRemoteMember
  );
  bot.command(CommandAliases[Command.PingRemote], cmdPingRemote);

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));

  await bot.launch();

  logger.info('Bot is running.');
};

main();
