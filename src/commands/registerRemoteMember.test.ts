import { Command } from '../command';
import { createTestBotContext } from '../utils/testing/createTestBotContext';
import { cmdRegisterRemoteMember } from './registerRemoteMember';

it('replies with syntax error when command is issued with single location', async () => {
  const { ctx, next } = await createTestBotContext({
    command: {
      command: Command.RegisterRemoteMember,
      args: 'BR',
    },
  });

  await cmdRegisterRemoteMember(ctx, next);

  expect(ctx.replyWithAutoDestructiveMessage).toMatchInlineSnapshot(`
    [MockFunction] {
      "calls": Array [
        Array [
          "[@testuser](tg://user?id=128256) I need to know where you work from and where your company is located (ex.: 'BR' 'ES').",
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

it('replies with syntax error when command is issued with no locations', async () => {
  const { ctx, next } = await createTestBotContext({
    command: {
      command: Command.RegisterRemoteMember,
      args: '',
    },
  });

  await cmdRegisterRemoteMember(ctx, next);

  expect(ctx.replyWithAutoDestructiveMessage).toMatchInlineSnapshot(`
    [MockFunction] {
      "calls": Array [
        Array [
          "[@testuser](tg://user?id=128256) I need to know where you work from and where your company is located (ex.: 'BR' 'ES').",
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
