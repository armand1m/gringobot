import type { RemoteEntry } from '../database';
import { cmdRankCountryRemoteMemberCount } from './rankCountryRemoteMemberCount';

beforeEach(() => {
  jest.restoreAllMocks();
});

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
  // Prepare
  const getRemoteMembersFromMock = jest
    .fn()
    .mockReturnValue(remoteMembers);
  const replyWithMarkdownMock = jest.fn();
  const ctx = {
    database: { getRemoteMembersFrom: getRemoteMembersFromMock },
    command: {},
    replyWithMarkdown: replyWithMarkdownMock,
  };

  // Given
  ctx.command = { args: 'BR' };

  // When
  await (cmdRankCountryRemoteMemberCount as any)(ctx);

  // Then
  expect(replyWithMarkdownMock).toHaveBeenCalledWith(
    expect.stringMatching(/^1\. 🇪🇸 Espanha \(ES\): 2(.|\n)*$/)
  );
  expect(replyWithMarkdownMock).toHaveBeenCalledWith(
    expect.stringMatching(/.*Total: 6/)
  );
});
