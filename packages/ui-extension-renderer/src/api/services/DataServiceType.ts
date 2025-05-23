/**
 * Data service service-types available by default to UI Extension nodes.
 *
 * @enum {string}
 */
export type DataServiceType =
  // Returns the initial data as provided by the node implementation. Requires no parameters.
  | "initial_data"
  // Expects request to provide correct method parameters to retrieve data from the referenced data service method.
  | "data"
  // Expects request body to contain the update data to apply/persist/update depending on node implementation.
  | "apply_data";
