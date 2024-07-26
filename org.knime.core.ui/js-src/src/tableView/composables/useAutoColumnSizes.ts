import type {
  TableViewDisplayProps,
  ImageDimension,
  ColumnSizes,
} from "../types";
import { computed, ref, type Ref } from "vue";
import { AutoSizeColumnsToContent, RowHeightMode } from "../types/ViewSettings";
import type TableViewViewSettings from "../types/ViewSettings";
import { BORDER_BOTTOM_WIDTH } from "../constants";

type RelevantViewSettings = Pick<
  TableViewViewSettings,
  "autoSizeColumnsToContent"
>;
export interface UseAutoColumnSizesOptions {
  settings: Ref<RelevantViewSettings>;
  firstRowImageDimensions: Ref<
    TableViewDisplayProps["firstRowImageDimensions"]
  >;
  currentRowHeight: Ref<number>;
  hasDynamicRowHeight: Ref<boolean>;
}

export default ({
  settings,
  firstRowImageDimensions,
  currentRowHeight,
  hasDynamicRowHeight,
}: UseAutoColumnSizesOptions) => {
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

  const autoRowHeightsActive = computed(
    () => settings.value.rowHeightMode === RowHeightMode.AUTO,
  );

  const includeHeadersInAutoColumnSizes = computed(
    () =>
      settings.value.autoSizeColumnsToContent ===
      AutoSizeColumnsToContent.FIT_CONTENT_AND_HEADER,
  );

  const fixedColumnSizes = computed(() => {
    const fixedColumnSizes: ColumnSizes = {};
    // calculate the size of an img column by the ratio of the original img and the current row height
    Object.entries(firstRowImageDimensions.value).forEach(
      ([columnName, imageDimension]: [string, ImageDimension]) => {
        const { widthInPx, heightInPx } = imageDimension;
        const autoSizeWidth = hasDynamicRowHeight.value
          ? widthInPx
          : Math.floor((widthInPx * innerRowHeight.value) / heightInPx);
        fixedColumnSizes[columnName] = Math.min(autoSizeWidth, widthInPx);
      },
    );
    return fixedColumnSizes;
  });

  const onAutoColumnSizesUpdate = (newAutoColumnSizes: ColumnSizes) => {
    autoColumnSizes.value = newAutoColumnSizes;
  };

  const autoColumnSizesOptions = computed(() => ({
    calculateForBody: autoColumnSizesActive.value,
    calculateForHeader: includeHeadersInAutoColumnSizes.value,
    fixedSizes: fixedColumnSizes.value,
  }));

  const autoRowHeightOptions = computed(() => ({
    calculate: autoRowHeightsActive.value,
    fixedHeights: {},
  }));

  return {
    autoColumnSizes,
    autoColumnSizesActive,
    autoColumnSizesOptions,
    autoRowHeightOptions,
    onAutoColumnSizesUpdate,
  };
};
