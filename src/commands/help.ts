import got from 'got';
import { Middleware } from 'telegraf';
import { BotContext } from '../context';

export const cmdHelp: Middleware<BotContext> = async (ctx) => {
  const [section, topic] = (ctx.command.args || '').trim().split(' ');

  try {
    if (!section) {
      const { body } = await got(
        `https://raw.githubusercontent.com/armand1m/gringobot/main/content/sections.md`
      );

      return ctx.replyWithMarkdown(body);
    }

    if (!topic) {
      const { body } = await got(
        `https://raw.githubusercontent.com/armand1m/gringobot/main/content/${section}/topics.md`
      );
      return ctx.replyWithMarkdown(body);
    }

    const { body } = await got(
      `https://raw.githubusercontent.com/armand1m/gringobot/main/content/${section}/${topic}.md`
    );

    return ctx.replyWithMarkdown(body);
  } catch (err) {
    const i18n = ctx.i18n;
    return ctx.reply(i18n.t('errors.failedToFetchContent'));
  }
};
