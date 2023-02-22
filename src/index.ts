import { Telegraf, TelegramError } from 'telegraf';
import { BotContext } from './context.js';
import { createLogger } from './logger.js';
import { loadConfiguration } from './config.js';
import { Command, CommandAliases } from './command.js';
import { cmdHelp } from './commands/help.js';
import { cmdKick } from './commands/kick.js';
import { cmdSetLanguage } from './commands/setLanguage.js';
import { cmdPingAdmins } from './commands/pingAdmins.js';
import { cmdPingRemote } from './commands/pingRemote.js';
import { cmdPingMembersAt } from './commands/pingMembersAt.js';
import { cmdFindMember } from './commands/findMember.js';
import { cmdFindMembersAt } from './commands/findMembersAt.js';
import { cmdRegisterMemberAt } from './commands/registerMemberAt.js';
import { cmdDeregisterMemberFrom } from './commands/deregisterMemberFrom.js';
import { cmdRegisterRemoteMember } from './commands/registerRemoteMember.js';
import { cmdDeregisterRemoteMember } from './commands/deregisterRemoteMember.js';
import { cmdListCountryMemberCount } from './commands/listCountryMemberCount.js';
import { cmdRankCountryMemberCount } from './commands/rankCountryMemberCount.js';
import { cmdRankCountryRemoteMemberCount } from './commands/rankCountryRemoteMemberCount.js';
import { createContextMiddleware } from './middlewares/createContextMiddleware.js';
import { createCommandMiddleware } from './middlewares/createCommandMiddleware.js';
import { createBlockMiddleware } from './middlewares/createBlockMiddleware.js';
import { createLoggerMiddleware } from './middlewares/createLoggerMiddleware.js';
import { createTranslateMiddleware } from './middlewares/createTranslateMiddleware/index.js';
import { HTTPError } from 'got';

const main = async () => {
  const config = await loadConfiguration();
  const logger = createLogger(config.environment);
  const bot = new Telegraf<BotContext>(config.botToken);

  bot.use(createLoggerMiddleware({ logger }));
  bot.use(createCommandMiddleware());
  bot.use(
    createContextMiddleware({
      config,
    })
  );
  bot.use(createTranslateMiddleware());
  bot.use(createBlockMiddleware());

  if (config.helpCommandEnabled) {
    bot.command(CommandAliases[Command.Help], cmdHelp);
  }

  bot.command(CommandAliases[Command.FindMember], cmdFindMember);
  bot.command(CommandAliases[Command.PingAdmins], cmdPingAdmins);
  bot.command(
    CommandAliases[Command.PingMembersAt],
    cmdPingMembersAt
  );
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
  bot.command(CommandAliases[Command.SetLanguage], cmdSetLanguage);

  bot.catch((err, ctx) => {
    logger.error(
      `Error while handling update ${ctx.update.update_id}:`
    );
    logger.debug({ ctx });

    if (err instanceof TelegramError) {
      console.error('Error in request:', err.description);
    } else if (err instanceof HTTPError) {
      console.error('Could not contact Telegram:', err);
    } else {
      console.error('Unknown error:', err);
    }
  });

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));

  logger.info('Starting bot.');

  await bot.launch();
};

main();
