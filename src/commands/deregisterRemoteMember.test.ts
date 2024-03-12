import { it, expect } from 'vitest';
import { Command } from '../command';
import { createTestBotContext } from '../utils/testing/createTestBotContext';
import { cmdDeregisterRemoteMember } from './deregisterRemoteMember';

it('should always remove the user remote location', async () => {
  const { ctx, next, reply } = await createTestBotContext({
    userCommand: {
      command: Command.DeregisterRemoteMember,
      args: '',
    },
  });

  await cmdDeregisterRemoteMember(ctx, next);

  expect(reply()).toMatchInlineSnapshot(
    '"[@testuser_128256](tg://user?id=128256) You deregistered yourself as remote."'
  );
});
