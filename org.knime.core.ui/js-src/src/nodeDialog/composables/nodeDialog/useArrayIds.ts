/**
 * Instead of providing indices on triggers or valueProvider changes, we need to provide ids (the ones that uniquely identify the array element where it is coming from)
 * This way we can get rid of the key of array layouts being dependent on the index (so that we do not have to rerender when removing non-last items or when resorting) and also when updating while resorting
 * we still can use the outcome in the correct place (i.e. in case (1) and (2) yield different results below).
 *
 * This means:
 *  * state providers do not register to fixed indices but instead to fixed ids
 *  * when a value inside an array layout changes, we detect if something is triggered by it and the indices to do so and then look up the current ids of these indices at the moment the change happens (1)
 *  * when receiving an answer from the backend
 *      * ui states: Just use the ids to find the correct state provider (which now register to ids)
 *      * value updates: Look up the current indices for the given ids at the moment we receive the answer from the backend (2)
 */

const idToIndex = new Map<string, number>();

export const setIndex = (id: string, index: number) => idToIndex.set(id, index);
export const getIndex = (id: string) => idToIndex.get(id) ?? null;
export const deleteId = (id: string) => idToIndex.delete(id);

export interface ArrayRecord {
  /**
   * the path to an array layout field
   */
  [path: string]: {
    /**
     * An id used in that array layout
     */
    [id: string]: ArrayRecord;
  };
}

/**
 * The key are the ids used in one array layout.
 * Since an array layout element can contain other array layouts, these are the values.
 */
export interface IdsRecord {
  [id: string]: ArrayRecord;
}

/**
 * The global record listing ids for array layouts which are part of the dialog.
 */
const globalArrayRecord: ArrayRecord = {};
export const getArrayIdsRecord = () => globalArrayRecord;

const createObjectAtKey = (
  obj: Record<string, Record<string, unknown>>,
  key: string,
) => {
  const created = {};
  obj[key] = created;
  return created;
};

export const createArrayAtPath: (obj: ArrayRecord, path: string) => IdsRecord =
  createObjectAtKey;

export const createForArrayItem: (obj: IdsRecord, id: string) => ArrayRecord =
  createObjectAtKey;

export const deleteArrayItem = (obj: IdsRecord, id: string) => delete obj[id];

export const toIndexIds = (
  indices: number[],
  dependency: string[],
  arrayRecord: ArrayRecord = globalArrayRecord,
): string[] => {
  if (indices.length === 0) {
    return [];
  }
  const idsRecord = arrayRecord[dependency[0]];
  if (typeof idsRecord === "undefined") {
    throw Error(
      "No array layout found on value update. This should not happen.",
    );
  }
  const indexId = Object.keys(idsRecord).find(
    (id) => getIndex(id) === indices[0],
  );
  if (typeof indexId === "undefined") {
    throw Error(
      "No array layout element id found on value update. This should not happen.",
    );
  }
  return [
    indexId,
    ...toIndexIds(indices.slice(1), dependency.slice(1), idsRecord[indexId]),
  ];
};
