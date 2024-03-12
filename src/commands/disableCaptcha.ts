import { Middleware } from 'telegraf';
import { BotContext } from '../context.js';
import { to } from 'await-to-js';

export const cmdDisableCaptcha: Middleware<BotContext> = async (
  ctx
) => {
  const { t } = ctx.i18n;
  const hasAdminAccess = await ctx.checkAdminAccess();

  if (!hasAdminAccess) {
    return ctx.replyWithAutoDestructiveMessage(
      t('errors', 'mustBeAdminToUseCommand', {
        mention: ctx.safeUser.mention,
      })
    );
  }

  const [err] = await to(ctx.database.disableCaptcha());

  if (err) {
    ctx.logger.error(`Failed to disable captcha.`, err);
    return ctx.replyWithAutoDestructiveMessage(
      t('errors', 'failedToDisableCaptcha', {
        mention: ctx.safeUser.mention,
      })
    );
  }

  return ctx.replyWithAutoDestructiveMessage(
    t('captcha', 'disabled', {
      mention: ctx.safeUser.mention,
    })
  );
};
