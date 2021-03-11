import { User } from 'telegraf/typings/telegram-types';

export const createMemberMention = (user: User) => {
  if (user.username) {
    return '@' + user.username;
  }

  return `[${user.first_name}](tg://user?id=${user.id})`;
};
