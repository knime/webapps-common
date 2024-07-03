import type { Id, PossibleValue } from "./types";

/**
 * A possible value for values which are not present in the given ones.
 */
export const createMissingItem = (id: Id): PossibleValue => {
  return { id, text: `(MISSING) ${String(id)}`, invalid: true };
};
