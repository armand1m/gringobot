import got from 'got';
import { Middleware } from 'telegraf';
import { BotContext } from '../context';

export const cmdHelp: Middleware<BotContext> = async (ctx) => {
  const [section, topic] = (ctx.command.args || '').trim().split(' ');

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
};
