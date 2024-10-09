import { beforeEach, describe, expect, it } from "vitest";
import { ref } from "vue";

import useSearch from "../useSearch";

describe("useSearch.ts", () => {
  let defaultPossibleValues;

  beforeEach(() => {
    defaultPossibleValues = [
      { id: "manuel", text: "Neuer" },
      { id: "toni", text: "Kroos" },
      { id: "leroy", text: "Sané" },
      { id: "joshua", text: "Kimmich" },
      { id: "serge", text: "Gnabry" },
      { id: "thomas", text: "Müller" },
      { id: "leon", text: "Goretzka" },
      { id: "matthias", text: "Ginter" },
      { id: "niklas", text: "Süle" },
      { id: "kai", text: "Havertz" },
    ];
  });

  it("provides filtered values with correct values", () => {
    const availableValues = ref(defaultPossibleValues);
    const caseSensitiveSearch = ref(false);
    const searchTerm = ref("t");

    const firstSample = useSearch(
      searchTerm,
      caseSensitiveSearch,
      availableValues,
    );

    expect(firstSample.value).toStrictEqual([
      { id: "leon", text: "Goretzka" },
      { id: "matthias", text: "Ginter" },
      { id: "kai", text: "Havertz" },
    ]);

    searchTerm.value = "q"; // this term is not provided in the possibleValues
    const secondSample = useSearch(
      searchTerm,
      caseSensitiveSearch,
      availableValues,
    );
    expect(secondSample.value).toStrictEqual([]);
  });

  it("applies the caseSensitivity", () => {
    const availableValues = ref(defaultPossibleValues);
    const caseSensitiveSearch = ref(true);
    const searchTerm = ref("k");

    const filteredValues = useSearch(
      searchTerm,
      caseSensitiveSearch,
      availableValues,
    );
    expect(filteredValues.value).toStrictEqual([
      { id: "leon", text: "Goretzka" },
    ]);

    caseSensitiveSearch.value = false; // toggle caseSensitivity

    expect(filteredValues.value).toStrictEqual([
      { id: "toni", text: "Kroos" },
      { id: "joshua", text: "Kimmich" },
      { id: "leon", text: "Goretzka" },
    ]);
  });

  it("returns empty array if it receives empty possibleValues or null", () => {
    const availableValues = ref([]);
    const caseSensitiveSearch = ref(false);
    const searchTerm = ref("t");

    const filteredValues = useSearch(
      searchTerm,
      caseSensitiveSearch,
      availableValues,
    );

    expect(filteredValues.value).toStrictEqual([]);

    availableValues.value = null;

    expect(filteredValues.value).toStrictEqual([]);

    availableValues.value = undefined;
    expect(filteredValues.value).toStrictEqual([]);
  });

  it("returns default possibleValues if receives empty searchTerm or null", () => {
    const availableValues = ref(defaultPossibleValues);
    const caseSensitiveSearch = ref(false);
    const searchTerm = ref("");

    const filteredValues = useSearch(
      searchTerm,
      caseSensitiveSearch,
      availableValues,
    );
    expect(filteredValues.value).toStrictEqual(defaultPossibleValues);

    searchTerm.value = null;

    expect(filteredValues.value).toStrictEqual(defaultPossibleValues);

    searchTerm.value = undefined;

    expect(filteredValues.value).toStrictEqual(defaultPossibleValues);
  });
});
