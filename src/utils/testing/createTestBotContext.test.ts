import { it, expect } from 'vitest';
import { createTestBotContext } from './createTestBotContext';

it('should throw error when reply is invoked without any reply being sent', async () => {
  const { reply } = await createTestBotContext();

  expect(reply).toThrowErrorMatchingInlineSnapshot(
    '"replyWithAutoDestructiveMessage nor replyWithMarkdown were invoked."'
  );
});
