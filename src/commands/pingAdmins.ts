import { Middleware } from 'telegraf';
import { BotContext } from '../context';
import { createMemberMention } from '../member';
import { getRandomValues } from '../utils/getRandomCollection';

export const cmdPingAdmins: Middleware<BotContext> = async (ctx) => {
  const admins = await ctx.getChatAdministrators();
  const fiveAdmins = getRandomValues(admins, 5);

  return ctx.replyWithMarkdown(
    fiveAdmins.map(({ user }) => createMemberMention(user)).join(', ')
  );
};
