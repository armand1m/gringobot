import { Alpha2Code } from 'i18n-iso-countries';
import { markdown } from 'telegram-format';
import { Middleware } from 'telegraf';
import { countryCodeEmoji } from 'country-code-emoji';
import { BotContext } from '../context';
import { getCountryCodeForText, getCountryNameForCountryCode } from '../countries';

export const cmdRankCountryRemoteMemberCount: Middleware<BotContext> = async (ctx) => {
  const i18n = ctx.i18n;

  const unsafeBaseCountryCode = markdown.escape(ctx.command.args ?? '').trim();

  if (!unsafeBaseCountryCode) {
    return ctx.replyWithAutoDestructiveMessage(
      i18n.t('errors.noCountryProvided', {
        mention: ctx.safeUser.mention,
      })
    );
  }

  const countryCode = getCountryCodeForText(unsafeBaseCountryCode);

  if (!countryCode) {
    return ctx.replyWithAutoDestructiveMessage(
      i18n.t('errors.failedToIdentifyCountry', {
        mention: ctx.safeUser.mention,
        countryName: unsafeBaseCountryCode,
      })
    );
  }

  const remoteMembersFromCountry = ctx.database.getRemoteMembersFrom(countryCode);
  let totalCount = 0;
  const rankMap = {} as {
    [key in Alpha2Code]: { count: number; countryName?: string; countryFlagEmoji: string };
  };

  for (const [_, record] of Object.entries(remoteMembersFromCountry)) {
    totalCount += 1;
    if (record) {
      const { to } = record;
      if (rankMap[to]) {
        rankMap[to].count += 1;
      } else {
        rankMap[to] = {
          count: 1,
          countryName: getCountryNameForCountryCode(to),
          countryFlagEmoji: countryCodeEmoji(to),
        };
      }
    }
  }

  if (totalCount == 0) {
    return ctx.replyWithAutoDestructiveMessage(
      i18n.t('listing.noMembers', {
        mention: ctx.safeUser.mention,
      })
    );
  }

  const sortedRank = Object.entries(rankMap).sort(([, a], [, b]) => {
    const c = b.count - a.count;
    if (c) return c;
    if (a.countryName && b.countryName) return a.countryName.localeCompare(b.countryName);
    return 0;
  });

  // Standard competition ranking ("1224" ranking)
  const sortedRankOutput = sortedRank.map(([, countryAndCounts], i) => {
    const { countryName, countryFlagEmoji, count } = countryAndCounts;
    return `${i + 1}. ${countryFlagEmoji} ${countryName}: ${count}`;
  });

  return ctx.replyWithMarkdown([...sortedRankOutput, `\nTotal: ${totalCount}`].join('\n'));
};
