import type {
  TableViewDisplayProps,
  ImageDimension,
  ColumnSizes,
} from "../types";
import { computed, ref, type Ref } from "vue";
import { AutoSizeColumnsToContent } from "../types/ViewSettings";
import type TableViewViewSettings from "../types/ViewSettings";

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
}

export default ({
  settings,
  firstRowImageDimensions,
  currentRowHeight,
}: UseAutoColumnSizesOptions) => {
  const autoColumnSizes: Ref<ColumnSizes> = ref({});

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

  const fixedColumnSizes = computed(() => {
    const fixedColumnSizes: ColumnSizes = {};
    // calculate the size of an img column by the ratio of the original img and the current row height
    Object.entries(firstRowImageDimensions.value).forEach(
      ([columnName, imageDimension]: [string, ImageDimension]) => {
        const { widthInPx, heightInPx } = imageDimension;
        const autoSizeWidth = Math.floor(
          (widthInPx * currentRowHeight.value) / heightInPx,
        );
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

  return {
    autoColumnSizes,
    autoColumnSizesActive,
    autoColumnSizesOptions,
    onAutoColumnSizesUpdate,
  };
};
