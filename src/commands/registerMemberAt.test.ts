import { it, expect } from 'vitest';
import { Command } from '../command';
import { createTestBotContext } from '../utils/testing/createTestBotContext';
import { cmdRegisterMemberAt } from './registerMemberAt';

it('replies with syntax error when command is issued with no locations', async () => {
  const { ctx, next, reply } = await createTestBotContext({
    userCommand: {
      command: Command.RegisterMemberAt,
      args: '',
    },
  });

  await cmdRegisterMemberAt(ctx, next);

  expect(reply()).toMatchInlineSnapshot(
    "\"[@testuser_128256](tg://user?id=128256) No location was specified. Specify the [country Alpha2 code](https://en.wikipedia.org/wiki/ISO_3166-2) _(like 'NL' or 'PT')_ or the name of the country in English _('The Netherlands', 'Germany')_ after the command.\""
  );
});

it('replies with error when command is issued with invalid country', async () => {
  const { ctx, next, reply } = await createTestBotContext({
    userCommand: {
      command: Command.RegisterMemberAt,
      args: 'NXL',
    },
  });

  await cmdRegisterMemberAt(ctx, next);

  expect(reply()).toMatchInlineSnapshot(
    "\"[@testuser_128256](tg://user?id=128256) couldn't identify the code for the specified country 'NXL'. Try using the [country Alpha2 code](https://en.wikipedia.org/wiki/ISO_3166-2) instead.\""
  );
});

it('registers user successfully to a country with no one', async () => {
  const { ctx, next, reply } = await createTestBotContext({
    userCommand: {
      command: Command.RegisterMemberAt,
      args: 'NO',
    },
  });

  await cmdRegisterMemberAt(ctx, next);

  expect(reply()).toMatchInlineSnapshot(
    "\"[@testuser_128256](tg://user?id=128256) You registered at 'Norway (NO)'. You'll receive a notification when someone ping members from this location.\""
  );
});

it('registers user successfully to a country with people registered', async () => {
  const { ctx, next, reply } = await createTestBotContext({
    userCommand: {
      command: Command.RegisterMemberAt,
      args: 'PT',
    },
  });

  await cmdRegisterMemberAt(ctx, next);

  expect(reply()).toMatchInlineSnapshot(
    "\"[@testuser_128256](tg://user?id=128256) You registered at 'Portugal (PT)'. You'll receive a notification when someone ping members from this location.\""
  );
});

it('notifies user in case they try to register to a place they are already registered', async () => {
  const { ctx, next, reply } = await createTestBotContext({
    userCommand: {
      command: Command.RegisterMemberAt,
      args: 'NL',
    },
  });

  await cmdRegisterMemberAt(ctx, next);

  expect(reply()).toMatchInlineSnapshot(
    '"[@testuser_128256](tg://user?id=128256) You\'re already registered at this location."'
  );
});
