import { Middleware } from 'telegraf';
import { markdown } from 'telegram-format';
import { BotContext } from '../context';
import {
  getCountryCodeForText,
  getCountryNameForCountryCode,
} from '../countries';

export const cmdRegisterRemoteMember: Middleware<BotContext> = async (
  ctx
) => {
  const i18n = ctx.i18n;
  const countries = markdown
    .escape(ctx.command.args ?? '')
    .trim()
    .split(' ');

  if (!countries[0]) {
    return ctx.replyWithAutoDestructiveMessage(
      i18n.t('errors.noCountryProvided', {
        mention: ctx.safeUser.mention,
      })
    );
  }

  const countryCodeTo = getCountryCodeForText(countries[0]);

  if (!countryCodeTo) {
    return ctx.replyWithAutoDestructiveMessage(
      i18n.t('errors.failedToIdentifyCountry', {
        mention: ctx.safeUser.mention,
        countryName: countries[0],
      })
    );
  }

  if (!countries[1]) {
    return ctx.replyWithAutoDestructiveMessage(
      i18n.t('errors.noCountryProvided', {
        mention: ctx.safeUser.mention,
      })
    );
  }

  const countryCodeFrom = getCountryCodeForText(countries[1]);

  if (!countryCodeFrom) {
    return ctx.replyWithAutoDestructiveMessage(
      i18n.t('errors.failedToIdentifyCountry', {
        mention: ctx.safeUser.mention,
        countryName: countries[1],
      })
    );
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
    countryCodeFrom,
    countryCodeTo
  );

  return ctx.replyWithAutoDestructiveMessage(
    i18n.t('remote.remoteMemberRegistered', {
      mention: ctx.safeUser.mention,
      countryTo: getCountryNameForCountryCode(countryCodeTo),
      countryFrom: getCountryNameForCountryCode(countryCodeFrom)
    })
  );
};
