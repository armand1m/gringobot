import { Middleware } from 'telegraf';
import { markdown } from 'telegram-format';
import { BotContext } from '../context.js';
import { AvailableLocales } from '../middlewares/createTranslateMiddleware/translate.js';

const validLocales: string[] = ['ptbr', 'en'];

const langParamGuard = (param: string): param is AvailableLocales => {
  return validLocales.includes(param);
};

export const cmdSetLanguage: Middleware<BotContext> = async (ctx) => {
  const i18n = ctx.i18n;
  const hasAdminAccess = await ctx.checkAdminAccess();

  if (!hasAdminAccess) {
    return ctx.replyWithAutoDestructiveMessage(
      i18n.t('errors', 'mustBeAdminToUseCommand', {
        mention: ctx.safeUser.mention,
      })
    );
  }

  const [langParam] = markdown
    .escape(ctx.command.args ?? '')
    .trim()
    .split(' ');

  if (langParamGuard(langParam)) {
    await ctx.database.setGroupLanguage(langParam);
    await ctx.i18n.locale(langParam);

    return ctx.replyWithMarkdown(
      i18n.t('locale', 'changeSuccess', {
        mention: ctx.safeUser.mention,
        groupLocale: langParam,
      })
    );
  }

  return ctx.replyWithMarkdown(
    i18n.t('locale', 'invalidLanguageParam', {
      mention: ctx.safeUser.mention,
      attemptLanguage: langParam,
      validLanguages: validLocales.join(', '),
    })
  );
};
