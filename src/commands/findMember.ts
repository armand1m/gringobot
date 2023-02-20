import { Middleware } from 'telegraf';
import { BotContext } from '../context';
import { getCountryNameForCountryCode } from '../countries';

export const cmdFindMember: Middleware<BotContext> = async (ctx) => {
  const i18n = ctx.i18n;
  const locations = await ctx.database.findMember(ctx.safeUser.id);

  const message =
    locations.length === 0
      ? i18n.t('location', 'memberNotFoundAnywhere', {
          mention: ctx.safeUser.mention,
        })
      : i18n.t('location', 'foundMemberAt', {
          mention: ctx.safeUser.mention,
          locations: locations
            .map((location) =>
              getCountryNameForCountryCode(
                location,
                ctx.groupLanguage
              )
            )
            .join(', '),
        });

  return ctx.replyWithAutoDestructiveMessage(message);
};
