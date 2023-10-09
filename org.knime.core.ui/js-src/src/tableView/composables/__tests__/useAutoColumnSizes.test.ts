import { it, describe, expect, beforeEach } from "vitest";
import useAutoColumnSizes, {
  type UseAutoColumnSizesOptions,
} from "../useAutoColumnSizes";
import { ref } from "vue";
import {
  AutoSizeColumnsToContent,
  RowHeightMode,
} from "@/tableView/types/ViewSettings";

describe("useColumnSizes", () => {
  let initialDataMock: UseAutoColumnSizesOptions;

  beforeEach(() => {
    initialDataMock = {
      settings: ref({
        autoSizeColumnsToContent: AutoSizeColumnsToContent.FIT_CONTENT,
        customRowHeight: 80,
        rowHeightMode: RowHeightMode.CUSTOM,
      }),
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

    it("creates the correct column sizes of image columns with small row height", () => {
      initialDataMock.settings.value.rowHeightMode = RowHeightMode.COMPACT;
      const { autoColumnSizesOptions } = useAutoColumnSizes(initialDataMock);

      expect(autoColumnSizesOptions.value).toStrictEqual({
        calculateForBody: true,
        calculateForHeader: false,
        fixedSizes: {
          col1: 24,
          col2: 19,
          col3: 30,
        },
      });
    });

    it("creates the correct column sizes of image columns with default row height", () => {
      initialDataMock.settings.value.rowHeightMode = RowHeightMode.DEFAULT;
      const { autoColumnSizesOptions } = useAutoColumnSizes(initialDataMock);

      expect(autoColumnSizesOptions.value).toStrictEqual({
        calculateForBody: true,
        calculateForHeader: false,
        fixedSizes: {
          col1: 40,
          col2: 32,
          col3: 50,
        },
      });
    });

    it("creates the correct column sizes of image columns with custom row height", () => {
      initialDataMock.settings.value.rowHeightMode = RowHeightMode.CUSTOM;
      initialDataMock.settings.value.customRowHeight = 80;
      const { autoColumnSizesOptions } = useAutoColumnSizes(initialDataMock);

      expect(autoColumnSizesOptions.value).toStrictEqual({
        calculateForBody: true,
        calculateForHeader: false,
        fixedSizes: {
          col1: 80,
          col2: 64,
          col3: 100,
        },
      });
    });

    it("sets the correct column sizes of image columns on row height update", () => {
      const { autoColumnSizesOptions, onRowHeightUpdate } =
        useAutoColumnSizes(initialDataMock);

      const newRowHeight = 120;
      onRowHeightUpdate(newRowHeight);
      expect(autoColumnSizesOptions.value).toStrictEqual({
        calculateForBody: true,
        calculateForHeader: false,
        fixedSizes: {
          col1: 120,
          col2: 96,
          col3: 150,
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
    const { autoColumnSizesOptions, onRowHeightUpdate } =
      useAutoColumnSizes(initialDataMock);

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
    onRowHeightUpdate(newRowHeight);
    expect(autoColumnSizesOptions.value).toStrictEqual({
      calculateForBody: true,
      calculateForHeader: false,
      fixedSizes: {
        col1: 40,
        col2: 150,
        col3: 70,
      },
    });
  });
});
