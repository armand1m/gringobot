import { it, expect } from 'vitest';
import { Command } from '../command';
import { createTestBotContext } from '../utils/testing/createTestBotContext';
import { cmdRegisterRemoteMember } from './registerRemoteMember';

it('replies with syntax error when command is issued with single location', async () => {
  const { ctx, next, reply } = await createTestBotContext({
    userCommand: {
      command: Command.RegisterRemoteMember,
      args: 'BR',
    },
  });

  await cmdRegisterRemoteMember(ctx, next);

  expect(reply()).toMatchInlineSnapshot(
    "\"[@testuser_128256](tg://user?id=128256) I need to know where you work from and where your company is located (ex.: 'BR' 'ES').\""
  );
});

it('replies with syntax error when command is issued with no locations', async () => {
  const { ctx, next, reply } = await createTestBotContext({
    userCommand: {
      command: Command.RegisterRemoteMember,
      args: '',
    },
  });

  await cmdRegisterRemoteMember(ctx, next);

  expect(reply()).toMatchInlineSnapshot(
    "\"[@testuser_128256](tg://user?id=128256) I need to know where you work from and where your company is located (ex.: 'BR' 'ES').\""
  );
});

it('replies with error when command is issued with invalid source location', async () => {
  const { ctx, next, reply } = await createTestBotContext({
    userCommand: {
      command: Command.RegisterRemoteMember,
      args: 'NXL BR',
    },
  });

  await cmdRegisterRemoteMember(ctx, next);

  expect(reply()).toMatchInlineSnapshot(
    "\"[@testuser_128256](tg://user?id=128256) couldn't identify the code for the specified country 'NXL'. Try using the [country Alpha2 code](https://en.wikipedia.org/wiki/ISO_3166-2) instead.\""
  );
});

it('replies with error when command is issued with invalid destiny location', async () => {
  const { ctx, next, reply } = await createTestBotContext({
    userCommand: {
      command: Command.RegisterRemoteMember,
      args: 'BR NXL',
    },
  });

  await cmdRegisterRemoteMember(ctx, next);

  expect(reply()).toMatchInlineSnapshot(
    "\"[@testuser_128256](tg://user?id=128256) couldn't identify the code for the specified country 'NXL'. Try using the [country Alpha2 code](https://en.wikipedia.org/wiki/ISO_3166-2) instead.\""
  );
});

it('registers user successfully', async () => {
  const { ctx, next, reply } = await createTestBotContext({
    userCommand: {
      command: Command.RegisterRemoteMember,
      args: 'BR ES',
      text: 'BR ES',
    },
  });

  await cmdRegisterRemoteMember(ctx, next);

  expect(reply()).toMatchInlineSnapshot(
    '"[@testuser_128256](tg://user?id=128256) You registered as remote from Brazil (BR) to Spain (ES). You\'ll receive a notification when someone pings remote members for these two countries."'
  );
});

it('notifies user in case they try to register to a place they are already registered', async () => {
  const { ctx, next, reply } = await createTestBotContext({
    database: {
      hasRemoteMemberRegistered: () => true,
    },
    userCommand: {
      command: Command.RegisterRemoteMember,
      args: 'BR ES',
      text: 'BR ES',
    },
  });

  await cmdRegisterRemoteMember(ctx, next);

  expect(reply()).toMatchInlineSnapshot(
    '"[@testuser_128256](tg://user?id=128256) You\'re already registered at this location."'
  );
});
