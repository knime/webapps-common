import { DEFAULT_IMAGE_ROW_HEIGHT } from "@/tableView/utils/getDataConfig";
import {
  type TableViewDisplayProps,
  type ImageDimension,
  AutoSizeColumnsToContent,
  type ColumnSizes,
} from "../types";
import { computed, ref, type Ref } from "vue";

export interface UseAutoColumnSizesOptions {
  settings: Ref<
    Pick<TableViewDisplayProps["settings"], "autoSizeColumnsToContent">
  >;
  firstRowImageDimensions: Ref<
    TableViewDisplayProps["firstRowImageDimensions"]
  >;
}

export default ({
  settings,
  firstRowImageDimensions,
}: UseAutoColumnSizesOptions) => {
  const currentRowHeight = ref(DEFAULT_IMAGE_ROW_HEIGHT);
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

  const onRowHeightUpdate = (rowHeight: number) => {
    currentRowHeight.value = rowHeight;
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
    onRowHeightUpdate,
  };
};
