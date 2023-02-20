import { Command } from '../command';
import { createTestBotContext } from '../utils/testing/createTestBotContext';
import { cmdRankCountryRemoteMemberCount } from './rankCountryRemoteMemberCount';

it('returns rank for a list', async () => {
  const { ctx, next } = await createTestBotContext({
    command: {
      command: Command.RankCountryRemoteMemberCount,
      text: 'BR',
      args: 'BR',
    },
  });

  await cmdRankCountryRemoteMemberCount(ctx, next);

  expect(ctx.replyWithMarkdown).toMatchInlineSnapshot(`
    [MockFunction] {
      "calls": Array [
        Array [
          "1. 🇺🇸 United States of America (US): 20
    2. 🇧🇷 Brazil (BR): 1
    3. 🇳🇱 Netherlands (NL): 1
    4. 🇵🇹 Portugal (PT): 1
    5. 🇸🇮 Slovenia (SI): 1
    6. 🇪🇸 Spain (ES): 1

    Total: 25",
        ],
      ],
      "results": Array [
        Object {
          "type": "return",
          "value": undefined,
        },
      ],
    }
  `);
});
