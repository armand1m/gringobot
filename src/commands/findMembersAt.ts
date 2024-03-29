import { MiddlewareFn } from 'telegraf';
import { markdown } from 'telegram-format';
import { BotContext } from '../context.js';
import {
  getCountryCodeForText,
  getCountryNameForCountryCode,
} from '../countries.js';

export const cmdFindMembersAt: MiddlewareFn<BotContext> = async (
  ctx
) => {
  const i18n = ctx.i18n;
  const unsafeCountryName = markdown
    .escape(ctx.userCommand.args ?? '')
    .trim();

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

  const members = await ctx.fetchMembersMentionList(
    countryCode,
    true
  );
  const hasNoMembers = members.length === 0;

  const message = hasNoMembers
    ? i18n.t('location', 'noMembersAtLocation', {
        mention: ctx.safeUser.mention,
        countryName: getCountryNameForCountryCode(
          countryCode,
          ctx.groupLanguage
        ),
      })
    : i18n.t('location', 'membersAtLocation', {
        mention: ctx.safeUser.mention,
        members: members.join(', '),
        countryName: getCountryNameForCountryCode(
          countryCode,
          ctx.groupLanguage
        ),
      });

  return ctx.replyWithAutoDestructiveMessage(message, {
    deleteReplyMessage: hasNoMembers,
    deleteCommandMessage: hasNoMembers,
  });
};
