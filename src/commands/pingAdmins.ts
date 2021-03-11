import { Middleware } from 'telegraf';
import { BotContext } from '../context';
import { createMemberMention } from '../member';

export const cmdPingAdmins: Middleware<BotContext> = async (ctx) => {
  const admins = await ctx.getChatAdministrators();

  return ctx.replyWithMarkdown(
    admins.map(({ user }) => createMemberMention(user)).join(', ')
  );
};
