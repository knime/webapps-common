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

  it("provides unSelected values you can check in Twinlist", () => {
    let props = {
      possibleValues: defaultPossibleValues,
      modelValue: ["Bag"],
      initialSearchTerm: "",
      showSearch: true,
      initialCaseSensitive: false,
      filterChosenValuesOnPossibleValuesChange: true,
    };
    const possible = computed(() => {
      return props.possibleValues;
    });
    const caseSensitiveSearch = ref(props.initialCaseSensitive);
    const searchTerm = ref(props.initialSearchTerm);
    const chosenValues = ref(props.modelValue);
    const modelValue = computed(() => {
      return props.modelValue;
    });
    const { unSelectedItems } = useSearch(
      props.filterChosenValuesOnPossibleValuesChange,
      chosenValues,
      possible,
      modelValue,
      caseSensitiveSearch,
      props.showSearch,
      searchTerm,
    );
    expect(unSelectedItems.value.length).toBe(2);
  });

  it("provides filtered unSelected values you can check in Twinlist", () => {
    let props = {
      possibleValues: defaultPossibleValues,
      modelValue: ["Bag"],
      initialSearchTerm: "t",
      showSearch: true,
      initialCaseSensitive: false,
      filterChosenValuesOnPossibleValuesChange: true,
    };
    const possible = computed(() => {
      return props.possibleValues;
    });
    const caseSensitiveSearch = ref(props.initialCaseSensitive);
    const searchTerm = ref(props.initialSearchTerm);
    const chosenValues = ref(props.modelValue);
    const modelValue = computed(() => {
      return props.modelValue;
    });
    const { unSelectedItems } = useSearch(
      props.filterChosenValuesOnPossibleValuesChange,
      chosenValues,
      possible,
      modelValue,
      caseSensitiveSearch,
      props.showSearch,
      searchTerm,
    );
    expect(unSelectedItems.value.length).toBe(1);
  });

  it("provides selected values you can check in Twinlist", () => {
    let props = {
      possibleValues: defaultPossibleValues,
      modelValue: ["Bag"],
      initialSearchTerm: "",
      showSearch: true,
      initialCaseSensitive: false,
      filterChosenValuesOnPossibleValuesChange: true,
    };
    const possible = computed(() => {
      return props.possibleValues;
    });
    const caseSensitiveSearch = ref(props.initialCaseSensitive);
    const searchTerm = ref(props.initialSearchTerm);
    const chosenValues = ref(props.modelValue);
    const modelValue = computed(() => {
      return props.modelValue;
    });
    const obj = useSearch(
      props.filterChosenValuesOnPossibleValuesChange,
      chosenValues,
      possible,
      modelValue,
      caseSensitiveSearch,
      props.showSearch,
      searchTerm,
    );
    expect(obj.selectedItems.value.length).toBe(1);
    searchTerm.value = "q";
    const obj1 = useSearch(
      props.filterChosenValuesOnPossibleValuesChange,
      chosenValues,
      possible,
      modelValue,
      caseSensitiveSearch,
      props.showSearch,
      searchTerm,
    );
    expect(obj1.selectedItems.value.length).toBe(0);
  });

  it("provides filtered selected values you can check in Twinlist", () => {
    let props = {
      possibleValues: defaultPossibleValues,
      modelValue: ["Bag", "table"],
      initialSearchTerm: "t",
      showSearch: true,
      initialCaseSensitive: false,
      filterChosenValuesOnPossibleValuesChange: true,
    };
    const possible = computed(() => {
      return props.possibleValues;
    });
    const caseSensitiveSearch = ref(props.initialCaseSensitive);
    const searchTerm = ref(props.initialSearchTerm);
    const chosenValues = ref(props.modelValue);
    const modelValue = computed(() => {
      return props.modelValue;
    });
    const { selectedItems } = useSearch(
      props.filterChosenValuesOnPossibleValuesChange,
      chosenValues,
      possible,
      modelValue,
      caseSensitiveSearch,
      props.showSearch,
      searchTerm,
    );
    expect(selectedItems.value.length).toBe(1);
    searchTerm.value = "q";
    const obj1 = useSearch(
      props.filterChosenValuesOnPossibleValuesChange,
      chosenValues,
      possible,
      modelValue,
      caseSensitiveSearch,
      props.showSearch,
      searchTerm,
    );
    expect(obj1.selectedItems.value.length).toBe(0);
  });

  it("provides concatenatedItems you can check SearchableList or searchableCheckboxes", () => {
    let props = {
      possibleValues: defaultPossibleValues,
      modelValue: ["Bag", "table"],
      initialSearchTerm: "",
      showSearch: true,
      initialCaseSensitive: false,
      filterChosenValuesOnPossibleValuesChange: true,
    };
    const possible = computed(() => {
      return props.possibleValues;
    });
    const caseSensitiveSearch = ref(props.initialCaseSensitive);
    const searchTerm = ref(props.initialSearchTerm);
    const chosenValues = ref(props.modelValue);
    const modelValue = computed(() => {
      return props.modelValue;
    });
    const { concatenatedItems } = useSearch(
      props.filterChosenValuesOnPossibleValuesChange,
      chosenValues,
      possible,
      modelValue,
      caseSensitiveSearch,
      props.showSearch,
      searchTerm,
    );
    expect(concatenatedItems.value.length).toBe(3);
  });

  it("provides filtered concatenatedItems ", () => {
    let props = {
      possibleValues: defaultPossibleValues,
      modelValue: ["Bag", "table"],
      initialSearchTerm: "t",
      showSearch: true,
      initialCaseSensitive: false,
      filterChosenValuesOnPossibleValuesChange: true,
    };
    const possible = computed(() => {
      return props.possibleValues;
    });
    const caseSensitiveSearch = ref(props.initialCaseSensitive);
    const searchTerm = ref(props.initialSearchTerm);
    const chosenValues = ref(props.modelValue);
    const modelValue = computed(() => {
      return props.modelValue;
    });
    const obj1 = useSearch(
      props.filterChosenValuesOnPossibleValuesChange,
      chosenValues,
      possible,
      modelValue,
      caseSensitiveSearch,
      props.showSearch,
      searchTerm,
    );
    expect(obj1.concatenatedItems.value.length).toBe(1);
    searchTerm.value = "q"; // this term is not provided in the possibleItems or modelValue
    const obj2 = useSearch(
      props.filterChosenValuesOnPossibleValuesChange,
      chosenValues,
      possible,
      modelValue,
      caseSensitiveSearch,
      props.showSearch,
      searchTerm,
    );
    expect(obj2.concatenatedItems.value.length).toBe(0);
  });
});
