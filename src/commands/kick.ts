import { Middleware } from 'telegraf';
import { User } from 'telegraf/types';
import { BotContext } from '../context.js';
import { createMemberMention } from '../member.js';

export const cmdKick: Middleware<BotContext> = async (ctx) => {
  const i18n = ctx.i18n;

  if (!ctx.chat) {
    return ctx.replyWithAutoDestructiveMessage(
      i18n.t('errors', 'kickOutOfChat', {
        mention: ctx.safeUser.mention,
      })
    );
  }

  const hasAdminAccess = await ctx.checkAdminAccess();

  if (!hasAdminAccess) {
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
    await ctx.telegram.banChatMember(
      ctx.chat.id,
      mentionedUser.id,
      undefined,
      {
        revoke_messages: true,
      }
    );

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
