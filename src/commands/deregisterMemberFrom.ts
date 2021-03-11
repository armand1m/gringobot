import { Middleware } from 'telegraf';
import { markdown } from 'telegram-format';
import { BotContext } from '../context';
import {
  getCountryCodeForText,
  getCountryNameForCountryCode,
} from '../countries';

export const cmdDeregisterMemberFrom: Middleware<BotContext> = async (
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

  await ctx.database.removeMemberFrom(ctx.safeUser.id, countryCode);

  return ctx.replyWithMarkdown(
    i18n.t('location.memberDeregisteredFromLocation', {
      mention: ctx.safeUser.mention,
      country: getCountryNameForCountryCode(countryCode),
    })
  );
};
