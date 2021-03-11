import { User } from 'telegraf/typings/telegram-types';
import { markdown } from 'telegram-format';

export const createMemberMention = (user: User) => {
  const username = user.username
    ? `@${user.username}`
    : user.first_name;

  return markdown.userMention(username, user.id);
};
