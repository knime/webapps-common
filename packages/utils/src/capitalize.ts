/**
 * Uppercases first letter of string
 * @param string to be capitalized first string, e.g. "workflow"
 * @return Capitalized String, e.g. "Workflow"
 */
export const capitalize = (input: string) =>
  input.charAt(0).toUpperCase() + input.substring(1);

const formats = {
  customFormat: (input: string, delimiter: string) =>
    capitalize(input.replace(delimiter, " ").toLowerCase()),

  kebabFormat: (input: string) => formats.customFormat(input, "-"),
  snakeFormat: (input: string) => formats.customFormat(input, "_"),

  camelPascalCase: (input: string) =>
    capitalize(
      (input.match(/([A-Z]?[^A-Z]*)/g) ?? [])
        .slice(0, -1)
        .join(" ")
        .toLowerCase(),
    ),
} as const;

type CaseFormatterOptions = {
  string: string;
  delimiter?: string;
  format?: keyof typeof formats;
};

export const caseFormatter = ({
  string,
  delimiter,
  format,
}: CaseFormatterOptions) => {
  if (delimiter) {
    return formats.customFormat(string, delimiter);
  }

  if (format) {
    return formats[format](string, delimiter ?? "");
  }

  return capitalize(string);
};
