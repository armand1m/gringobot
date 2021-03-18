import { Alpha2Code } from 'i18n-iso-countries';
import { Middleware } from 'telegraf';
import { BotContext } from '../context';
import { getCountryNameForCountryCode } from '../countries';

export const cmdListCountryMemberCount: Middleware<BotContext> = async (
  ctx
) => {
  const locationIndex = ctx.database.getLocationIndex();
  const locationCount = Object.keys(locationIndex).map((key) => {
    const countryCode = key as Alpha2Code;
    const countryName = getCountryNameForCountryCode(countryCode);
    const count = locationIndex[countryCode]?.length || 0;

    return `${countryName}: ${count}`;
  });

  return ctx.replyWithMarkdown(locationCount.join('\n'));
};
