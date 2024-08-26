import { toDataPath } from "@jsonforms/core";

/**
 * E.g.
 * * dataPaths = ['foo', 'bar', 'baz'], indices = [1, 2] -->  ['foo.1.bar.2.baz']
 * * dataPaths = ['foo', 'bar', 'baz'], indices = [1] -->  ['foo.1.bar', 'baz']
 * * dataPaths = ['foo', 'bar', 'baz'], indices = [] -->  ['foo', 'bar', 'baz']
 */
export const combineDataPathsWithIndices = (
  dataPaths: string[],
  indices: number[],
) => {
  return dataPaths.reduce((segments, dataPath, i) => {
    if (i === 0) {
      segments[0] = dataPath;
    } else if (i <= indices.length) {
      segments[0] = `${segments[0]}.${indices[i - 1]}.${dataPath}`;
    } else {
      segments.push(dataPath);
    }
    return segments;
  }, [] as string[]);
};

/**
 * @returns an array of paths. If there are multiple, all but the first one lead to an array in
 * which every index is to be adjusted.
 */
export const combineScopesWithIndices = (scopes: string[], indices: number[]) =>
  combineDataPathsWithIndices(scopes.map(toDataPath), indices);

/**
 * E.g.
 *  removeFromStart(["A", "B"], ["A"]) === ["B"]
 *  removeFromStart(["A"], ["A", "B"]) === []
 *  removeFromStart(["C", "B"], ["A"]) === null
 */
const removeFromStart = (segments: string[], startingSegments: string[]) => {
  const lengthMin = Math.min(segments.length, startingSegments.length);
  for (let i = 0; i < lengthMin; i++) {
    if (segments[i] !== startingSegments[i]) {
      return null;
    }
  }
  return segments.slice(startingSegments.length);
};

/**
 * This method checks whether the given path segments can be obtained by combining the dataPathSegments with
 * intermediate numbers. If so, these numbers are returned. If not, the result is null.
 */
const testMatchesAndGetIndices = (
  segments: string[],
  dataPathSegments: string[][],
): null | number[] => {
  if (segments.length === 0) {
    return dataPathSegments.length > 1 ? null : [];
  }
  const segmentsWithoutFirstDataPath = removeFromStart(
    segments,
    dataPathSegments[0],
  );
  if (segmentsWithoutFirstDataPath === null) {
    return null;
  }
  if (dataPathSegments.length === 1) {
    return [];
  }
  if (segmentsWithoutFirstDataPath.length === 0) {
    return null;
  }
  const [needsToBeANumber, ...rest] = segmentsWithoutFirstDataPath;
  const nextNumber = parseInt(needsToBeANumber, 10);
  if (isNaN(nextNumber)) {
    return null;
  }
  const restMatchingIndices = testMatchesAndGetIndices(
    rest,
    dataPathSegments.slice(1),
  );
  return restMatchingIndices === null
    ? null
    : [nextNumber, ...restMatchingIndices];
};

const splitBy = (splitter: string) => (str: string) => str.split(splitter);

/**
 * Extracts the indices from the pathSegments so that the resulting gaps between these numbers match the given dataPaths.
 * E.g.
 *  * dataPaths: [["lorem.ipsum", "dolor"]], pathSegments: ["lorem", "ipsum", "123", "dolor"]
 *     --> [123]
 *  * dataPaths: [["lorem", "ipsum.dolor"]], pathSegments: ["lorem", "123", "ipsum"]
 *     --> [123]
 *  * dataPaths: [["lorem", "ipsum", "dolor"]], pathSegments: ["lorem", "123", "ipsum", "45"]
 *     --> [123, 45]
 * * dataPaths: [["lorem", "ipsum", "dolor"]], pathSegments: ["lorem", "123", "ipsum", "45", "dolor"]
 *     --> [123, 45]
 */
export const getIndicesFromDataPaths = (
  dataPaths: string[][],
  pathSegments: string[],
) => {
  let result: null | { dataPath: string[]; indices: number[] } = null;
  const isMoreSpecificMatch = (newIndices: number[]) => {
    return result === null || newIndices.length > result.indices.length;
  };
  for (const dependency of dataPaths) {
    const indices = testMatchesAndGetIndices(
      pathSegments,
      dependency.map(splitBy(".")),
    );
    if (indices && isMoreSpecificMatch(indices)) {
      result = { indices, dataPath: dependency };
    }
  }
  return result;
};
