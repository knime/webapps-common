const toSnakeCase = (str: string) =>
  str
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1_$2")
    .replace(/([a-zA-Z])(\d)/g, "$1_$2")
    .replace(/(\d)([a-zA-Z])/g, "$1_$2")
    .toLowerCase();

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return (
    typeof value === "object" &&
    value !== null &&
    Object.getPrototypeOf(value) === Object.prototype
  );
};

/**
 * Deeply converts all properties in the given object from camelCase to snake_case.
 */
export const toSnakeCaseDeep = (object: Partial<Record<string, unknown>>) =>
  Object.entries(object).reduce(
    (acc, [rawKey, rawValue]) => {
      const key = rawKey.toString();

      if (isPlainObject(rawValue)) {
        acc[toSnakeCase(key)] = toSnakeCaseDeep(rawValue);
      } else if (Array.isArray(rawValue)) {
        acc[toSnakeCase(key)] = rawValue.map((v) =>
          isPlainObject(v) ? toSnakeCaseDeep(v) : v,
        );
      } else {
        acc[toSnakeCase(key)] = rawValue;
      }

      return acc;
    },
    {} as Record<string, unknown>,
  );
