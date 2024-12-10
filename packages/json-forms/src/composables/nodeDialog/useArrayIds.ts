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
 * There is one exception where we still use actual indices: On initial updates before the dialog is opened.
 */

import { v4 as uuidv4 } from "uuid";

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

export const createNewId = () => uuidv4();

/**
 * @returns a function to add a field to an object and
 * a function to add a callback that is called when the field is added
 */
const addField = <
  S extends Record<string, unknown>,
  T extends Record<string, S>,
>(
  obj: T,
  key: string,
) => {
  const created = {} as S;
  (obj as Record<string, S>)[key] = created;
  return created;
};

export const createArrayAtPath = addField<ArrayRecord, IdsRecord>;
export const createForArrayItem = addField<IdsRecord, ArrayRecord>;
export const deleteArrayItem = (obj: IdsRecord, id: string) => delete obj[id];

export const toIndexIds = (
  indices: number[],
  dataPaths: string[],
  arrayRecord: ArrayRecord = globalArrayRecord,
): string[] => {
  const idsRecord = arrayRecord[dataPaths[0]];
  if (indices.length === 0) {
    return [];
  }
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
  const indexIds = toIndexIds(
    indices.slice(1),
    dataPaths.slice(1),
    idsRecord[indexId],
  );
  return [indexId, ...indexIds];
};

export const getOrCreateIdForIndex = (
  arrayRecord: ArrayRecord,
  dataPath: string,
  index: number,
) => {
  const idsRecord =
    arrayRecord[dataPath] ?? createArrayAtPath(arrayRecord, dataPath);
  const indexId = Object.keys(idsRecord).find((id) => getIndex(id) === index);
  if (typeof indexId === "undefined") {
    const newId = createNewId();
    setIndex(newId, index);
    return {
      indexId: newId,
      arrayRecord: createForArrayItem(idsRecord, newId),
    };
  }
  return { indexId, arrayRecord: idsRecord[indexId] };
};

export const getOrCreateNestedArrayRecord = (
  dataPaths: string[],
  indices: number[],
  arrayRecord: ArrayRecord,
): ArrayRecord => {
  if (indices.length === 0) {
    return arrayRecord;
  }
  const [index, ...restIndices] = indices;
  const [dataPath, ...restDataPaths] = dataPaths;
  const { arrayRecord: nestedArrayRecord } = getOrCreateIdForIndex(
    arrayRecord,
    dataPath,
    index,
  );
  return getOrCreateNestedArrayRecord(
    restDataPaths,
    restIndices,
    nestedArrayRecord,
  );
};
