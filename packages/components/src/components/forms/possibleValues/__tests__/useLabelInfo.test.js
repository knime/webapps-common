import { describe, it, expect, beforeEach } from "vitest";
import { ref } from "vue";
import { useLabelInfo } from "../useLabelInfo";

describe("useLabelInfo.ts", () => {
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

  it("provides labelInfo", () => {
    const possibleValues = ref(defaultPossibleValues);
    const filteredValues = ref([
      { id: "leon", text: "Goretzka" },
      { id: "matthias", text: "Ginter" },
      { id: "kai", text: "Havertz" },
    ]);

    const firstLabelInfos = useLabelInfo(
      filteredValues,
      possibleValues.value.length,
    ); // with two arguments
    expect(firstLabelInfos).toBe("3 of 10 entries");

    const selectedValues = ref(["matthias", "niklas", "kai", "leon"]);
    const secondLabelInfos = useLabelInfo(
      filteredValues,
      possibleValues.value.length,
      selectedValues,
    ); // with three arguments
    expect(secondLabelInfos).toBe("3 of 10 entries [ 4 selected ]");
  });

  it("returns 0 numFiltersValues if it receives empty filteredValues or null", () => {
    const possibleValues = ref(defaultPossibleValues);
    const filteredValues = ref([]); // empty array as filteredValues

    const firstLabelInfos = useLabelInfo(
      filteredValues,
      possibleValues.value.length,
    ); // with two arguments
    expect(firstLabelInfos).toBe("0 of 10 entries");

    const selectedValues = ref(["matthias", "niklas", "kai", "leon"]);
    const thirdLabelInfos = useLabelInfo(
      filteredValues,
      possibleValues.value.length,
      selectedValues,
    ); // with three arguments
    expect(thirdLabelInfos).toBe("0 of 10 entries [ 4 selected ]");

    filteredValues.value = null; // null as filteredValues
    const secondLabelInfos = useLabelInfo(
      filteredValues,
      possibleValues.value.length,
    ); // with two arguments
    expect(secondLabelInfos).toBe("0 of 10 entries");

    const fourthLabelInfos = useLabelInfo(
      filteredValues,
      possibleValues.value.length,
      selectedValues,
    ); // with three arguments
    expect(fourthLabelInfos).toBe("0 of 10 entries [ 4 selected ]");

    filteredValues.value = undefined; // undefined as filteredValues

    const fifthLabelInfos = useLabelInfo(
      filteredValues,
      possibleValues.value.length,
    ); // with two arguments
    expect(fifthLabelInfos).toBe("0 of 10 entries");

    const sixthLabelInfos = useLabelInfo(
      filteredValues,
      possibleValues.value.length,
      selectedValues,
    ); // with three arguments
    expect(sixthLabelInfos).toBe("0 of 10 entries [ 4 selected ]");
  });

  it("returns 0 numSelectedValues if it receives empty selectedValues or null", () => {
    const possibleValues = ref(defaultPossibleValues);
    const filteredValues = ref([
      { id: "leon", text: "Goretzka" },
      { id: "matthias", text: "Ginter" },
      { id: "kai", text: "Havertz" },
    ]);

    const selectedValues = ref([]); // empty array as selectedValues
    const firstLabelInfos = useLabelInfo(
      filteredValues,
      possibleValues.value.length,
      selectedValues,
    ); // with three arguments
    expect(firstLabelInfos).toBe("3 of 10 entries [ 0 selected ]");

    selectedValues.value = null; // null as selectedValues
    const secondLabelInfos = useLabelInfo(
      filteredValues,
      possibleValues.value.length,
      selectedValues,
    ); // with three arguments
    expect(secondLabelInfos).toBe("3 of 10 entries [ 0 selected ]");

    selectedValues.value = undefined; // null as selectedValues
    const fourthLabelInfos = useLabelInfo(
      filteredValues,
      possibleValues.value.length,
      selectedValues,
    ); // with three arguments
    expect(fourthLabelInfos).toBe("3 of 10 entries [ 0 selected ]");
  });

  it("behaves fault tolerant", () => {
    const possibleValues = ref([
      { id: "leon", text: "Goretzka" },
      { id: "matthias", text: "Ginter" },
      { id: "kai", text: "Havertz" },
    ]);
    const filteredValues = ref(defaultPossibleValues);

    const firstLabelInfos = useLabelInfo(
      filteredValues,
      possibleValues.value.length,
    ); // with two arguments

    expect(firstLabelInfos).toBe("10 of 3 entries");

    const selectedValues = ref(["matthias", "niklas", "kai", "leon"]);

    const secondLabelInfos = useLabelInfo(
      filteredValues,
      possibleValues.value.length,
      selectedValues,
    ); // with three arguments

    expect(secondLabelInfos).toBe("10 of 3 entries [ 4 selected ]");
  });
});
