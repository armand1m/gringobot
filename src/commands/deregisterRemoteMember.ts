import { Middleware } from 'telegraf';
import { BotContext } from '../context';

export const cmdDeregisterRemoteMember: Middleware<BotContext> = async (
  ctx
) => {
  const i18n = ctx.i18n;

  await ctx.database.removeRemoteMember(ctx.safeUser.id);

  return ctx.replyWithAutoDestructiveMessage(
    i18n.t('remote.memberDeregistered', {
      mention: ctx.safeUser.mention,
    })
  );
};
