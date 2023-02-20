import mustache from 'mustache';

export type AvailableLocales = 'en' | 'ptbr';

const getTranslations = async (locale: AvailableLocales) => {
  if (locale === 'ptbr') {
    const { translations } = await import(`./locales/ptbr.js`);
    return translations;
  }

  if (locale === 'en') {
    const { translations } = await import(`./locales/base.js`);
    return translations;
  }

  throw new Error('Invalid locale provided.');
};

type TranslationsObject = Awaited<ReturnType<typeof getTranslations>>;

type InterpolateInner<
  S extends string,
  U extends object = {}
> = S extends `${string}{{${infer V}}}${infer Rest}`
  ? InterpolateInner<Rest, U & { [key in V]: string }>
  : U;

type Interpolate<
  K1 extends keyof TranslationsObject,
  K2 extends keyof TranslationsObject[K1]
> = InterpolateInner<
  // for some reason, although the type below does returns correctly the selected string
  // in the translation dictionary, typescript complains that this doesn't satisfy a string.
  //
  // ignoring it feels safe, although suboptimal.
  //
  // at least, it still works on an interface level.
  //
  // @ts-ignore
  TranslationsObject[K1][K2]
>;

export const createTranslation = async (
  initialLocale: AvailableLocales
) => {
  let translations = await getTranslations(initialLocale);

  const t = <
    N extends keyof TranslationsObject,
    T extends keyof TranslationsObject[N],
    Payload = Interpolate<N, T>
  >(
    ...args: keyof Payload extends never
      ? [namespace: N, translation: T]
      : [namespace: N, translation: T, payload: Interpolate<N, T>]
  ) => {
    const [namespace, key, payload] = args;
    const names = translations[namespace];
    const template = names[key];

    // @ts-ignore
    return mustache.render(template, payload, undefined, {
      escape: (value) => value,
      tags: false,
    });
  };

  const locale = async (newLocale: AvailableLocales) => {
    translations = await getTranslations(newLocale);
  };

  return {
    t,
    locale,
  };
};

export type Translation = Awaited<
  ReturnType<typeof createTranslation>
>;
