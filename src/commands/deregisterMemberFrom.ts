import { Middleware } from 'telegraf';
import { BotContext } from '../context';
import {
  getCountryCodeForText,
  getCountryNameForCountryCode,
} from '../countries';

export const cmdDeregisterMemberFrom: Middleware<BotContext> = async (
  ctx
) => {
  const i18n = ctx.i18n;
  const unsafeCountryName = ctx.command.args;

  if (!unsafeCountryName) {
    return ctx.reply(i18n.t('errors.noCountryProvided'));
  }

  const countryCode = getCountryCodeForText(unsafeCountryName);

  if (!countryCode) {
    return ctx.reply(
      i18n.t('errors.failedToIdentifyCountry', {
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
