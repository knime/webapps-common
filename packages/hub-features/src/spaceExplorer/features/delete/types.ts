/**
 * @example
 * {
 *   type (String identifying the type of the item to delete (e.g. 'workflow'))
 *   id (Repository item id of the item to delete)
 *   name (The name of the item to delete)
 * }
 */
export type DeleteItem = {
  type: string;
  id: string;
  name: string;
};
