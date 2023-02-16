import { BotContext } from '../context';
import { cmdRegisterRemoteMember } from './registerRemoteMember';

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

beforeEach(() => {
  jest.restoreAllMocks();
});

it('replies with syntax error when command is issued with single location', async () => {
  // Prepare
  const tMock = jest.fn().mockImplementation(() => 'dummy');
  const replyWithAutoDestructiveMessageMock = jest.fn();
  const ctx: DeepPartial<BotContext> = {
    safeUser: { mention: undefined },
    command: {},
    i18n: { t: tMock },
    replyWithAutoDestructiveMessage: replyWithAutoDestructiveMessageMock,
  };

  // Given
  ctx.command = { args: 'BR' };
  ctx.safeUser = { mention: 'oi' };

  // When
  await (cmdRegisterRemoteMember as any)(ctx);

  // Then
  expect(tMock).toBeCalledWith(
    'errors.remoteMemberRegisterSyntaxError',
    expect.objectContaining({ mention: 'oi' })
  );
  expect(replyWithAutoDestructiveMessageMock).toHaveBeenCalledWith(
    'dummy'
  );
});

it('replies with syntax error when command is issued with no locations', async () => {
  // Prepare
  const tMock = jest.fn().mockImplementation(() => 'dummy');
  const replyWithAutoDestructiveMessageMock = jest.fn();
  const ctx: DeepPartial<BotContext> = {
    safeUser: { mention: undefined },
    command: {},
    i18n: { t: tMock },
    replyWithAutoDestructiveMessage: replyWithAutoDestructiveMessageMock,
  };

  // Given
  ctx.command = { args: '' };
  ctx.safeUser = { mention: 'oi' };

  // When
  await (cmdRegisterRemoteMember as any)(ctx);

  // Then
  expect(tMock).toBeCalledWith(
    'errors.remoteMemberRegisterSyntaxError',
    expect.objectContaining({ mention: 'oi' })
  );
  expect(replyWithAutoDestructiveMessageMock).toHaveBeenCalledWith(
    'dummy'
  );
});
