import { SEPARATOR } from "../types";

const isValid = (id: string) => id.includes(SEPARATOR);

/**
 * Parses the given event id, splitting it by a known separator. Each id is expected to have
 * two components to it: The event category and a specific action within that category
 * @returns
 * @throws when id format is invalid
 */
const parse = (id: string): { category: string; action: string } => {
  if (!isValid(id)) {
    throw new Error(`Cannot parse event id. Invalid format found: ${id}`);
  }

  const out = id.split(SEPARATOR);

  if (out.length !== 2) {
    throw new Error(`Cannot parse event id. Invalid format found: ${id}`);
  }

  const [category, action] = out;
  return { category, action };
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
