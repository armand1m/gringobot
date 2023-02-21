import { MiddlewareFn } from 'telegraf';
import { markdown } from 'telegram-format';
import { BotContext } from '../context.js';
import {
  getCountryCodeForText,
  getCountryNameForCountryCode,
} from '../countries.js';
import { cmdPingRemote } from './pingRemote.js';

export const cmdPingMembersAt: MiddlewareFn<BotContext> = async (
  ctx,
  next
) => {
  const i18n = ctx.i18n;
  const unsafeCountryName = markdown
    .escape(ctx.command.args ?? '')
    .trim();

  if (unsafeCountryName.toLowerCase() === 'remote') {
    return cmdPingRemote(ctx, next);
  }

  if (!unsafeCountryName) {
    return ctx.replyWithAutoDestructiveMessage(
      i18n.t('errors', 'noCountryProvided', {
        mention: ctx.safeUser.mention,
      })
    );
  }

  const countryCode = getCountryCodeForText(
    unsafeCountryName,
    ctx.groupLanguage
  );

  if (!countryCode) {
    return ctx.replyWithAutoDestructiveMessage(
      i18n.t('errors', 'failedToIdentifyCountry', {
        mention: ctx.safeUser.mention,
        countryName: unsafeCountryName,
      })
    );
  }

  const members = await ctx.fetchMembersMentionList(countryCode);
  const silencedMembers = await ctx.fetchMembersMentionList(
    countryCode,
    true
  );
  const hasNoMembers = members.length === 0;
  const hasLessThanFiveMembers = members.length < 5;

  const getMessage = () => {
    if (hasNoMembers) {
      return i18n.t('location', 'noMembersAtLocation', {
        mention: ctx.safeUser.mention,
        countryName: getCountryNameForCountryCode(
          countryCode,
          ctx.groupLanguage
        ),
      });
    }

    if (hasLessThanFiveMembers) {
      return i18n.t('location', 'membersAtLocation', {
        mention: ctx.safeUser.mention,
        members: members.join(', '),
        countryName: getCountryNameForCountryCode(
          countryCode,
          ctx.groupLanguage
        ),
      });
    }

    return i18n.t('location', 'randomFiveMembersAtLocation', {
      mention: ctx.safeUser.mention,
      members: ctx.getRandomValues(members, 5).join(', '),
      silencedMembers: silencedMembers.join(', '),
      countryName: getCountryNameForCountryCode(
        countryCode,
        ctx.groupLanguage
      ),
    });
  };

  return ctx.replyWithAutoDestructiveMessage(getMessage(), {
    deleteReplyMessage: hasNoMembers,
    deleteCommandMessage: hasNoMembers,
  });
};
