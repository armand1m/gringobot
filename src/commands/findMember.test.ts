import { it, expect } from 'vitest';
import { Command } from '../command';
import { createTestBotContext } from '../utils/testing/createTestBotContext';
import { cmdFindMember } from './findMember';

it('returns message if member is not registered', async () => {
  const { ctx, next, reply } = await createTestBotContext({
    database: {
      findMember: (_userId) => [],
    },
    command: {
      command: Command.FindMember,
      args: '',
    },
  });

  await cmdFindMember(ctx, next);

  expect(reply()).toMatchInlineSnapshot(
    '"[@testuser_128256](tg://user?id=128256) You\'re not registered anywhere."'
  );
});

it('returns member location if found', async () => {
  const { ctx, next, reply } = await createTestBotContext({
    command: {
      command: Command.FindMember,
      args: '',
    },
  });

  await cmdFindMember(ctx, next);

  expect(reply()).toMatchInlineSnapshot(
    '"[@testuser_128256](tg://user?id=128256) Found you registered at these locations: Netherlands (NL)"'
  );
});
