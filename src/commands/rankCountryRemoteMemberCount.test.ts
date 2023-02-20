import { Command } from '../command';
import { createTestBotContext } from '../utils/testing/createTestBotContext';
import type { RemoteEntry } from '../database';
import { cmdRankCountryRemoteMemberCount } from './rankCountryRemoteMemberCount';

const remoteMembers: Partial<Record<number, RemoteEntry>> = {
  0: {
    id: 0,
    from: 'BR',
    to: 'ES',
  },
  1: {
    id: 0,
    from: 'BR',
    to: 'ES',
  },
  2: {
    id: 0,
    from: 'BR',
    to: 'US',
  },
  3: {
    id: 0,
    from: 'BR',
    to: 'US',
  },
  4: {
    id: 0,
    from: 'BR',
    to: 'FR',
  },
  5: {
    id: 0,
    from: 'BR',
    to: 'GB',
  },
};

it('returns rank for a list', async () => {
  const { ctx, next } = await createTestBotContext({
    database: {
      getRemoteMembersFrom: jest.fn().mockReturnValue(remoteMembers),
    },
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
          "1. 🇪🇸 Spain (ES): 2
    2. 🇺🇸 United States of America (US): 2
    3. 🇫🇷 France (FR): 1
    4. 🇬🇧 United Kingdom (GB): 1

    Total: 6",
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
