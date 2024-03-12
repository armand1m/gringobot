import { Middleware } from 'telegraf';
import { BotContext } from '../context.js';

export const cmdEnableCaptcha: Middleware<BotContext> = async (
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

  try {
    await ctx.database.enableCaptcha();

    return ctx.replyWithAutoDestructiveMessage(
      t('captcha', 'enabled', {
        mention: ctx.safeUser.mention,
      })
    );
  } catch (err) {
    ctx.logger.error(`Failed to enable captcha.`);
    ctx.logger.error(err);
    return ctx.replyWithAutoDestructiveMessage(
      t('errors', 'failedToEnableCaptcha', {
        mention: ctx.safeUser.mention,
      })
    );
  }
};
