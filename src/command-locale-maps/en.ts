import { Command, CommandLocaleMap } from '../command';

export const commandMap: CommandLocaleMap = {
  locale: 'en',
  commands: {
    imat: Command.RegisterMemberAt,
    whoisat: Command.PingMembersAt,
    leave: Command.DeregisterMemberAt,
    pingAdmins: Command.PingAdmins,
  },
};
