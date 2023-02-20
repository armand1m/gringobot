import { MiddlewareFn } from 'telegraf';
import { BotContext } from '../context.js';
import { createMemberMention } from '../member.js';

export const cmdPingAdmins: MiddlewareFn<BotContext> = async (
  ctx
) => {
  const admins = await ctx.getChatAdministrators();
  const fiveAdmins = ctx.getRandomValues(admins, 5);

  return ctx.replyWithMarkdown(
    fiveAdmins.map(({ user }) => createMemberMention(user)).join(', ')
  );
};
