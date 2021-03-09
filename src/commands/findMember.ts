import { Middleware } from 'telegraf';
import { BotContext } from '../context';
import { getCountryNameForCountryCode } from '../countries';

export const cmdFindMember: Middleware<BotContext> = async (ctx) => {
  const i18n = ctx.i18n;
  const userId = ctx.from?.id;

  if (!userId) {
    return ctx.reply(i18n.t('errors.failedToIdentifyUser'));
  }

  const locations = await ctx.database.findMember(userId);

  const message =
    locations.length === 0
      ? i18n.t('location.memberNotFoundAnywhere')
      : i18n.t('location.foundMemberAt', {
          locations: locations
            .map(getCountryNameForCountryCode)
            .join(', '),
        });

  return ctx.reply(message);
};
