import Countries, { Alpha2Code } from 'i18n-iso-countries';

export const getCountryCodeForText = (text: string) => {
  const countryCode = Countries.isValid(text)
    ? text.length === 3
      ? Countries.alpha3ToAlpha2(text)
      : text.toUpperCase()
    : Countries.getAlpha2Code(text, 'pt');

  if (!countryCode) {
    return undefined;
  }

  return countryCode as Alpha2Code;
};

export const getCountryNameForCountryCode = (
  countryCode: Alpha2Code
) => {
  if (!Countries.isValid(countryCode)) {
    return countryCode;
  }

  const name = Countries.getName(countryCode, 'pt');

  return `${name} (${countryCode})`;
};
