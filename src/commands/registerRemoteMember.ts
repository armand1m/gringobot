import { Middleware } from 'telegraf';
import { markdown } from 'telegram-format';
import { BotContext } from '../context';
import { getCountryNameForCountryCode } from '../countries';
import { validateCountry } from '../utils/country';

export const cmdRegisterRemoteMember: Middleware<BotContext> = async (
  ctx
) => {
  const i18n = ctx.i18n;
  const countries = markdown
    .escape(ctx.command.args ?? '')
    .trim()
    .split(' ');

  const countryCodeFrom = validateCountry(countries[0], ctx);
  const countryCodeTo = validateCountry(countries[1], ctx);

  if (!countryCodeFrom.countryCode || !countryCodeTo.countryCode) {
    const errorMessages = [countryCodeFrom.error, countryCodeTo.error]
      .filter((value) => {
        return value !== null;
      })
      .join(' ');
    return ctx.replyWithAutoDestructiveMessage(errorMessages);
  }

  const database = ctx.database;
  const userId = ctx.safeUser.id;

  if (database.hasRemoteMemberRegistered(userId)) {
    return ctx.replyWithAutoDestructiveMessage(
      i18n.t('errors.memberAlreadyRegistered', {
        mention: ctx.safeUser.mention,
      })
    );
  }

  await database.addRemoteMember(
    userId,
    countryCodeFrom.countryCode,
    countryCodeTo.countryCode
  );

  return ctx.replyWithAutoDestructiveMessage(
    i18n.t('remote.remoteMemberRegistered', {
      mention: ctx.safeUser.mention,
      countryTo: getCountryNameForCountryCode(
        countryCodeTo.countryCode
      ),
      countryFrom: getCountryNameForCountryCode(
        countryCodeFrom.countryCode
      ),
    })
  );
};
