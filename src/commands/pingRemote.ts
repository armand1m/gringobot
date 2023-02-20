import { MiddlewareFn } from 'telegraf';
import { BotContext } from '../context.js';

export const cmdPingRemote: MiddlewareFn<BotContext> = async (
  ctx
) => {
  const i18n = ctx.i18n;
  const remoteMembers = await ctx.fetchRemoteMembersMentionList();
  const silencedRemoteMembers = await ctx.fetchRemoteMembersMentionList(
    true
  );

  const hasNoMembers = remoteMembers.length === 0;
  const hasLessThanFiveMembers = remoteMembers.length < 5;

  const getMessage = () => {
    if (hasNoMembers) {
      return i18n.t('remote', 'noMembers', {
        mention: ctx.safeUser.mention,
      });
    }

    if (hasLessThanFiveMembers) {
      return i18n.t('remote', 'members', {
        mention: ctx.safeUser.mention,
        members: remoteMembers.join(', '),
      });
    }

    return i18n.t('remote', 'randomFiveMembersAtLocation', {
      mention: ctx.safeUser.mention,
      members: ctx.getRandomValues(remoteMembers, 5).join(', '),
      silencedMembers: silencedRemoteMembers.join(', '),
    });
  };

  return ctx.replyWithAutoDestructiveMessage(getMessage(), {
    deleteReplyMessage: hasNoMembers,
    deleteCommandMessage: hasNoMembers,
  });
};
