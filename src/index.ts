import { Telegraf } from 'telegraf';
import { BotContext } from './context';
import { createLogger } from './logger';
import { loadConfiguration } from './config';
import { Command, CommandAliases } from './command';
import { cmdHelp } from './commands/help';
import { cmdKick } from './commands/kick';
import { cmdPingAdmins } from './commands/pingAdmins';
import { cmdPingRemote } from './commands/pingRemote';
import { cmdPingMemberAt } from './commands/pingMembersAt';
import { cmdFindMember } from './commands/findMember';
import { cmdFindMembersAt } from './commands/findMembersAt';
import { cmdRegisterMemberAt } from './commands/registerMemberAt';
import { cmdDeregisterMemberFrom } from './commands/deregisterMemberFrom';
import { cmdRegisterRemoteMember } from './commands/registerRemoteMember';
import { cmdDeregisterRemoteMember } from './commands/deregisterRemoteMember';
import { cmdListCountryMemberCount } from './commands/listCountryMemberCount';
import { cmdRankCountryMemberCount } from './commands/rankCountryMemberCount';
import { cmdRankCountryRemoteMemberCount } from './commands/rankCountryRemoteMemberCount';
import { createContextMiddleware } from './middlewares/createContextMiddleware';
import { createCommandMiddleware } from './middlewares/createCommandMiddleware';
import { createBlockMiddleware } from './middlewares/createBlockMiddleware';
import { createLoggerMiddleware } from './middlewares/createLoggerMiddleware';
import { createTranslateMiddleware } from './middlewares/createTranslateMiddleware';

const main = async () => {
  const config = await loadConfiguration();
  const logger = createLogger(config.environment);
  const bot = new Telegraf<BotContext>(config.botToken);

  bot.use(createTranslateMiddleware());
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
    CommandAliases[Command.RankCountryRemoteMemberCount],
    cmdRankCountryRemoteMemberCount
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
  bot.command(CommandAliases[Command.Kick], cmdKick);

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));

  await bot.launch();

  logger.info('Bot is running.');
};

main();
