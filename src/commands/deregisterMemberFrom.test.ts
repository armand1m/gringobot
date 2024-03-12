import { it, expect } from 'vitest';
import { Command } from '../command';
import { createTestBotContext } from '../utils/testing/createTestBotContext';
import { cmdDeregisterMemberFrom } from './deregisterMemberFrom';

it('renders error message when no location is specified', async () => {
  const { ctx, next, reply } = await createTestBotContext({
    userCommand: {
      command: Command.DeregisterMemberFrom,
      args: '',
    },
  });

  await cmdDeregisterMemberFrom(ctx, next);

  expect(reply()).toMatchInlineSnapshot(
    "\"[@testuser_128256](tg://user?id=128256) No location was specified. Specify the [country Alpha2 code](https://en.wikipedia.org/wiki/ISO_3166-2) _(like 'NL' or 'PT')_ or the name of the country in English _('The Netherlands', 'Germany')_ after the command.\""
  );
});

it('renders error message when the location specified is not found', async () => {
  const { ctx, next, reply } = await createTestBotContext({
    userCommand: {
      command: Command.DeregisterMemberFrom,
      args: 'NXL',
    },
  });

  await cmdDeregisterMemberFrom(ctx, next);

  expect(reply()).toMatchInlineSnapshot(
    "\"[@testuser_128256](tg://user?id=128256) couldn't identify the code for the specified country 'NXL'. Try using the [country Alpha2 code](https://en.wikipedia.org/wiki/ISO_3166-2) instead.\""
  );
});

it('removes member from location successfully', async () => {
  const { ctx, next, reply } = await createTestBotContext({
    userCommand: {
      command: Command.DeregisterMemberFrom,
      args: 'NL',
    },
  });

  await cmdDeregisterMemberFrom(ctx, next);

  expect(reply()).toMatchInlineSnapshot(
    '"[@testuser_128256](tg://user?id=128256) You deregistered from the location \'Netherlands (NL)\'."'
  );
});
