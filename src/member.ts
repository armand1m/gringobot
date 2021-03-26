import { User } from 'telegraf/typings/telegram-types';
import { markdown } from 'telegram-format';

export const createMemberMention = (
  user: User,
  silenced: boolean = false
) => {
  const username = user.username
    ? `@${user.username}`
    : user.first_name;

  if (silenced) {
    return markdown.monospace(username);
  }

  return markdown.userMention(username, user.id);
};

const isCyrillic = (text: string = '') => {
  return text.match(/[\u0430-\u044f]+/gi);
};

export const hasCyrillicName = (user: User) => {
  return (
    isCyrillic(user.first_name) ||
    isCyrillic(user.last_name) ||
    isCyrillic(user.username)
  );
};
