export const translations = {
  location: {
    noMembersAtLocation:
      "{{mention}} There are no members registered in the location '{{countryName}}'.",
    randomFiveMembersAtLocation:
      "{{mention}} We selected 5 members registered in the location '{{countryName}}': {{members}} \n\n But there are more people registered in the location '{{countryName}}': {{silencedMembers}}",
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
      '{{mention}} Failed to kick user {{kickedUser}} due to unexpected reasons. Try manually through Telegram UI if urgent.',
    kickOutOfChat:
      '{{mention}} /kick command only works in a group chat.',
    captchaOutOfChat:
      '{{mention}} Captcha only works in a group chat.',
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
    failedToEnableCaptcha: '{{mention}} Failed to enable captcha.',
    failedToDisableCaptcha: '{{mention}} Failed to disable captcha.',
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
    randomFiveMembersAtLocation:
      '{{mention}} We selected 5 members registered as remote: {{members}} \n\n But there are more people registered as remote as well: {{silencedMembers}}',
    noMembers:
      '{{mention}} There are no members registered as remote.',
  },
  kick: {
    userGotKicked:
      '{{mention}} User {{kickedUser}} has been kicked from the group.',
    userGotKickedCaptcha:
      'User {{kickedUser}} has been kicked for failing to solve the captcha.',
  },
  captcha: {
    enabled: '{{mention}} Captcha is enabled.',
    disabled: '{{mention}} Captcha is disabled.',
    noMatch: `{{mention}} Captcha doesn't match. Try again.`,
    solveCaptcha: `{{mention}} Solve the captcha to continue. You have {{seconds}} seconds.`,
    captchaSolved: `{{mention}} Captcha solved successfully.`,
  },
  locale: {
    changeSuccess:
      '{{mention}} The bot language is now set to "{{groupLocale}}"',
    invalidLanguageParam:
      '{{mention}} Failed to change the bot language. The language "{{attemptLanguage}}" is not supported. Try one of the supported languages: {{validLanguages}}',
  },
} as const;
