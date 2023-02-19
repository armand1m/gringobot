import handlebars from 'handlebars';

type AvailableLocales = 'en' | 'ptbr';

const getTranslations = async (_locale: AvailableLocales) => {
  if (_locale === 'ptbr') {
    const { translations } = await import(`./locales/ptbr`);
    return translations;
  }

  if (_locale === 'en') {
    const { translations } = await import(`./locales/base`);
    return translations;
  }

  throw new Error('Invalid locale provided.');
};

type TranslationsObject = Awaited<ReturnType<typeof getTranslations>>;
type TranslationNamespaces = keyof TranslationsObject;

type InterpolateInner<
  S extends string,
  U extends object = {}
> = S extends `${string}{{${infer V}}}${infer Rest}`
  ? InterpolateInner<Rest, U & { [key in V]: string }>
  : U;

type Interpolate<
  N extends keyof TranslationsObject,
  S extends keyof TranslationsObject[N]
> = InterpolateInner<
  // @ts-ignore
  TranslationsObject[N][S]
>;

export const createTranslation = async (
  initialLocale: AvailableLocales
) => {
  let translations = await getTranslations(initialLocale);

  const t = <
    N extends TranslationNamespaces,
    T extends keyof TranslationsObject[N],
    Payload = Interpolate<N, T>
  >(
    ...args: keyof Payload extends never
      ? [namespace: N, translation: T]
      : [namespace: N, translation: T, payload: Interpolate<N, T>]
  ) => {
    const [namespace, key, payload] = args;
    const template = handlebars.compile(
      translations[namespace][key],
      {
        noEscape: true,
        strict: true,
      }
    );

    return template(payload);
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
