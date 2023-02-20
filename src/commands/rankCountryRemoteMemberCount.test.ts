import { it, expect } from 'vitest';
import { Command } from '../command';
import { createTestBotContext } from '../utils/testing/createTestBotContext';
import { cmdRankCountryRemoteMemberCount } from './rankCountryRemoteMemberCount';

it('returns error message when country code is not given', async () => {
  const { ctx, next, reply } = await createTestBotContext({
    command: {
      command: Command.RankCountryRemoteMemberCount,
      text: '',
      args: '',
    },
  });

  await cmdRankCountryRemoteMemberCount(ctx, next);

  expect(reply()).toMatchInlineSnapshot(
    "\"[@testuser_128256](tg://user?id=128256) No location was specified. Specify the [country Alpha2 code](https://en.wikipedia.org/wiki/ISO_3166-2) _(like 'NL' or 'PT')_ or the name of the country in English _('The Netherlands', 'Germany')_ after the command.\""
  );
});

it('returns error message when country code is invalid', async () => {
  const { ctx, next, reply } = await createTestBotContext({
    command: {
      command: Command.RankCountryRemoteMemberCount,
      text: 'foobar',
      args: 'foobar',
    },
  });

  await cmdRankCountryRemoteMemberCount(ctx, next);

  expect(reply()).toMatchInlineSnapshot(
    "\"[@testuser_128256](tg://user?id=128256) couldn't identify the code for the specified country 'foobar'. Try using the [country Alpha2 code](https://en.wikipedia.org/wiki/ISO_3166-2) instead.\""
  );
});

it('returns no member count when empty', async () => {
  const { ctx, next, reply } = await createTestBotContext({
    database: {
      getRemoteMembersFrom: () => ({}),
    },
    command: {
      command: Command.RankCountryRemoteMemberCount,
      text: 'BR',
      args: 'BR',
    },
  });

  await cmdRankCountryRemoteMemberCount(ctx, next);

  expect(reply()).toMatchInlineSnapshot(
    '"[@testuser_128256](tg://user?id=128256) There are no members registered."'
  );
});

it('returns rank for a list', async () => {
  const { ctx, next, reply } = await createTestBotContext({
    command: {
      command: Command.RankCountryRemoteMemberCount,
      text: 'BR',
      args: 'BR',
    },
  });

  await cmdRankCountryRemoteMemberCount(ctx, next);

  expect(reply()).toMatchInlineSnapshot(`
    "1. 🇺🇸 United States of America (US): 20
    2. 🇧🇷 Brazil (BR): 1
    3. 🇳🇱 Netherlands (NL): 1
    4. 🇵🇹 Portugal (PT): 1
    5. 🇸🇮 Slovenia (SI): 1
    6. 🇪🇸 Spain (ES): 1

    Total: 25"
  `);
});
