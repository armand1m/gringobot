import { Middleware } from 'telegraf';
import { BotContext } from '../context';
import { getCountryCodeForText } from '../countries';

export const cmdRegisterMemberAt: Middleware<BotContext> = async (
  ctx
) => {
  const i18n = ctx.i18n;
  const userId = ctx.from?.id;

  if (!userId) {
    return ctx.reply(i18n.t('errors.failedToIdentifyUser'));
  }

  const database = ctx.database;
  const unsafeCountryName = ctx.command.args;

  if (!unsafeCountryName) {
    return ctx.reply(i18n.t('errors.noCountryProvided'));
  }

  const country = getCountryCodeForText(unsafeCountryName);

  if (!country) {
    return ctx.reply(
      i18n.t('errors.failedToIdentifyCountry', {
        countryName: unsafeCountryName,
      })
    );
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
