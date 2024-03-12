import sharp from 'sharp';
import svgCaptcha from 'svg-captcha';
import { Middleware, Input } from 'telegraf';
import { BotContext } from '../context.js';
import { User } from 'telegraf/types';

export const createCaptchaMiddleware = () => {
  const middleware: Middleware<BotContext> = async (ctx, next) => {
    const message = ctx.message;

    if (!message) {
      return next();
    }

    const newChatMember = (message as any)?.new_chat_member as User;

    const chatId = ctx.chat?.id;
    const isCaptchaEnabled = await ctx.database.isCaptchaEnabled();

    if (!newChatMember || !chatId || !isCaptchaEnabled) {
      return next();
    }

    const { t } = ctx.i18n;

    ctx.logger.info(`User ${ctx.from?.id} joined the chat. `);
    ctx.logger.info(`Sending captcha to user ${ctx.from?.id}`);

    const captcha = svgCaptcha.create();
    const pngBuffer = await sharp(Buffer.from(captcha.data))
      .png()
      .toBuffer();
    const input = Input.fromBuffer(pngBuffer);
    const captchaMessage = await ctx.replyWithPhoto(input);
    await ctx.replyWithAutoDestructiveMessage(
      t('captcha', 'solveCaptcha', {
        mention: ctx.safeUser.mention,
        seconds: '120',
      })
    );

    await ctx.database.addUserToCaptchaWaitlist(
      newChatMember,
      captcha,
      captchaMessage
    );

    ctx.logger.info(
      `User ${ctx.from?.id} has been added to the captcha waitlist.`
    );

    return next();
  };

  return middleware;
};
