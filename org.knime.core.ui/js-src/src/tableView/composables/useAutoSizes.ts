import { type Ref, computed, ref } from "vue";

import { constants as tableConstants } from "@knime/knime-ui-table";

import { BORDER_BOTTOM_WIDTH } from "../constants";
import type {
  ColumnSizes,
  ImageDimension,
  TableViewDisplayProps,
} from "../types";
import { AutoSizeColumnsToContent, RowHeightMode } from "../types/ViewSettings";
import type { TableViewViewSettings } from "../types/ViewSettings";

const { MAX_AUTO_ROW_HEIGHT } = tableConstants;

type RelevantViewSettings = Pick<
  TableViewViewSettings,
  "autoSizeColumnsToContent" | "rowHeightMode"
>;
export interface UseAutoSizesOptions {
  settings: Ref<RelevantViewSettings>;
  firstRowImageDimensions: Ref<
    TableViewDisplayProps["firstRowImageDimensions"]
  >;
  currentRowHeight: Ref<number>;
  enableDynamicRowHeight: Ref<boolean>;
}

export default ({
  settings,
  firstRowImageDimensions,
  currentRowHeight,
  enableDynamicRowHeight,
}: UseAutoSizesOptions) => {
  const autoColumnSizes: Ref<ColumnSizes> = ref({});

  /**
   * The TableUI sets a custom border at the bottom of each row decreasing the
   * available space for the cell.
   */
  const innerRowHeight = computed(
    () => currentRowHeight.value - BORDER_BOTTOM_WIDTH,
  );

  const autoColumnSizesActive = computed(() => {
    return (
      settings.value.autoSizeColumnsToContent !== AutoSizeColumnsToContent.FIXED
    );
  });

  const includeHeadersInAutoColumnSizes = computed(
    () =>
      settings.value.autoSizeColumnsToContent ===
      AutoSizeColumnsToContent.FIT_CONTENT_AND_HEADER,
  );

  const getImageAutoSizeWidthFromHeight = (
    height: number,
    imageDimension: ImageDimension,
  ) => {
    const { widthInPx, heightInPx } = imageDimension;
    return Math.min(Math.floor((widthInPx * height) / heightInPx), widthInPx);
  };

  const scaleToMaxAutoRowHeight = (
    imageDimension: ImageDimension,
  ): ImageDimension => {
    const scaledHeight = Math.min(
      MAX_AUTO_ROW_HEIGHT,
      imageDimension.heightInPx,
    );
    const scaledWidth = getImageAutoSizeWidthFromHeight(
      scaledHeight,
      imageDimension,
    );
    return {
      widthInPx: scaledWidth,
      heightInPx: scaledHeight,
    };
  };

  const fixedSizes = computed(() => {
    const fixedColumnSizes: ColumnSizes = {};
    const fixedRowHeights: ColumnSizes = {};
    // calculate the size of an img column by the ratio of the original img and the current row height
    Object.entries(firstRowImageDimensions.value).forEach(
      ([columnName, imageDimension]: [string, ImageDimension]) => {
        if (settings.value.rowHeightMode === RowHeightMode.AUTO) {
          // height is variable but only up to a max auto row height in some cases.
          const { widthInPx, heightInPx } = enableDynamicRowHeight.value
            ? imageDimension
            : scaleToMaxAutoRowHeight(imageDimension);
          fixedColumnSizes[columnName] = widthInPx;
          fixedRowHeights[columnName] = heightInPx;
        } else {
          // height is fixed to innerRowHeight. The width is calculated by the ratio of the image
          const height = innerRowHeight.value;
          fixedColumnSizes[columnName] = getImageAutoSizeWidthFromHeight(
            height,
            imageDimension,
          );
        }
      },
    );
    return { fixedColumnSizes, fixedRowHeights };
  });

  const onAutoColumnSizesUpdate = (newAutoColumnSizes: ColumnSizes) => {
    autoColumnSizes.value = newAutoColumnSizes;
  };

  const autoColumnSizesOptions = computed(() => ({
    calculateForBody: autoColumnSizesActive.value,
    calculateForHeader: includeHeadersInAutoColumnSizes.value,
    fixedSizes: fixedSizes.value.fixedColumnSizes,
  }));

  const autoRowHeightsActive = computed(
    () => settings.value.rowHeightMode === RowHeightMode.AUTO,
  );

  const autoRowHeightOptions = computed(() => ({
    calculate: autoRowHeightsActive.value,
    fixedHeights: fixedSizes.value.fixedRowHeights,
  }));

  return {
    autoColumnSizes,
    autoColumnSizesActive,
    autoColumnSizesOptions,
    autoRowHeightOptions,
    onAutoColumnSizesUpdate,
  };
};
