import { BotCommand } from 'typegram';

export enum Command {
  RegisterMemberAt = 'register_member_at',
  ListCountryMemberCount = 'list_country_member_count',
  RankCountryMemberCount = 'rank_country_member_count',
  RankCountryRemoteMemberCount = 'rank_country_remote_member_count',
  FindMembersAt = 'find_members_at',
  PingMembersAt = 'ping_members_at',
  DeregisterMemberFrom = 'deregister_member_from',
  PingAdmins = 'ping_admins',
  FindMember = 'find_member',
  Help = 'help',
  RegisterRemoteMember = 'register_remote_member',
  DeregisterRemoteMember = 'deregister_remote_member',
  PingRemote = 'ping_remote',
  FindRemoteMemberTo = 'find_remote_member_to',
  FindRemoteMemberFrom = 'find_remote_member_from',
  Kick = 'kick',
}

enum PortugueseCommandAlias {
  RegisterMemberAt = 'estou',
  ListCountryMemberCount = 'quantos',
  RankCountryMemberCount = 'classificacao',
  RankCountryRemoteMemberCount = 'classificacao_remoto',
  FindMembersAt = 'quem',
  PingMembersAt = 'alo',
  PingAdmins = 'eita',
  DeregisterMemberFrom = 'sair',
  DeregisterRemoteMember = 'sair_remoto',
  FindMember = 'ondeestou',
  Help = 'ajuda',
  PingRemote = 'remoto',
  RegisterRemoteMember = 'estou_remoto',
  FindRemoteMemberTo = 'quem_remoto_para',
  FindRemoteMemberFrom = 'quem_remoto_do',
}

enum EnglishCommandAlias {
  RegisterMemberAt = 'imat',
  ListCountryMemberCount = 'list',
  RankCountryMemberCount = 'rank',
  RankCountryRemoteMemberCount = 'rank_remote',
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
  [Command.RankCountryRemoteMemberCount]:
    'Ranks countries based on remote members given a base country.',
  [Command.FindMembersAt]:
    'Find members living in a specific location.',
  [Command.PingMembersAt]:
    'Ping members living in a specific location.',
  [Command.DeregisterMemberFrom]:
    'Deregisters yourself from a specific location.',
  [Command.PingAdmins]: 'Ping all admins.',
  [Command.FindMember]: 'Find all locations you are registered to.',
  [Command.Help]: 'Help about various subjects.',
  [Command.FindRemoteMemberFrom]:
    'Find members that are remote from a country',
  [Command.FindRemoteMemberTo]:
    'Find members that are remote to a country',
  [Command.RegisterRemoteMember]: 'Register you as a remote member',
  [Command.DeregisterRemoteMember]:
    'Deregister you from the remote members',
  [Command.PingRemote]: 'Ping remote members',
  [Command.Kick]: 'Ban mentioned user (Admin only)',
};

const CommandDescriptionMap: Record<string, string> = {
  ...DefaultCommandDescriptions,
  [EnglishCommandAlias.PingAdmins]:
    DefaultCommandDescriptions[Command.PingAdmins],
  [EnglishCommandAlias.ListCountryMemberCount]:
    DefaultCommandDescriptions[Command.ListCountryMemberCount],
  [EnglishCommandAlias.RankCountryMemberCount]:
    DefaultCommandDescriptions[Command.RankCountryMemberCount],
  [EnglishCommandAlias.RankCountryRemoteMemberCount]:
    DefaultCommandDescriptions[Command.RankCountryRemoteMemberCount],
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
  [PortugueseCommandAlias.RankCountryRemoteMemberCount]:
    'Classifica os países baseado no número de pessoas remotas registradas para um determinado país base.',
  [PortugueseCommandAlias.Help]:
    'Ajuda sobre assuntos e tópicos diversos.',
  [PortugueseCommandAlias.DeregisterRemoteMember]:
    'Remove você da lista de remoto',
  [PortugueseCommandAlias.FindRemoteMemberFrom]:
    'Encontra pessoas que estão trabalhando remoto de um país',
  [PortugueseCommandAlias.FindRemoteMemberTo]:
    'Encontra pessoas que estão trabalhando remoto para um país',
  [PortugueseCommandAlias.RegisterRemoteMember]:
    'Se registra como trabalhando remoto',
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
  [Command.RankCountryRemoteMemberCount]: [
    Command.RankCountryRemoteMemberCount,
    PortugueseCommandAlias.RankCountryRemoteMemberCount,
    EnglishCommandAlias.RankCountryRemoteMemberCount,
  ],
  [Command.Help]: [Command.Help, PortugueseCommandAlias.Help],
  [Command.FindRemoteMemberFrom]: [
    Command.FindRemoteMemberFrom,
    PortugueseCommandAlias.FindRemoteMemberFrom,
  ],
  [Command.FindRemoteMemberTo]: [
    Command.FindRemoteMemberTo,
    PortugueseCommandAlias.FindRemoteMemberTo,
  ],
  [Command.RegisterRemoteMember]: [
    Command.RegisterRemoteMember,
    PortugueseCommandAlias.RegisterRemoteMember,
  ],
  [Command.DeregisterRemoteMember]: [
    Command.DeregisterRemoteMember,
    PortugueseCommandAlias.DeregisterRemoteMember,
  ],
  [Command.PingRemote]: [
    Command.PingRemote,
    PortugueseCommandAlias.PingRemote,
  ],
  [Command.Kick]: [Command.Kick],
};
