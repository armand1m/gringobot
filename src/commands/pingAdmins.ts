import { Middleware } from 'telegraf';
import { BotContext } from '../context';

export const cmdPingAdmins: Middleware<BotContext> = async (ctx) => {
  const admins = await ctx.getChatAdministrators();

  return ctx.reply(
    admins.map((admin) => '@' + admin.user.username).join(', ')
  );
};
