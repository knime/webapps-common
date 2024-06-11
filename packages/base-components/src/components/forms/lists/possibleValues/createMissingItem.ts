import type { Id } from "./PossibleValue";

/**
 * A possible value for values which are not present in the given ones.
 */
export default (id: Id) => {
  return { id, text: `(MISSING) ${String(id)}`, invalid: true };
};
