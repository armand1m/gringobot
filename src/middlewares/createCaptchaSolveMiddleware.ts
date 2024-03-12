import { Middleware } from 'telegraf';
import { BotContext } from '../context.js';
import { User } from 'telegraf/types';

export const createCaptchaSolveMiddleware = () => {
  const middleware: Middleware<BotContext> = async (ctx, next) => {
    const message = ctx.message;

    if (!message) {
      return next();
    }

    const user = (message as any)?.from as User;
    const chatId = ctx.chat?.id;
    const isCaptchaEnabled = await ctx.database.isCaptchaEnabled();

    if (!user || !chatId || !isCaptchaEnabled) {
      return next();
    }

    const isUserInWaitlist = await ctx.database.isUserInCaptchaWaitlist(
      user
    );

    if (!isUserInWaitlist) {
      return next();
    }

    const { t } = ctx.i18n;

    ctx.logger.info(
      `User ${ctx.from?.id} is already in the captcha waitlist.`
    );

    const captchaCtx = await ctx.database.getUserCaptcha(user);

    const msgText = (message as any)?.text;

    if (msgText == captchaCtx.text) {
      ctx.logger.info(`User ${ctx.from?.id} solved the captcha.`);
      await ctx.deleteMessage(captchaCtx.message.message_id);
      await ctx.database.removeUserFromCaptchaWaitlist(user);
      await ctx.replyWithAutoDestructiveMessage(
        t('captcha', 'captchaSolved', {
          mention: ctx.safeUser.mention,
        })
      );
      return next();
    }

    ctx.logger.info(
      `User ${ctx.from?.id} attempt failed to solve the captcha.`
    );
    await ctx.replyWithAutoDestructiveMessage(
      t('captcha', 'noMatch', {
        mention: ctx.safeUser.mention,
      })
    );
    await ctx.deleteMessage(message.message_id);
    return next();
  };

  return middleware;
};
