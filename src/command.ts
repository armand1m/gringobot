import { BotCommand } from 'typegram';

export enum Command {
  RegisterMemberAt = 'register_member_at',
  PingMembersAt = 'ping_members_at',
  DeregisterMemberFrom = 'deregister_member_from',
  PingAdmins = 'ping_admins',
  FindMember = 'find_member',
  Help = 'help',
}

enum PortugueseCommandAlias {
  RegisterMemberAt = 'estou',
  PingMembersAt = 'quem',
  PingAdmins = 'eita',
  DeregisterMemberFrom = 'sair',
  FindMember = 'ondeestou',
  Help = 'ajuda',
}

enum EnglishCommandAlias {
  RegisterMemberAt = 'imat',
  PingMembersAt = 'whoat',
  PingAdmins = 'admins',
  DeregisterMemberFrom = 'leave',
  FindMember = 'whereami',
}

const DefaultCommandDescriptions: Record<Command, string> = {
  [Command.RegisterMemberAt]: 'Registers you at a specific location.',
  [Command.PingMembersAt]:
    'Ping the members living in a specific location.',
  [Command.DeregisterMemberFrom]:
    'Deregisters yourself from a specific location.',
  [Command.PingAdmins]: 'Ping all admins.',
  [Command.FindMember]: 'Find all locations you are registered to.',
  [Command.Help]: 'Help about various subjects.',
};

const CommandDescriptionMap: Record<string, string> = {
  ...DefaultCommandDescriptions,
  [EnglishCommandAlias.PingAdmins]:
    DefaultCommandDescriptions[Command.PingAdmins],
  [EnglishCommandAlias.RegisterMemberAt]:
    DefaultCommandDescriptions[Command.RegisterMemberAt],
  [EnglishCommandAlias.DeregisterMemberFrom]:
    DefaultCommandDescriptions[Command.DeregisterMemberFrom],
  [EnglishCommandAlias.PingMembersAt]:
    DefaultCommandDescriptions[Command.PingMembersAt],
  [EnglishCommandAlias.FindMember]:
    DefaultCommandDescriptions[Command.FindMember],
  [PortugueseCommandAlias.PingAdmins]: 'Notifica todos admins.',
  [PortugueseCommandAlias.RegisterMemberAt]:
    'Registra voce em uma localizacao especifica.',
  [PortugueseCommandAlias.DeregisterMemberFrom]:
    'Retira voce de uma localizacao especifica.',
  [PortugueseCommandAlias.PingMembersAt]:
    'Chama pessoas de uma localizacao especifica.',
  [PortugueseCommandAlias.FindMember]:
    'Encontra as localizacoes que tem voce nos registros.',
  [PortugueseCommandAlias.Help]:
    'Ajuda sobre assuntos e topicos diversos.',
};

export const CommandDescriptions: BotCommand[] = Object.keys(
  CommandDescriptionMap
).map((key) => ({
  command: key,
  description: CommandDescriptionMap[key],
}));

export const CommandAliases: Record<Command, string[]> = {
  [Command.RegisterMemberAt]: [
    Command.RegisterMemberAt,
    PortugueseCommandAlias.RegisterMemberAt,
    EnglishCommandAlias.RegisterMemberAt,
  ],
  [Command.PingMembersAt]: [
    Command.PingMembersAt,
    PortugueseCommandAlias.PingMembersAt,
    EnglishCommandAlias.PingMembersAt,
  ],
  [Command.PingAdmins]: [
    Command.PingAdmins,
    PortugueseCommandAlias.PingAdmins,
    EnglishCommandAlias.PingAdmins,
  ],
  [Command.DeregisterMemberFrom]: [
    Command.DeregisterMemberFrom,
    PortugueseCommandAlias.DeregisterMemberFrom,
    EnglishCommandAlias.DeregisterMemberFrom,
  ],
  [Command.FindMember]: [
    Command.FindMember,
    PortugueseCommandAlias.FindMember,
    EnglishCommandAlias.FindMember,
  ],
  [Command.Help]: [Command.Help, PortugueseCommandAlias.Help],
};
