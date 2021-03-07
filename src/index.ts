import path from 'path';
import { Telegraf, Context } from 'telegraf';
import TelegrafI18n from 'telegraf-i18n';
import { Command } from './command';
import { loadConfiguration } from './config';
import { Country } from './countries';
import { createDatabase, DatabaseInstance } from './database';
import { createLogger } from './logger';

interface BotContext extends Context {
  database: DatabaseInstance;
  i18n: TelegrafI18n;
}

const main = async () => {
  const config = await loadConfiguration();
  const logger = createLogger(config.environment);
  const databaseLogger = logger.child({ source: 'database' });
  const bot = new Telegraf<BotContext>(config.botToken);

  const i18n = new TelegrafI18n({
    defaultLanguage: 'pt_BR',
    allowMissing: false, // Default true
    directory: path.resolve(process.cwd(), config.localesPath),
  });

  bot.use(i18n.middleware());

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
    const i18n = ctx.i18n;
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
        ? i18n.t('location.noMembersAtLocation')
        : i18n.t('location.membersAtLocation', {
            members: members.join(', '),
          });

    ctx.reply(message);
  });

  bot.command(Command.RegisterMemberAt, async (ctx) => {
    const i18n = ctx.i18n;
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
      i18n.t('location.memberRegisteredAtLocation', {
        country,
      })
    );
  });

  bot.command(Command.PingAdmins, async (ctx) => {
    const chatId = ctx.chat.id;
    const admins = await bot.telegram.getChatAdministrators(chatId);

    ctx.reply(
      admins.map((admin) => '@' + admin.user.username).join(', ')
    );
  });

  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));

  await bot.launch();

  logger.info('Bot is running.');
};

main();
