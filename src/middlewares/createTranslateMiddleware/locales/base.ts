export const translations = {
  location: {
    noMembersAtLocation:
      "{{mention}} There are no members registered in the location '{{countryName}}'.",
    membersAtLocation:
      "{{mention}} These members are registered in the location '{{countryName}}': {{members}}",
    memberRegisteredAtLocation:
      "{{mention}} You registered at '{{countryName}}'. You'll receive a notification when someone ping members from this location.",
    memberDeregisteredFromLocation:
      "{{mention}} You deregistered from the location '{{countryName}}'.",
    memberNotFoundAnywhere:
      "{{mention}} You're not registered anywhere.",
    foundMemberAt:
      '{{mention}} Found you registered at these locations: {{locations}}',
  },
  errors: {
    failedToKickUser:
      '{{mention}} Failed to kick user {{kickedUser}} due to unexpected reasons.',
    kickOutOfChat: '{{mention}} /kick command only works in a chat.',
    mustBeAdminToUseCommand:
      '{{mention}} You must be an admin to use this command.',
    mentionUserToKick:
      '{{mention}} Please mention a user to be kicked. You can do so by replying their message.',
    remoteMemberRegisterSyntaxError:
      "{{mention}} I need to know where you work from and where your company is located (ex.: 'BR' 'ES').",
    failedToIdentifyUser:
      "{{mention}} Couldn't identify the user. Command failed.",
    memberAlreadyRegistered:
      "{{mention}} You're already registered at this location.",
    noCountryProvided:
      "{{mention}} No location was specified. Specify the [country Alpha2 code](https://en.wikipedia.org/wiki/ISO_3166-2) _(like 'NL' or 'PT')_ or the name of the country in English _('The Netherlands', 'Germany')_ after the command.",
    failedToIdentifyCountry:
      "{{mention}} couldn't identify the code for the specified country '{{countryName}}'. Try using the [country Alpha2 code](https://en.wikipedia.org/wiki/ISO_3166-2) instead.",
    failedToFetchContent:
      "{{mention}} Failed to find the content you're looking for.",
    unknown: '{{mention}} A problem occurred.',
  },
  listing: {
    noMembers: '{{mention}} There are no members registered.',
  },
  remote: {
    remoteMemberRegistered:
      "{{mention}} You registered as remote from {{countryFrom}} to {{countryTo}}. You'll receive a notification when someone pings remote members for these two countries.",
    memberDeregistered:
      '{{mention}} You deregistered yourself as remote.',
    members:
      '{{mention}} These members are registered as remote: {{members}}',
    noMembers:
      '{{mention}} There are no members registered as remote.',
  },
  kick: {
    userGotKicked:
      '{{mention}} User {{kickedUser}} has been kicked from the group.',
  },
} as const;

export type TranslationTypes = typeof translations;
