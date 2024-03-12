import { MiddlewareFn } from 'telegraf';
import { markdown } from 'telegram-format';
import { BotContext } from '../context.js';
import {
  getCountryCodeForText,
  getCountryNameForCountryCode,
} from '../countries.js';

export const cmdRegisterMemberAt: MiddlewareFn<BotContext> = async (
  ctx
) => {
  const i18n = ctx.i18n;
  const unsafeCountryName = markdown
    .escape(ctx.userCommand.args ?? '')
    .trim();

  if (!unsafeCountryName) {
    return ctx.replyWithAutoDestructiveMessage(
      i18n.t('errors', 'noCountryProvided', {
        mention: ctx.safeUser.mention,
      })
    );
  }

  const countryCode = getCountryCodeForText(
    unsafeCountryName,
    ctx.groupLanguage
  );

  if (!countryCode) {
    return ctx.replyWithAutoDestructiveMessage(
      i18n.t('errors', 'failedToIdentifyCountry', {
        mention: ctx.safeUser.mention,
        countryName: unsafeCountryName,
      })
    );
  }

  const database = ctx.database;
  const userId = ctx.safeUser.id;

  if (database.hasMemberRegistered(userId, countryCode)) {
    return ctx.replyWithAutoDestructiveMessage(
      i18n.t('errors', 'memberAlreadyRegistered', {
        mention: ctx.safeUser.mention,
      })
    );
  }

  await database.addMemberLocation(userId, countryCode);

  return ctx.replyWithAutoDestructiveMessage(
    i18n.t('location', 'memberRegisteredAtLocation', {
      mention: ctx.safeUser.mention,
      countryName: getCountryNameForCountryCode(
        countryCode,
        ctx.groupLanguage
      ),
    })
  );
};
