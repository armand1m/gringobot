import { Middleware } from 'telegraf';
import { markdown } from 'telegram-format';
import { BotContext } from '../context';
import {
  getCountryCodeForText,
  getCountryNameForCountryCode,
} from '../countries';

export const cmdPingMemberAt: Middleware<BotContext> = async (
  ctx
) => {
  const i18n = ctx.i18n;
  const unsafeCountryName = markdown.escape(ctx.command.args ?? '');

  if (!unsafeCountryName) {
    return ctx.replyWithAutoDestructiveMessage(
      i18n.t('errors.noCountryProvided', {
        mention: ctx.safeUser.mention,
      })
    );
  }

  const countryCode = getCountryCodeForText(unsafeCountryName);

  if (!countryCode) {
    return ctx.replyWithAutoDestructiveMessage(
      i18n.t('errors.failedToIdentifyCountry', {
        mention: ctx.safeUser.mention,
        countryName: unsafeCountryName,
      })
    );
  }

  const members = await ctx.fetchMembersMentionList(countryCode);
  const hasNoMembers = members.length === 0;

  const message = hasNoMembers
    ? i18n.t('location.noMembersAtLocation', {
        mention: ctx.safeUser.mention,
        country: getCountryNameForCountryCode(countryCode),
      })
    : i18n.t('location.membersAtLocation', {
        mention: ctx.safeUser.mention,
        members: members.join(', '),
        country: getCountryNameForCountryCode(countryCode),
      });

  return ctx.replyWithAutoDestructiveMessage(message, {
    deleteReplyMessage: hasNoMembers,
    deleteCommandMessage: hasNoMembers,
  });
};
