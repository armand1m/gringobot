import { Middleware } from 'telegraf';
import { BotContext } from '../context';

export const cmdPingRemote: Middleware<BotContext> = async (ctx) => {
  const i18n = ctx.i18n;
  const remoteMembers = await ctx.fetchRemoteMembersMentionList();
  const hasNoMembers = remoteMembers.length === 0;

  const message = hasNoMembers
    ? i18n.t('remote.noMembers', {
        mention: ctx.safeUser.mention,
      })
    : i18n.t('remote.members', {
        mention: ctx.safeUser.mention,
        members: remoteMembers.join(', '),
      });

  return ctx.replyWithAutoDestructiveMessage(message, {
    deleteReplyMessage: hasNoMembers,
    deleteCommandMessage: hasNoMembers,
  });
};
