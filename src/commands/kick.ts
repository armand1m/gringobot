import { Middleware } from 'telegraf';
import { User } from 'typegram';
import { BotContext } from '../context';
import { createMemberMention } from '../member';

export const cmdKick: Middleware<BotContext> = async (ctx) => {
  const i18n = ctx.i18n;

  if (!ctx.chat) {
    return ctx.replyWithAutoDestructiveMessage(
      i18n.t('errors', 'kickOutOfChat', {
        mention: ctx.safeUser.mention,
      })
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
      i18n.t('errors', 'mustBeAdminToUseCommand', {
        mention: ctx.safeUser.mention,
      })
    );
  }

  const mentionedUser: User =
    // @ts-ignore
    ctx.message?.reply_to_message?.from ??
    // @ts-ignore
    ctx.message?.entities?.[0]?.user;

  if (!mentionedUser) {
    return ctx.replyWithAutoDestructiveMessage(
      i18n.t('errors', 'mentionUserToKick', {
        mention: ctx.safeUser.mention,
      })
    );
  }

  try {
    await ctx.telegram.kickChatMember(ctx.chat.id, mentionedUser.id);

    const userGotKickedMessage = `User ${mentionedUser.username} has been kicked from the group.`;

    ctx.logger.info(userGotKickedMessage);

    return ctx.replyWithMarkdown(
      i18n.t('kick', 'userGotKicked', {
        mention: ctx.safeUser.mention,
        kickedUser: createMemberMention(mentionedUser, false),
      })
    );
  } catch (err) {
    ctx.logger.error(err as string);
    return ctx.replyWithMarkdown(
      i18n.t('errors', 'failedToKickUser', {
        mention: ctx.safeUser.mention,
        kickedUser: createMemberMention(mentionedUser, false),
      })
    );
  }
};
