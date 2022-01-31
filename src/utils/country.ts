import { BotContext } from '../context';
import { getCountryCodeForText } from '../countries';

export const validateCountry = (
  countryName: string,
  ctx: BotContext
) => {
  const i18n = ctx.i18n;
  if (!countryName) {
    return ctx.replyWithAutoDestructiveMessage(
      i18n.t('errors.noCountryProvided', {
        mention: ctx.safeUser.mention,
      })
    );
  }

  const countryCode = getCountryCodeForText(countryName);

  if (!countryCode) {
    return ctx.replyWithAutoDestructiveMessage(
      i18n.t('errors.failedToIdentifyCountry', {
        mention: ctx.safeUser.mention,
        countryName: countryName,
      })
    );
  }

  return countryCode;
};
