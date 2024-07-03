import { describe, it, expect, beforeEach } from "vitest";
import { useSearch } from "../useSearch";
import { ref } from "vue";

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

    expect(firstSample).toStrictEqual([
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
    expect(secondSample).toStrictEqual([]);
  });

  it("applies the caseSensitivity", () => {
    const availableValues = ref(defaultPossibleValues);
    const caseSensitiveSearch = ref(true);
    const searchTerm = ref("k");

    const firstSample = useSearch(
      searchTerm,
      caseSensitiveSearch,
      availableValues,
    );
    expect(firstSample).toStrictEqual([{ id: "leon", text: "Goretzka" }]);

    caseSensitiveSearch.value = false; // toggle caseSensitivity
    const secondSample = useSearch(
      searchTerm,
      caseSensitiveSearch,
      availableValues,
    );
    expect(secondSample).toStrictEqual([
      { id: "toni", text: "Kroos" },
      { id: "joshua", text: "Kimmich" },
      { id: "leon", text: "Goretzka" },
    ]);
  });

  it("returns empty array if it receives empty possibleValues or null", () => {
    const availableValues = ref([]);
    const caseSensitiveSearch = ref(false);
    const searchTerm = ref("t");

    const firstSample = useSearch(
      searchTerm,
      caseSensitiveSearch,
      availableValues,
    );

    expect(firstSample).toStrictEqual([]);

    availableValues.value = null;
    const secondSample = useSearch(
      searchTerm,
      caseSensitiveSearch,
      availableValues,
    );
    expect(secondSample).toStrictEqual([]);

    availableValues.value = undefined;
    const thirdSample = useSearch(
      searchTerm,
      caseSensitiveSearch,
      availableValues,
    );
    expect(thirdSample).toStrictEqual([]);
  });

  it("returns default possibleValues if receives empty searchTerm or null", () => {
    const availableValues = ref(defaultPossibleValues);
    const caseSensitiveSearch = ref(false);
    const searchTerm = ref("");

    const firstSample = useSearch(
      searchTerm,
      caseSensitiveSearch,
      availableValues,
    );
    expect(firstSample).toStrictEqual(defaultPossibleValues);

    searchTerm.value = null;
    const secondSample = useSearch(
      searchTerm,
      caseSensitiveSearch,
      availableValues,
    );
    expect(secondSample).toStrictEqual(defaultPossibleValues);

    searchTerm.value = undefined;
    const thirdSample = useSearch(
      searchTerm,
      caseSensitiveSearch,
      availableValues,
    );
    expect(thirdSample).toStrictEqual(defaultPossibleValues);
  });
});
