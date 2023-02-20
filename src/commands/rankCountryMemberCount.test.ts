import { it, expect } from 'vitest';
import { Command } from '../command';
import { createTestBotContext } from '../utils/testing/createTestBotContext';
import { cmdRankCountryMemberCount } from './rankCountryMemberCount';

it('renders no members message count when there are no members registered', async () => {
  const { ctx, next, reply } = await createTestBotContext({
    database: {
      getLocationIndex: () => ({}),
    },
    command: {
      command: Command.RankCountryRemoteMemberCount,
      text: 'NL',
      args: 'NL',
    },
  });

  await cmdRankCountryMemberCount(ctx, next);

  expect(reply()).toMatchInlineSnapshot(
    `"[@testuser](tg://user?id=128256) There are no members registered."`
  );
});

it('renders country member count for NL', async () => {
  const { ctx, next, reply } = await createTestBotContext({
    command: {
      command: Command.RankCountryRemoteMemberCount,
      text: 'NL',
      args: 'NL',
    },
  });

  await cmdRankCountryMemberCount(ctx, next);

  expect(reply()).toMatchInlineSnapshot(`
    "1. 🇧🇷 Brazil (BR): 148
    2. 🇵🇹 Portugal (PT): 54
    3. 🇩🇪 Germany (DE): 34
    4. 🇳🇱 Netherlands (NL): 26
    5. 🇨🇦 Canada (CA): 16
    6. 🇮🇪 Ireland (IE): 13
    6. 🇬🇧 United Kingdom (GB): 13
    8. 🇪🇸 Spain (ES): 11
    9. 🇸🇪 Sweden (SE): 7
    10. 🇨🇿 Czech Republic (CZ): 4
    11. 🇪🇪 Estonia (EE): 3
    11. 🇷🇴 Romania (RO): 3
    13. 🇨🇱 Chile (CL): 2
    13. 🇩🇰 Denmark (DK): 2
    13. 🇭🇺 Hungary (HU): 2
    13. 🇮🇹 Italy (IT): 2
    13. 🇺🇸 United States of America (US): 2
    18. 🇦🇴 Angola (AO): 1
    18. 🇦🇺 Australia (AU): 1
    18. 🇦🇹 Austria (AT): 1
    18. 🇰🇾 Cayman Islands (KY): 1
    18. 🇫🇮 Finland (FI): 1
    18. 🇫🇷 France (FR): 1
    18. 🇱🇺 Luxembourg (LU): 1
    18. 🇳🇿 New Zealand (NZ): 1
    18. 🇸🇬 Singapore (SG): 1
    18. 🇦🇪 United Arab Emirates (AE): 1

    Total: 352"
  `);
});
