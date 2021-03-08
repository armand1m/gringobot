import { Middleware } from 'telegraf';
import { BotContext } from '../context';
import { getCountryCodeForText } from '../countries';

export const cmdPingMemberAt: Middleware<BotContext> = async (
  ctx
) => {
  const i18n = ctx.i18n;
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

  const memberIds = database.getMembersAt(country);
  const members = await Promise.all(
    memberIds.map(async (userId) => {
      const member = await ctx.getChatMember(userId);
      return '@' + member.user.username;
    })
  );

  const message =
    members.length === 0
      ? i18n.t('location.noMembersAtLocation')
      : i18n.t('location.membersAtLocation', {
          members: members.join(', '),
        });

  return ctx.reply(message);
};
