import { describe, it, expect, beforeEach } from "vitest";
import useSearch from "../useSearch";
import { ref, computed } from "vue";

describe("useSearch.ts", () => {
  let defaultPossibleValues;

  beforeEach(() => {
    defaultPossibleValues = [
      {
        id: "book",
        text: "book",
      },
      {
        id: "Table",
        text: "Table",
      },
      {
        id: "Bag",
        text: "Bag",
      },
    ];
  });

  it("provides filtered values ", () => {
    let props = {
      possibleValues: defaultPossibleValues,
      modelValue: ["Bag", "table"],
      initialSearchTerm: "t",
      initialCaseSensitive: false,
    };
    const possible = computed(() => {
      return props.possibleValues;
    });
    const caseSensitiveSearch = ref(props.initialCaseSensitive);
    const searchTerm = ref(props.initialSearchTerm);

    const { filteredValues: firstSample } = useSearch(
      searchTerm,
      caseSensitiveSearch,
      possible,
    );

    expect(firstSample.value.length).toBe(1);

    searchTerm.value = "q"; // this term is not provided in the possibleItems or modelValue

    const { filteredValues: secondSample } = useSearch(
      searchTerm,
      caseSensitiveSearch,
      possible,
    );
    expect(secondSample.value.length).toBe(0);
  });
});
