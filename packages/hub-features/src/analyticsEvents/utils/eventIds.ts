import { SEPARATOR } from "../types";

const isValid = (id: string) => id.includes(SEPARATOR);

/**
 * Parses the given event id, splitting it by a known separator. Each id is expected to have
 * two components to it: The event category and a specific action within that category
 * @returns
 * @throws when id format is invalid
 */
const parse = (id: string): [string, string] => {
  if (!isValid(id)) {
    throw new Error(`Cannot parse event id. Invalid format found: ${id}`);
  }

  const out = id.split(SEPARATOR);

  if (out.length !== 2) {
    throw new Error(`Cannot parse event id. Invalid format found: ${id}`);
  }

  return out as [string, string];
};

export const eventID = (id: string) => ({
  isValid: () => isValid(id),
  /**
   * Parses the given event id, splitting it by a known separator. Each id is expected to have
   * two components to it: The event category and a specific action within that category
   * @returns
   * @throws when id format is invalid
   */
  parse: () => parse(id),
});
