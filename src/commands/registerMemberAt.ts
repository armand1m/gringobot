import { Middleware } from 'telegraf';
import { BotContext } from '../context';
import { Country } from '../countries';

export const cmdRegisterMemberAt: Middleware<BotContext> = async (
  ctx
) => {
  const i18n = ctx.i18n;
  const userId = ctx.from?.id;
  const database = ctx.database;
  const country = Country.Netherlands;

  if (!userId) {
    return ctx.reply(i18n.t('errors.failedToIdentifyUser'));
  }

  if (database.hasMemberRegistered(userId, country)) {
    return ctx.reply(i18n.t('errors.memberAlreadyRegistered'));
  }

  await database.addMemberLocation(userId, country);

  return ctx.reply(
    i18n.t('location.memberRegisteredAtLocation', {
      country,
    })
  );
};
