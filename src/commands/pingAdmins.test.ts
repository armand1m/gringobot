import { it, expect } from 'vitest';
import { Command } from '../command';
import { createTestBotContext } from '../utils/testing/createTestBotContext';
import { cmdPingAdmins } from './pingAdmins';

it('pings 5 admins', async () => {
  const { ctx, next, reply } = await createTestBotContext({
    command: {
      command: Command.PingAdmins,
      args: '',
    },
  });

  await cmdPingAdmins(ctx, next);

  expect(reply()).toMatchInlineSnapshot(
    '"[@testuser_179189642](tg://user?id=179189642), [@testuser_196654428](tg://user?id=196654428), [@testuser_318688158](tg://user?id=318688158), [@testuser_336477337](tg://user?id=336477337), [@testuser_43130793](tg://user?id=43130793)"'
  );
});
