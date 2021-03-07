export enum Command {
  RegisterMemberAt = 'registerMemberAt',
  PingMembersAt = 'pingMembersAt',
  DeregisterMemberFrom = 'deregisterMemberFrom',
  PingAdmins = 'pingAdmins',
}

export const CommandAliases: Record<Command, string[]> = {
  [Command.RegisterMemberAt]: [
    Command.RegisterMemberAt,
    'estou',
    'imat',
  ],
  [Command.PingMembersAt]: [
    Command.PingMembersAt,
    'quem',
    'whoisat',
    'whoat',
  ],
  [Command.PingAdmins]: [Command.PingAdmins, 'admins', 'eita'],
  [Command.DeregisterMemberFrom]: [
    Command.DeregisterMemberFrom,
    'sair',
    'leave',
  ],
};
