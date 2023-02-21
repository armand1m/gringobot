import { it, expect } from 'vitest';
import { Command } from '../command';
import { createTestBotContext } from '../utils/testing/createTestBotContext';
import { fakeUserIds } from '../utils/testing/fakeUser';
import { cmdPingMembersAt } from './pingMembersAt';

it('renders error message when no location is specified', async () => {
  const { ctx, next, reply } = await createTestBotContext({
    command: {
      command: Command.PingMembersAt,
      args: '',
    },
  });

  await cmdPingMembersAt(ctx, next);

  expect(reply()).toMatchInlineSnapshot(
    "\"[@testuser_128256](tg://user?id=128256) No location was specified. Specify the [country Alpha2 code](https://en.wikipedia.org/wiki/ISO_3166-2) _(like 'NL' or 'PT')_ or the name of the country in English _('The Netherlands', 'Germany')_ after the command.\""
  );
});

it('renders error message when the location is specified is not found', async () => {
  const { ctx, next, reply } = await createTestBotContext({
    command: {
      command: Command.PingMembersAt,
      args: 'NXL',
    },
  });

  await cmdPingMembersAt(ctx, next);

  expect(reply()).toMatchInlineSnapshot(
    "\"[@testuser_128256](tg://user?id=128256) couldn't identify the code for the specified country 'NXL'. Try using the [country Alpha2 code](https://en.wikipedia.org/wiki/ISO_3166-2) instead.\""
  );
});

it('renders simple message when there are less than 5 members registered', async () => {
  const { ctx, next, reply } = await createTestBotContext({
    database: {
      getMembersAt: () => fakeUserIds.slice(0, 2),
    },
    command: {
      command: Command.PingMembersAt,
      args: 'NL',
    },
  });

  await cmdPingMembersAt(ctx, next);

  expect(reply()).toMatchInlineSnapshot(
    '"[@testuser_128256](tg://user?id=128256) These members are registered in the location \'Netherlands (NL)\': [testuser_179189642](tg://user?id=179189642), [testuser_196654428](tg://user?id=196654428)"'
  );
});

it('renders no members message when there are no members registered', async () => {
  const { ctx, next, reply } = await createTestBotContext({
    database: {
      getMembersAt: () => [],
    },
    command: {
      command: Command.PingMembersAt,
      args: 'NL',
    },
  });

  await cmdPingMembersAt(ctx, next);

  expect(reply()).toMatchInlineSnapshot(
    '"[@testuser_128256](tg://user?id=128256) There are no members registered in the location \'Netherlands (NL)\'."'
  );
});

it('pings all members of NL', async () => {
  const { ctx, next, reply } = await createTestBotContext({
    command: {
      command: Command.PingMembersAt,
      args: 'NL',
    },
  });

  await cmdPingMembersAt(ctx, next);

  expect(reply()).toMatchInlineSnapshot(`
    "[@testuser_128256](tg://user?id=128256) We selected 5 members registered in the location 'Netherlands (NL)': [testuser_391726249](tg://user?id=391726249), [testuser_547232356](tg://user?id=547232356), [testuser_382886414](tg://user?id=382886414), [testuser_53544518](tg://user?id=53544518), [testuser_89953375](tg://user?id=89953375) 

     But there are more people registered in the location 'Netherlands (NL)': \`testuser_391726249\`, \`testuser_547232356\`, \`testuser_382886414\`, \`testuser_53544518\`, \`testuser_89953375\`, \`testuser_227208025\`, \`testuser_441608247\`, \`testuser_564462765\`, \`testuser_593669410\`, \`testuser_979704468\`, \`testuser_621964405\`, \`testuser_412155185\`, \`testuser_5651918477\`, \`testuser_524946948\`, \`testuser_3799053227\`, \`testuser_5588120983\`, \`testuser_209241418\`, \`testuser_218912918\`, \`testuser_846488799\`, \`testuser_370491844\`, \`testuser_383946132\`, \`testuser_95491730\`, \`testuser_362252440\`, \`testuser_796613400\`, \`testuser_267521831\`, \`testuser_293638954\`, \`testuser_128256\`"
  `);
});

it('pings all remote members if the arg is `remote`', async () => {
  const { ctx, next, reply } = await createTestBotContext({
    command: {
      command: Command.PingMembersAt,
      args: 'remote',
    },
  });

  await cmdPingMembersAt(ctx, next);

  expect(reply()).toMatchInlineSnapshot(`
    "[@testuser_128256](tg://user?id=128256) We selected 5 members registered as remote: [testuser_15345414](tg://user?id=15345414), [testuser_16775747](tg://user?id=16775747), [testuser_44098745](tg://user?id=44098745), [testuser_57984653](tg://user?id=57984653), [testuser_119209224](tg://user?id=119209224) 

     But there are more people registered as remote as well: \`testuser_15345414\`, \`testuser_16775747\`, \`testuser_44098745\`, \`testuser_57984653\`, \`testuser_119209224\`, \`testuser_130938279\`, \`testuser_155076524\`, \`testuser_155318941\`, \`testuser_195853775\`, \`testuser_210720314\`, \`testuser_296616737\`, \`testuser_495571653\`, \`testuser_538545470\`, \`testuser_548982852\`, \`testuser_622016777\`, \`testuser_647606801\`, \`testuser_722468149\`, \`testuser_728235832\`, \`testuser_780481585\`, \`testuser_872777533\`, \`testuser_891816748\`, \`testuser_906235806\`, \`testuser_920249341\`, \`testuser_2480539085\`, \`testuser_5057462085\`, \`testuser_8300111472\`, \`testuser_6338823498\`"
  `);
});
