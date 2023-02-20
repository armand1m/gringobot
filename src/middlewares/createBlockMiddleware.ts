import { Middleware } from 'telegraf';
import { User } from 'telegraf/types';
import { BotContext } from '../context.js';
import { hasCyrillicName } from '../member.js';

export const createBlockMiddleware = () => {
  const middleware: Middleware<BotContext> = async (ctx, next) => {
    const newChatMember = (ctx.message as any)
      ?.new_chat_member as User;

    const chatId = ctx?.chat?.id;

    if (!newChatMember || !chatId) {
      return next();
    }

    if (!ctx.config.chatsWithCyrillicBlockEnabled.includes(chatId)) {
      return next();
    }

    if (hasCyrillicName(newChatMember)) {
      ctx.logger.info(
        'suspicious user joined, will attempt to kick member'
      );

      try {
        await ctx.banChatMember(newChatMember.id, undefined, {
          revoke_messages: true,
        });

        ctx.logger.warn(
          `suspicious user with id ${newChatMember.id} was kicked`
        );
        ctx.logger.warn(newChatMember);
      } catch (err) {
        ctx.logger.error(
          `failed to kick user with id ${newChatMember.id}.`
        );
        ctx.logger.error(err as string);
        ctx.logger.error(newChatMember);
      }
    }

    return next();
  };

  return middleware;
};
