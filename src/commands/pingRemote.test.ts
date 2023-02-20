import { it, expect } from 'vitest';
import { Command } from '../command';
import { createTestBotContext } from '../utils/testing/createTestBotContext';
import { cmdPingRemote } from './pingRemote';

it('renders simple message when there are less than 5 members registered', async () => {
  const { ctx, next, reply } = await createTestBotContext({
    database: {
      getAllRemoteMembers: () => [448150814, 7823597648],
    },
    command: {
      command: Command.PingRemote,
      args: '',
    },
  });

  await cmdPingRemote(ctx, next);

  expect(reply()).toMatchInlineSnapshot(
    '"[@testuser_128256](tg://user?id=128256) These members are registered as remote: [testuser_0](tg://user?id=0), [testuser_1](tg://user?id=1)"'
  );
});

it('renders no members message when there are no members registered', async () => {
  const { ctx, next, reply } = await createTestBotContext({
    database: {
      getAllRemoteMembers: () => [],
    },
    command: {
      command: Command.PingRemote,
      args: '',
    },
  });

  await cmdPingRemote(ctx, next);

  expect(reply()).toMatchInlineSnapshot(
    '"[@testuser_128256](tg://user?id=128256) There are no members registered as remote."'
  );
});

it('pings all remote members', async () => {
  const { ctx, next, reply } = await createTestBotContext({
    command: {
      command: Command.PingRemote,
      args: '',
    },
  });

  await cmdPingRemote(ctx, next);

  expect(reply()).toMatchInlineSnapshot(`
    "[@testuser_128256](tg://user?id=128256) We selected 5 members registered as remote: [testuser_15345414](tg://user?id=15345414), [testuser_16775747](tg://user?id=16775747), [testuser_44098745](tg://user?id=44098745), [testuser_57984653](tg://user?id=57984653), [testuser_119209224](tg://user?id=119209224) 

     But there are more people registered as remote as well: \`testuser_15345414\`, \`testuser_16775747\`, \`testuser_44098745\`, \`testuser_57984653\`, \`testuser_119209224\`, \`testuser_130938279\`, \`testuser_155076524\`, \`testuser_155318941\`, \`testuser_195853775\`, \`testuser_210720314\`, \`testuser_296616737\`, \`testuser_495571653\`, \`testuser_538545470\`, \`testuser_548982852\`, \`testuser_622016777\`, \`testuser_647606801\`, \`testuser_722468149\`, \`testuser_728235832\`, \`testuser_780481585\`, \`testuser_872777533\`, \`testuser_891816748\`, \`testuser_906235806\`, \`testuser_920249341\`, \`testuser_2480539085\`, \`testuser_5057462085\`, \`testuser_8300111472\`, \`testuser_6338823498\`"
  `);
});
