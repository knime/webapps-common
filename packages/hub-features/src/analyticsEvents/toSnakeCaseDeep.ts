// eslint-disable-next-line depend/ban-dependencies
import { snakeCase } from "lodash-es";

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
        acc[snakeCase(key)] = toSnakeCaseDeep(rawValue);
      } else if (Array.isArray(rawValue)) {
        acc[snakeCase(key)] = rawValue.map((v) =>
          isPlainObject(v) ? toSnakeCaseDeep(v) : v,
        );
      } else {
        acc[snakeCase(key)] = rawValue;
      }

      return acc;
    },
    {} as Record<string, unknown>,
  );
