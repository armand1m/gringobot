import { Alpha2Code } from 'i18n-iso-countries';
import { Middleware } from 'telegraf';
import { BotContext } from '../context';
import { getCountryNameForCountryCode } from '../countries';

export const cmdListCountryMemberCount: Middleware<BotContext> = async (
  ctx
) => {
  const i18n = ctx.i18n;

  const locationIndex = ctx.database.getLocationIndex();
  const locationCount = Object.entries(locationIndex)
    .filter(([, value]) => {
      return value !== undefined && value.length > 0;
    })
    .map(([key, value]) => {
      const countryCode = key as Alpha2Code;
      const countryName = getCountryNameForCountryCode(countryCode);
      const count = value?.length || 0;

      return `${countryName}: ${count}`;
    })
    .sort((a, b) => a.localeCompare(b));

  if (locationCount.length === 0)
    return ctx.replyWithMarkdown(
      i18n.t('listing.noMembers', {
        mention: ctx.safeUser.mention,
      })
    );

  return ctx.replyWithMarkdown(locationCount.join('\n'));
};
