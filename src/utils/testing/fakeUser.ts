import { User } from 'telegraf/types';

export const fakeUserIds = [
  835180019,
  196654428,
  593462360,
  43130793,
  4704218337,
  55744244,
  8741241686,
  318688158,
  883287668,
  179189642,
  336477337,
  555562668,
  955535753,
].sort();

export const createFakeUser = (id: number): User => {
  return {
    id,
    is_bot: false,
    language_code: 'en',
    first_name: 'test',
    last_name: `user_${id}`,
    username: `testuser_${id}`,
  };
};

export const mainFakeTestUser: User = createFakeUser(128256);
