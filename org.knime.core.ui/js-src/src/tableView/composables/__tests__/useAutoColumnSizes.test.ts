import { it, describe, expect, beforeEach } from "vitest";
import useAutoColumnSizes, {
  type UseAutoColumnSizesOptions,
} from "../useAutoColumnSizes";
import { ref, type Ref } from "vue";
import { AutoSizeColumnsToContent } from "@/tableView/types/ViewSettings";

describe("useColumnSizes", () => {
  let initialDataMock: UseAutoColumnSizesOptions, currentRowHeight: Ref<number>;

  beforeEach(() => {
    currentRowHeight = ref(80);
    initialDataMock = {
      settings: ref({
        autoSizeColumnsToContent: AutoSizeColumnsToContent.FIT_CONTENT,
      }),
      currentRowHeight,
      firstRowImageDimensions: ref({}),
    };
  });

  it("creates the correct auto size options when using FIXED", () => {
    initialDataMock.settings.value.autoSizeColumnsToContent =
      AutoSizeColumnsToContent.FIXED;
    const { autoColumnSizesActive, autoColumnSizesOptions } =
      useAutoColumnSizes(initialDataMock);

    expect(autoColumnSizesOptions.value).toStrictEqual({
      calculateForBody: false,
      calculateForHeader: false,
      fixedSizes: {},
    });
    expect(autoColumnSizesActive.value).toBeFalsy();
  });

  it("creates the correct auto size options when using FIT_CONTENT", () => {
    const { autoColumnSizesActive, autoColumnSizesOptions } =
      useAutoColumnSizes(initialDataMock);

    expect(autoColumnSizesOptions.value).toStrictEqual({
      calculateForBody: true,
      calculateForHeader: false,
      fixedSizes: {},
    });
    expect(autoColumnSizesActive.value).toBeTruthy();
  });

  it("creates the correct auto size options when using FIT_CONTENT_AND_HEADER", () => {
    initialDataMock.settings.value.autoSizeColumnsToContent =
      AutoSizeColumnsToContent.FIT_CONTENT_AND_HEADER;
    const { autoColumnSizesActive, autoColumnSizesOptions } =
      useAutoColumnSizes(initialDataMock);

    expect(autoColumnSizesOptions.value).toStrictEqual({
      calculateForBody: true,
      calculateForHeader: true,
      fixedSizes: {},
    });
    expect(autoColumnSizesActive.value).toBeTruthy();
  });

  it("updates the auto sizes and sets the initial update to true when calling onAutoColumnSizesUpdate", () => {
    initialDataMock.settings.value.autoSizeColumnsToContent =
      AutoSizeColumnsToContent.FIT_CONTENT;
    const { autoColumnSizes, onAutoColumnSizesUpdate } =
      useAutoColumnSizes(initialDataMock);

    const newAutoSizes = { col1: 55, col2: 66, col3: 77 };
    onAutoColumnSizesUpdate(newAutoSizes);

    expect(autoColumnSizes.value).toStrictEqual(newAutoSizes);
  });

  describe("correct column size of image columns based on the rowHeight and their initial dimension", () => {
    beforeEach(() => {
      initialDataMock.firstRowImageDimensions = ref({
        col1: { widthInPx: 150, heightInPx: 150 },
        col2: { widthInPx: 120, heightInPx: 150 },
        col3: { widthInPx: 150, heightInPx: 120 },
      });
    });

    it("sets the correct column sizes of image columns on row height update", () => {
      const { autoColumnSizesOptions } = useAutoColumnSizes(initialDataMock);

      const newRowHeight = 120;
      currentRowHeight.value = newRowHeight;
      expect(autoColumnSizesOptions.value).toStrictEqual({
        calculateForBody: true,
        calculateForHeader: false,
        fixedSizes: {
          col1: 119,
          col2: 95,
          col3: 148,
        },
      });
    });
  });

  it("prevents the image from getting bigger than their preferred dimension", () => {
    initialDataMock.firstRowImageDimensions = ref({
      col1: { widthInPx: 50, heightInPx: 150 },
      col2: { widthInPx: 150, heightInPx: 50 },
      col3: { widthInPx: 70, heightInPx: 70 },
    });
    const { autoColumnSizesOptions } = useAutoColumnSizes(initialDataMock);

    expect(autoColumnSizesOptions.value).toStrictEqual({
      calculateForBody: true,
      calculateForHeader: false,
      fixedSizes: {
        col1: 26,
        col2: 150,
        col3: 70,
      },
    });

    const newRowHeight = 120;
    currentRowHeight.value = newRowHeight;
    expect(autoColumnSizesOptions.value).toStrictEqual({
      calculateForBody: true,
      calculateForHeader: false,
      fixedSizes: {
        col1: 39,
        col2: 150,
        col3: 70,
      },
    });
  });
});
