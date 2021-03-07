import { Telegraf, Context } from 'telegraf';
import { Command } from './command';
import { loadConfiguration } from './config';
import { Country } from './countries';
import { createDatabase, DatabaseInstance } from './database';
import { createLogger } from './logger';

interface BotContext extends Context {
  database: DatabaseInstance;
}
const main = async () => {
  const config = await loadConfiguration();
  const logger = createLogger(config.environment);
  const databaseLogger = logger.child({ source: 'database' });
  const bot = new Telegraf<BotContext>(config.botToken);

  bot.use(async (ctx, next) => {
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

    return next();
  });

  bot.command(Command.PingMembersAt, async (ctx) => {
    const chatId = ctx.chat.id;
    const database = ctx.database;
    const country = Country.Netherlands;
    const memberIds = database.getMembersAt(country);
    const members = await Promise.all(
      memberIds.map(async (userId) => {
        const member = await bot.telegram.getChatMember(
          chatId,
          userId
        );
        return '@' + member.user.username;
      })
    );

    const message =
      members.length === 0
        ? 'There are no members registered in this location.'
        : `These members are registered in the location you're interested in: ${members.join(
            ', '
          )}`;

    ctx.reply(message);
  });

  bot.command(Command.RegisterMemberAt, async (ctx) => {
    const userId = ctx.from.id;
    const database = ctx.database;
    const country = Country.Netherlands;

    /**
     * TODO: Only add member if he is not added yet.
     * If the member is registered in another location,
     * throw an error and let the user know he needs to deregister
     * first and then register to the new one.
     */
    database.addMemberLocation(userId, country);

    ctx.reply(
      `Your location is registered at ${country}. You'll be mentioned whenever folks ask about this location.`
    );
  });

  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));

  await bot.launch();

  logger.info('Bot is running.');
};

main();
