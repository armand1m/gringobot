import { Middleware } from 'telegraf';
import { BotContext } from '../context';

export const cmdKick: Middleware<BotContext> = async (ctx) => {
  const i18n = ctx.i18n;

  if (!ctx.chat) {
    return ctx.replyWithAutoDestructiveMessage(
      i18n.t('errors:kickOutOfChat')
    );
  }

  const chatId = ctx.chat.id;
  const userId = ctx.safeUser.id;

  const member = await ctx.telegram.getChatMember(chatId, userId);

  const isGroupCreator = member.status === 'creator';
  const canRestrictMembers = member.can_restrict_members;
  const canKickUsers = isGroupCreator || canRestrictMembers;

  if (!member || !canKickUsers) {
    return ctx.replyWithAutoDestructiveMessage(
      i18n.t('mustBeAdminToUseCommand')
    );
  }

  // Check if a user was mentioned in the message
  // @ts-ignore
  const mentionedUser =
    ctx.message?.reply_to_message?.from ??
    ctx.message?.entities?.[0]?.user;

  if (!mentionedUser) {
    return ctx.replyWithAutoDestructiveMessage(
      i18n.t('errors:mentionUserToKick')
    );
  }

  try {
    await ctx.telegram.kickChatMember(ctx.chat.id, mentionedUser.id);

    const userGotKickedMessage = `User ${mentionedUser.username} has been kicked from the group.`;

    ctx.logger.info(userGotKickedMessage);

    return ctx.reply(
      i18n.t('kick:userGotKicked', {
        kickedUser: mentionedUser.username,
      })
    );
  } catch (err) {
    ctx.logger.error(err);
    return ctx.reply(i18n.t('errors:failedToKickUser'));
  }
};
