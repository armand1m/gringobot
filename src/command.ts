import { BotCommand } from 'typegram';

export enum Command {
  RegisterMemberAt = 'register_member_at',
  ListCountryMemberCount = 'list_country_member_count',
  RankCountryMemberCount = 'rank_country_member_count',
  FindMembersAt = 'find_members_at',
  PingMembersAt = 'ping_members_at',
  DeregisterMemberFrom = 'deregister_member_from',
  PingAdmins = 'ping_admins',
  FindMember = 'find_member',
  Help = 'help',
  RegisterRemoteMember = 'register_remote_member',
  FindRemoteMemberTo = 'find_remote_member_to',
  FindRemoteMemberFrom = 'find_remote_member_from'
}

enum PortugueseCommandAlias {
  RegisterMemberAt = 'estou',
  ListCountryMemberCount = 'quantos',
  RankCountryMemberCount = 'classificacao',
  FindMembersAt = 'quem',
  PingMembersAt = 'alo',
  PingAdmins = 'eita',
  DeregisterMemberFrom = 'sair',
  FindMember = 'ondeestou',
  Help = 'ajuda',
}

enum EnglishCommandAlias {
  RegisterMemberAt = 'imat',
  ListCountryMemberCount = 'list',
  RankCountryMemberCount = 'rank',
  FindMembersAt = 'whoat',
  PingMembersAt = 'ping',
  PingAdmins = 'admins',
  DeregisterMemberFrom = 'leave',
  FindMember = 'whereami',
}

const DefaultCommandDescriptions: Record<Command, string> = {
  [Command.RegisterMemberAt]: 'Registers you at a specific location.',
  [Command.ListCountryMemberCount]:
    'List a member count per country.',
  [Command.RankCountryMemberCount]:
    'Ranks countries based on number of members',
  [Command.FindMembersAt]:
    'Find members living in a specific location.',
  [Command.PingMembersAt]:
    'Ping members living in a specific location.',
  [Command.DeregisterMemberFrom]:
    'Deregisters yourself from a specific location.',
  [Command.PingAdmins]: 'Ping all admins.',
  [Command.FindMember]: 'Find all locations you are registered to.',
  [Command.Help]: 'Help about various subjects.',
  [Command.FindRemoteMemberFrom]: 'test',
  [Command.FindRemoteMemberTo]: 'test',
  [Command.RegisterRemoteMember]: 'test'
  
};

const CommandDescriptionMap: Record<string, string> = {
  ...DefaultCommandDescriptions,
  [EnglishCommandAlias.PingAdmins]:
    DefaultCommandDescriptions[Command.PingAdmins],
  [EnglishCommandAlias.ListCountryMemberCount]:
    DefaultCommandDescriptions[Command.ListCountryMemberCount],
  [EnglishCommandAlias.RankCountryMemberCount]:
    DefaultCommandDescriptions[Command.RankCountryMemberCount],
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
  [PortugueseCommandAlias.ListCountryMemberCount]:
    'Lista a quantidade de membros por países.',
  [PortugueseCommandAlias.RankCountryMemberCount]:
    'Classifica os países baseado no número de pessoas registradas.',
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
  [Command.ListCountryMemberCount]: [
    Command.ListCountryMemberCount,
    PortugueseCommandAlias.ListCountryMemberCount,
    EnglishCommandAlias.ListCountryMemberCount,
  ],
  [Command.RankCountryMemberCount]: [
    Command.RankCountryMemberCount,
    PortugueseCommandAlias.RankCountryMemberCount,
    EnglishCommandAlias.RankCountryMemberCount,
  ],
  [Command.Help]: [Command.Help, PortugueseCommandAlias.Help],
  [Command.FindRemoteMemberFrom]: [Command.FindRemoteMemberFrom],
  [Command.FindRemoteMemberTo]: [Command.FindRemoteMemberTo],
  [Command.RegisterRemoteMember]: [Command.RegisterRemoteMember]
};
