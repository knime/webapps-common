/**
 * Uppercases first letter of string
 * @param {String} str to be capitalized first string, e.g. 'workflow'
 * @return {String} Capitalized String, e.g. Workflow
 */
export const capitalize = (str) =>
  str.charAt(0).toUpperCase() + str.substring(1);

const formats = {
  customFormat: (str, delimiter) =>
    capitalize(str.replace(delimiter, " ").toLowerCase()),
  kebabFormat: (str) => formats.customFormat(str, "-"),
  snakeFormat: (str) => formats.customFormat(str, "_"),
  camelPascalCase: (str) =>
    capitalize(
      str
        .match(/([A-Z]?[^A-Z]*)/g)
        .slice(0, -1)
        .join(" ")
        .toLowerCase()
    ),
  [undefined]: (str) => capitalize(str), // eslint-disable-line no-undefined
};

export const caseFormatter = ({ string, delimiter, format }) => {
  if (delimiter) {
    return formats.customFormat(string, delimiter);
  }
  if (formats) {
    return formats[format](string);
  }
  return capitalize(string);
};
