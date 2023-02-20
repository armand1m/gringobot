export const translations = {
  location: {
    noMembersAtLocation:
      "{{mention}} Não existem pessoas registradas na localização '{{countryName}}'.",
    randomFiveMembersAtLocation:
      "{{mention}} Selecionamos 5 pessoas registradas em '{{countryName}}': {{members}} \n\n Mais pessoas registradas em '{{countryName}}': {{silencedMembers}}",
    membersAtLocation:
      "{{mention}} Estas pessoas estão registradas na localização '{{countryName}}': {{members}}",
    memberRegisteredAtLocation:
      "{{mention}} Você se registrou na localização '{{countryName}}'. Você receberá uma notificação sempre que alguém procurar informações sobre esta localização.",
    memberDeregisteredFromLocation:
      "{{mention}} Você se removeu da localização '{{countryName}}'. Você não receberá mais notificaçoes sempre que alguém procurar informações sobre esta localização.",
    memberNotFoundAnywhere:
      '{{mention}} Você ainda há de se registrar em uma localização.',
    foundMemberAt:
      '{{mention}} Lhe encontrei nestas localizações: {{locations}}',
  },
  errors: {
    failedToKickUser:
      '{{mention}} Não consegui banir {{kickedUser}} por algum motivo. Mais informacoes nos logs. Tente manualmente pela UI do Telegram se for urgente.',
    kickOutOfChat: '{{mention}} /kick funciona somente em grupos.',
    mustBeAdminToUseCommand:
      '{{mention}} Voce deve ser um admin ou ter permissoes para executar esse comando.',
    mentionUserToKick:
      '{{mention}} Mencione um usuario respondendo a uma mensagem enviada pelo usuario com `/kick` para banir.',
    remoteMemberRegisterSyntaxError:
      "{{mention}} Preciso saber o país onde voce vive e para onde voce trabalha (ex.: 'BR' 'ES').",
    failedToIdentifyUser:
      '{{mention}} Não pude identificar o usuário. O comando foi abortado.',
    memberAlreadyRegistered:
      '{{mention}} Você já tem registro nesta localização.',
    noCountryProvided:
      "{{mention}} nenhuma localização foi especificada. Especifique o [código de um país](https://en.wikipedia.org/wiki/ISO_3166-2) _(como 'NL' ou 'PT')_ ou o nome do país em Português _('Holanda', 'Alemanha')_ após o comando.",
    failedToIdentifyCountry:
      "{{mention}} não pude identificar o código para o país '{{countryName}}'. Tente especificar o código do país em vez do nome, se estiver em dúvida a respeito do nome em Português.",
    failedToFetchContent:
      '{{mention}} nao pude buscar o conteudo que voce procura. Tente outro assunto ou topico.',
    unknown: '{{mention}} Ocorreu um problema.',
  },
  listing: {
    noMembers: '{{mention}} Não existem pessoas registradas.',
  },
  remote: {
    remoteMemberRegistered:
      '{{mention}} Você se registrou como remoto do {{countryFrom}} para {{countryTo}}. Você receberá uma notificação sempre que alguém procurar informações sobre esta localização.',
    memberDeregistered:
      '{{mention}} Você se removeu da lista de remotos.',
    members:
      '{{mention}} Estas pessoas estão registradas como remoto: {{members}}',
    randomFiveMembersAtLocation:
      '{{mention}} Selecionamos 5 pessoas registradas como remoto: {{members}} \n\n Mais pessoas registradas como remoto: {{silencedMembers}}',
    noMembers: '{{mention}} Não há pessoas registradas como remoto.',
  },
  kick: {
    userGotKicked: '{{mention}} Usuario {{kickedUser}} foi banido.',
  },
  locale: {
    changeSuccess:
      '{{mention}} A linguagem do bot foi configurada para "{{groupLocale}}"',
    invalidLanguageParam:
      '{{mention}} Não foi possivel mudar a linguagem do bot. A lingua {{attemptLanguage}} não é suportada. Tente alguma das seguintes: {{validLanguages}}',
  },
} as const;
