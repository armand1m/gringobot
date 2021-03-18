import { Middleware } from 'telegraf';
import { markdown } from 'telegram-format';
import { BotContext } from '../context';
import {
  getCountryCodeForText,
  getCountryNameForCountryCode,
} from '../countries';
import { createMemberMention } from '../member';

export const cmdFindMembersAt: Middleware<BotContext> = async (
  ctx
) => {
  const i18n = ctx.i18n;
  const unsafeCountryName = markdown.escape(ctx.command.args ?? '');

  if (!unsafeCountryName) {
    return ctx.replyWithMarkdown(
      i18n.t('errors.noCountryProvided', {
        mention: ctx.safeUser.mention,
      })
    );
  }

  const countryCode = getCountryCodeForText(unsafeCountryName);

  if (!countryCode) {
    return ctx.replyWithMarkdown(
      i18n.t('errors.failedToIdentifyCountry', {
        mention: ctx.safeUser.mention,
        countryName: unsafeCountryName,
      })
    );
  }

  const memberIds = ctx.database.getMembersAt(countryCode);
  const members = await Promise.all(
    memberIds.map(async (userId) => {
      const member = await ctx.getChatMember(userId);
      return createMemberMention(member.user, true);
    })
  );

  const message =
    members.length === 0
      ? i18n.t('location.noMembersAtLocation', {
          mention: ctx.safeUser.mention,
          country: getCountryNameForCountryCode(countryCode),
        })
      : i18n.t('location.membersAtLocation', {
          mention: ctx.safeUser.mention,
          members: members.join(', '),
          country: getCountryNameForCountryCode(countryCode),
        });

  return ctx.replyWithMarkdown(message);
};
