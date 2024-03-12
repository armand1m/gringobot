import { it, expect } from 'vitest';
import { Command } from '../command';
import { createTestBotContext } from '../utils/testing/createTestBotContext';
import { fakeUserIds } from '../utils/testing/fakeUser';
import { cmdFindMembersAt } from './findMembersAt';

it('renders error message when no location is specified', async () => {
  const { ctx, next, reply } = await createTestBotContext({
    userCommand: {
      command: Command.FindMembersAt,
      args: '',
    },
  });

  await cmdFindMembersAt(ctx, next);

  expect(reply()).toMatchInlineSnapshot(
    "\"[@testuser_128256](tg://user?id=128256) No location was specified. Specify the [country Alpha2 code](https://en.wikipedia.org/wiki/ISO_3166-2) _(like 'NL' or 'PT')_ or the name of the country in English _('The Netherlands', 'Germany')_ after the command.\""
  );
});

it('renders error message when the location is specified is not found', async () => {
  const { ctx, next, reply } = await createTestBotContext({
    userCommand: {
      command: Command.FindMembersAt,
      args: 'NXL',
    },
  });

  await cmdFindMembersAt(ctx, next);

  expect(reply()).toMatchInlineSnapshot(
    "\"[@testuser_128256](tg://user?id=128256) couldn't identify the code for the specified country 'NXL'. Try using the [country Alpha2 code](https://en.wikipedia.org/wiki/ISO_3166-2) instead.\""
  );
});

it('renders simple message when there are less than 5 members registered', async () => {
  const { ctx, next, reply } = await createTestBotContext({
    database: {
      getMembersAt: () => fakeUserIds.slice(0, 2),
    },
    userCommand: {
      command: Command.FindMembersAt,
      args: 'NL',
    },
  });

  await cmdFindMembersAt(ctx, next);

  expect(reply()).toMatchInlineSnapshot(
    '"[@testuser_128256](tg://user?id=128256) These members are registered in the location \'Netherlands (NL)\': `testuser_179189642`, `testuser_196654428`"'
  );
});

it('renders no members message when there are no members registered', async () => {
  const { ctx, next, reply } = await createTestBotContext({
    database: {
      getMembersAt: () => [],
    },
    userCommand: {
      command: Command.FindMembersAt,
      args: 'NL',
    },
  });

  await cmdFindMembersAt(ctx, next);

  expect(reply()).toMatchInlineSnapshot(
    '"[@testuser_128256](tg://user?id=128256) There are no members registered in the location \'Netherlands (NL)\'."'
  );
});

it('lists all members of NL', async () => {
  const { ctx, next, reply } = await createTestBotContext({
    userCommand: {
      command: Command.PingMembersAt,
      args: 'NL',
    },
  });

  await cmdFindMembersAt(ctx, next);

  expect(reply()).toMatchInlineSnapshot(
    '"[@testuser_128256](tg://user?id=128256) These members are registered in the location \'Netherlands (NL)\': `testuser_391726249`, `testuser_547232356`, `testuser_382886414`, `testuser_53544518`, `testuser_89953375`, `testuser_227208025`, `testuser_441608247`, `testuser_564462765`, `testuser_593669410`, `testuser_979704468`, `testuser_621964405`, `testuser_412155185`, `testuser_5651918477`, `testuser_524946948`, `testuser_3799053227`, `testuser_5588120983`, `testuser_209241418`, `testuser_218912918`, `testuser_846488799`, `testuser_370491844`, `testuser_383946132`, `testuser_95491730`, `testuser_362252440`, `testuser_796613400`, `testuser_267521831`, `testuser_293638954`, `testuser_128256`"'
  );
});
