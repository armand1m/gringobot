import { Middleware } from 'telegraf';
import { BotContext } from '../context.js';
import { createMemberMention } from '../member.js';
import { getRandomValues } from '../utils/getRandomCollection.js';

export const cmdPingAdmins: Middleware<BotContext> = async (ctx) => {
  const admins = await ctx.getChatAdministrators();
  const fiveAdmins = getRandomValues(admins, 5);

  return ctx.replyWithMarkdown(
    fiveAdmins.map(({ user }) => createMemberMention(user)).join(', ')
  );
};
