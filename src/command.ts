import { BotCommand } from 'typegram';

export enum Command {
  RegisterMemberAt = 'register_member_at',
  FindMembersAt = 'find_members_at',
  PingMembersAt = 'ping_members_at',
  DeregisterMemberFrom = 'deregister_member_from',
  PingAdmins = 'ping_admins',
  FindMember = 'find_member',
  Help = 'help',
}

enum PortugueseCommandAlias {
  RegisterMemberAt = 'estou',
  FindMembersAt = 'quem',
  PingMembersAt = 'alo',
  PingAdmins = 'eita',
  DeregisterMemberFrom = 'sair',
  FindMember = 'ondeestou',
  Help = 'ajuda',
}

enum EnglishCommandAlias {
  RegisterMemberAt = 'imat',
  FindMembersAt = 'whoat',
  PingMembersAt = 'ping',
  PingAdmins = 'admins',
  DeregisterMemberFrom = 'leave',
  FindMember = 'whereami',
}

const DefaultCommandDescriptions: Record<Command, string> = {
  [Command.RegisterMemberAt]: 'Registers you at a specific location.',
  [Command.FindMembersAt]:
    'Find members living in a specific location.',
  [Command.PingMembersAt]:
    'Ping members living in a specific location.',
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
  [EnglishCommandAlias.FindMembersAt]:
    DefaultCommandDescriptions[Command.FindMembersAt],
  [EnglishCommandAlias.PingMembersAt]:
    DefaultCommandDescriptions[Command.PingMembersAt],
  [EnglishCommandAlias.FindMember]:
    DefaultCommandDescriptions[Command.FindMember],
  [PortugueseCommandAlias.PingAdmins]: 'Notifica admins.',
  [PortugueseCommandAlias.RegisterMemberAt]:
    'Registra você em uma localização específica.',
  [PortugueseCommandAlias.DeregisterMemberFrom]:
    'Retira você de uma localização específica.',
  [PortugueseCommandAlias.PingMembersAt]:
    'Chama pessoas de uma localização específica.',
  [PortugueseCommandAlias.FindMembersAt]:
    'Encontra pessoas de uma localização específica.',
  [PortugueseCommandAlias.FindMember]:
    'Encontra as localizações que tem você nos registros.',
  [PortugueseCommandAlias.Help]:
    'Ajuda sobre assuntos e tópicos diversos.',
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
  [Command.FindMembersAt]: [
    Command.FindMembersAt,
    PortugueseCommandAlias.FindMembersAt,
    EnglishCommandAlias.FindMembersAt,
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
