import { Alpha2Code } from 'i18n-iso-countries';
import { Middleware } from 'telegraf';
import { BotContext } from '../context';
import { getCountryNameForCountryCode } from '../countries';

export const cmdRankCountryMemberCount: Middleware<BotContext> = async (
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

      return { countryName, count };
    })
    .sort((a, b) => {
      const c = b.count - a.count;
      if (c) return c;
      if (a.countryName && b.countryName)
        return a.countryName.localeCompare(b.countryName);
      return 0;
    });

  if (locationCount.length == 0) {
    return ctx.replyWithAutoDestructiveMessage(
      i18n.t('listing.noMembers', {
        mention: ctx.safeUser.mention,
      })
    );
  }

  const counts = locationCount.map((lc) => lc.count);

  // Standard competition ranking ("1224" ranking)
  const locationCountRank = locationCount.map((countryAndCounts) => {
    const { countryName, count } = countryAndCounts;
    const rank = counts.indexOf(count) + 1;
    return `${rank}. ${countryName}: ${count}`;
  });

  return ctx.replyWithMarkdown(locationCountRank.join('\n'));
};
