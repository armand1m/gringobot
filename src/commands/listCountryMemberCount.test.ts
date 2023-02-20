import { it, expect } from 'vitest';
import { Command } from '../command';
import { createTestBotContext } from '../utils/testing/createTestBotContext';
import { cmdListCountryMemberCount } from './listCountryMemberCount';

it('renders no members message count when there are no members registered', async () => {
  const { ctx, next, reply } = await createTestBotContext({
    database: {
      getLocationIndex: () => ({}),
    },
    command: {
      command: Command.ListCountryMemberCount,
      text: '',
    },
  });

  await cmdListCountryMemberCount(ctx, next);

  expect(reply()).toMatchInlineSnapshot(
    '"[@testuser_128256](tg://user?id=128256) There are no members registered."'
  );
});

it('renders list for all countries', async () => {
  const { ctx, next, reply } = await createTestBotContext({
    command: {
      command: Command.ListCountryMemberCount,
      text: '',
    },
  });

  await cmdListCountryMemberCount(ctx, next);

  expect(reply()).toMatchInlineSnapshot(`
    "🇦🇪 United Arab Emirates (AE): 1
    🇦🇴 Angola (AO): 1
    🇦🇹 Austria (AT): 1
    🇦🇺 Australia (AU): 1
    🇧🇷 Brazil (BR): 148
    🇨🇦 Canada (CA): 16
    🇨🇱 Chile (CL): 2
    🇨🇿 Czech Republic (CZ): 4
    🇩🇪 Germany (DE): 34
    🇩🇰 Denmark (DK): 2
    🇪🇪 Estonia (EE): 3
    🇪🇸 Spain (ES): 11
    🇫🇮 Finland (FI): 1
    🇫🇷 France (FR): 1
    🇬🇧 United Kingdom (GB): 13
    🇭🇺 Hungary (HU): 2
    🇮🇪 Ireland (IE): 13
    🇮🇹 Italy (IT): 2
    🇰🇾 Cayman Islands (KY): 1
    🇱🇺 Luxembourg (LU): 1
    🇳🇱 Netherlands (NL): 26
    🇳🇿 New Zealand (NZ): 1
    🇵🇹 Portugal (PT): 54
    🇷🇴 Romania (RO): 3
    🇸🇪 Sweden (SE): 7
    🇸🇬 Singapore (SG): 1
    🇺🇸 United States of America (US): 2

    Total: 352"
  `);
});
