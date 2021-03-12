import Countries, { Alpha2Code } from 'i18n-iso-countries';

export const getCountryCodeForText = (text: string) => {
  const countryCode = Countries.isValid(text)
    ? text.toUpperCase()
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
    return undefined;
  }

  const name = Countries.getName(countryCode, 'pt');

  return `${name} (${countryCode})`;
};
