import { beforeEach, describe, expect, it } from "vitest";
import { type Ref, ref } from "vue";

import {
  AutoSizeColumnsToContent,
  RowHeightMode,
} from "@/tableView/types/ViewSettings";
import useAutoSizes, { type UseAutoSizesOptions } from "../useAutoSizes";

describe("useAutoSizes", () => {
  let initialDataMock: UseAutoSizesOptions, currentRowHeight: Ref<number>;

  beforeEach(() => {
    currentRowHeight = ref(80);
    initialDataMock = {
      settings: ref({
        autoSizeColumnsToContent: AutoSizeColumnsToContent.FIT_CONTENT,
        rowHeightMode: RowHeightMode.AUTO,
      }),
      currentRowHeight,
      firstRowImageDimensions: ref({}),
      enableDynamicRowHeight: ref(false),
    };
  });

  it("creates the correct auto size options when using FIXED", () => {
    initialDataMock.settings.value.autoSizeColumnsToContent =
      AutoSizeColumnsToContent.FIXED;
    const { autoColumnSizesActive, autoColumnSizesOptions } =
      useAutoSizes(initialDataMock);

    expect(autoColumnSizesOptions.value).toStrictEqual({
      calculateForBody: false,
      calculateForHeader: false,
      fixedSizes: {},
    });
    expect(autoColumnSizesActive.value).toBeFalsy();
  });

  it("creates the correct auto size options when using FIT_CONTENT", () => {
    const { autoColumnSizesActive, autoColumnSizesOptions } =
      useAutoSizes(initialDataMock);

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
      useAutoSizes(initialDataMock);

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
      useAutoSizes(initialDataMock);

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
      initialDataMock.settings.value.rowHeightMode = RowHeightMode.CUSTOM;
      const { autoColumnSizesOptions } = useAutoSizes(initialDataMock);

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

    it("sets the correct column sizes of image columns on automatic fixed row height", () => {
      const { autoColumnSizesOptions } = useAutoSizes(initialDataMock);

      expect(autoColumnSizesOptions.value).toStrictEqual({
        calculateForBody: true,
        calculateForHeader: false,
        fixedSizes: {
          col1: 120,
          col2: 96, // 120 (max row height) / 150 (height) * 120 (width)
          col3: 150,
        },
      });
    });

    it("sets the correct column sizes of image columns on automatic dynamic row height", () => {
      initialDataMock.enableDynamicRowHeight.value = true;
      const { autoColumnSizesOptions } = useAutoSizes(initialDataMock);

      expect(autoColumnSizesOptions.value).toStrictEqual({
        calculateForBody: true,
        calculateForHeader: false,
        fixedSizes: {
          col1: 150,
          col2: 120,
          col3: 150,
        },
      });
    });
  });

  it("prevents the image from getting bigger than their preferred dimension", () => {
    initialDataMock.settings.value.rowHeightMode = RowHeightMode.CUSTOM;
    initialDataMock.firstRowImageDimensions = ref({
      col1: { widthInPx: 50, heightInPx: 150 },
      col2: { widthInPx: 150, heightInPx: 50 },
      col3: { widthInPx: 70, heightInPx: 70 },
    });
    const { autoColumnSizesOptions } = useAutoSizes(initialDataMock);

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
