import Countries, { Alpha2Code } from 'i18n-iso-countries';
import { AvailableLocales } from './middlewares/createTranslateMiddleware/translate.js';

const localeToLang: Record<AvailableLocales, string> = {
  en: 'en',
  ptbr: 'pt',
};

export const getCountryCodeForText = (
  text: string,
  locale: AvailableLocales
) => {
  const countryCode = Countries.isValid(text)
    ? text.length === 3
      ? Countries.alpha3ToAlpha2(text)
      : text.toUpperCase()
    : Countries.getAlpha2Code(text, localeToLang[locale]);

  if (!countryCode) {
    return undefined;
  }

  return countryCode as Alpha2Code;
};

export const getCountryNameForCountryCode = (
  countryCode: Alpha2Code,
  locale: AvailableLocales
) => {
  if (!Countries.isValid(countryCode)) {
    return countryCode;
  }

  const name = Countries.getName(countryCode, localeToLang[locale]);

  return `${name} (${countryCode})`;
};
