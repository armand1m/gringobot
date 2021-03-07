import { Telegraf } from 'telegraf';
import { InlineQueryResult } from 'typegram';
import { loadConfiguration } from './config';
import { createLogger } from './logger';

const main = async () => {
  const config = await loadConfiguration();
  const logger = createLogger(config.environment);
  const bot = new Telegraf(config.botToken);

  bot.command('quit', (ctx) => {
    // Explicit usage
    ctx.telegram.leaveChat(ctx.message.chat.id);

    // Using context shortcut
    ctx.leaveChat();
  });

  bot.on('text', (ctx) => {
    // Explicit usage
    ctx.telegram.sendMessage(
      ctx.message.chat.id,
      `Hello ${ctx.state.role}`
    );

    // Using context shortcut
    ctx.reply(`Hello ${ctx.state.role}`);
  });

  bot.on('callback_query', (ctx) => {
    // Explicit usage
    ctx.telegram.answerCbQuery(ctx.callbackQuery.id);

    // Using context shortcut
    ctx.answerCbQuery();
  });

  bot.on('inline_query', (ctx) => {
    const result: InlineQueryResult[] = [];

    // Explicit usage
    ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result);

    // Using context shortcut
    ctx.answerInlineQuery(result);
  });

  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));

  await bot.launch();

  logger.info('Bot is running.');
};

main();
