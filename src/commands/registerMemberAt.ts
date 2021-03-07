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

  /**
   * TODO: Only add member if he is not added yet.
   * If the member is registered in another location,
   * throw an error and let the user know he needs to deregister
   * first and then register to the new one.
   */
  database.addMemberLocation(userId, country);

  return ctx.reply(
    i18n.t('location.memberRegisteredAtLocation', {
      country,
    })
  );
};
