import { Alpha2Code } from 'i18n-iso-countries';
import { Middleware } from 'telegraf';
import { countryCodeEmoji } from 'country-code-emoji';
import { BotContext } from '../context';
import { getCountryNameForCountryCode } from '../countries';

export const cmdListCountryMemberCount: Middleware<BotContext> = async (
  ctx
) => {
  const i18n = ctx.i18n;

  const locationIndex = ctx.database.getLocationIndex();
  const locations = Object.entries(locationIndex).filter(
    ([, userIds]) => {
      return userIds !== undefined && userIds.length > 0;
    }
  ) as [Alpha2Code, number[]][];

  const locationCount = locations
    .map(([countryCode, userIds]) => {
      const countryName = getCountryNameForCountryCode(
        countryCode,
        ctx.groupLanguage
      );
      const countryFlagEmoji = countryCodeEmoji(countryCode);
      const count = userIds.length;

      return `${countryFlagEmoji} ${countryName}: ${count}`;
    })
    .sort((a, b) => a.localeCompare(b));

  const totalCount = locations.reduce((prev, [, userIds]) => {
    return prev + userIds.length;
  }, 0);

  if (locationCount.length === 0) {
    return ctx.replyWithAutoDestructiveMessage(
      i18n.t('listing', 'noMembers', {
        mention: ctx.safeUser.mention,
      })
    );
  }

  return ctx.replyWithMarkdown(
    [...locationCount, `\nTotal: ${totalCount}`].join('\n')
  );
};
