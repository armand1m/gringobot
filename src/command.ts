export enum Command {
  RegisterMemberAt = 'registerMemberAt',
  PingMembersAt = 'pingMembersAt',
  DeregisterMemberAt = 'deregisterMemberAt',
  PingAdmins = 'pingAdmins',
}

export interface CommandLocaleMap {
  locale: string;
  commands: Record<string, Command>;
}
