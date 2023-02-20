import got from 'got';
import { Middleware } from 'telegraf';
import { markdown } from 'telegram-format';
import { BotContext } from '../context';

const getContentUrl = (section?: string, topic?: string) => {
  if (!section) {
    return `https://raw.githubusercontent.com/armand1m/gringobot/main/content/sections.md`;
  }

  if (!topic) {
    return `https://raw.githubusercontent.com/armand1m/gringobot/main/content/${section}/topics.md`;
  }

  return `https://raw.githubusercontent.com/armand1m/gringobot/main/content/${section}/${topic}.md`;
};

export const cmdHelp: Middleware<BotContext> = async (ctx) => {
  const [section, topic] = markdown
    .escape(ctx.command.args ?? '')
    .trim()
    .split(' ');

  try {
    const { body } = await got(getContentUrl(section, topic));
    return ctx.replyWithMarkdown(body);
  } catch (err) {
    return ctx.replyWithMarkdown(
      ctx.i18n.t('errors', 'failedToFetchContent', {
        mention: ctx.safeUser.mention,
      })
    );
  }
};
