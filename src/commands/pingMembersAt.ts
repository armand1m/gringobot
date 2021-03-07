import { Middleware } from 'telegraf';
import { BotContext } from '../context';
import { Country } from '../countries';

export const cmdPingMemberAt: Middleware<BotContext> = async (
  ctx
) => {
  const i18n = ctx.i18n;
  const database = ctx.database;
  const country = Country.Netherlands;
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

  ctx.reply(message);
};
