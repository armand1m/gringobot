import { Alpha2Code } from 'i18n-iso-countries';
import { BotContext } from '../context';
import { getCountryCodeForText } from '../countries';

interface CountryValidation {
  countryCode: Alpha2Code | null;
  error: string | null;
}

export const validateCountry = (
  countryName: string,
  ctx: BotContext
): CountryValidation => {
  const i18n = ctx.i18n;
  if (!countryName) {
    const errorMessage = i18n.t('errors', 'noCountryProvided', {
      mention: ctx.safeUser.mention,
    });
    return { countryCode: null, error: errorMessage };
  }

  const countryCode = getCountryCodeForText(
    countryName,
    ctx.groupLanguage
  );

  if (!countryCode) {
    const errorMessage = i18n.t('errors', 'failedToIdentifyCountry', {
      mention: ctx.safeUser.mention,
      countryName: countryName,
    });
    return {
      countryCode: null,
      error: errorMessage,
    };
  }

  return { countryCode: countryCode, error: null };
};
