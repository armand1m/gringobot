import { Alpha2Code } from 'i18n-iso-countries';
import { Middleware } from 'telegraf';
import { countryCodeEmoji } from 'country-code-emoji';
import { BotContext } from '../context';
import { getCountryNameForCountryCode } from '../countries';

export const cmdRankCountryMemberCount: Middleware<BotContext> = async (
  ctx
) => {
  const i18n = ctx.i18n;

  const locationIndex = ctx.database.getLocationIndex();

  const locations = Object.entries(locationIndex).filter(
    ([, userIds]) => {
      return userIds !== undefined && userIds.length > 0;
    }
  ) as [Alpha2Code, number[]][];

  const totalCount = locations.reduce((prev, [, userIds]) => {
    return prev + userIds.length;
  }, 0);

  const locationCount = locations
    .map(([countryCode, userIds]) => {
      const countryName = getCountryNameForCountryCode(countryCode);
      const countryFlagEmoji = countryCodeEmoji(countryCode);
      const count = userIds.length;

      return { countryName, countryFlagEmoji, count };
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
      i18n.t('listing', 'noMembers', {
        mention: ctx.safeUser.mention,
      })
    );
  }

  const counts = locationCount.map((lc) => lc.count);

  // Standard competition ranking ("1224" ranking)
  const locationCountRank = locationCount.map((countryAndCounts) => {
    const { countryName, countryFlagEmoji, count } = countryAndCounts;
    const rank = counts.indexOf(count) + 1;
    return `${rank}. ${countryFlagEmoji} ${countryName}: ${count}`;
  });

  return ctx.replyWithMarkdown(
    [...locationCountRank, `\nTotal: ${totalCount}`].join('\n')
  );
};
