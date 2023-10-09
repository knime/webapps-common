import { constants } from "@knime/knime-ui-table";
import type {
  TableViewDisplayProps,
  ImageDimension,
  ColumnSizes,
} from "../types";
import { computed, ref, watch, type Ref } from "vue";
import { AutoSizeColumnsToContent, RowHeightMode } from "../types/ViewSettings";
import type TableViewViewSettings from "../types/ViewSettings";

type RelevantViewSettings = Pick<
  TableViewViewSettings,
  "autoSizeColumnsToContent" | "customRowHeight" | "rowHeightMode"
>;
export interface UseAutoColumnSizesOptions {
  settings: Ref<RelevantViewSettings>;
  firstRowImageDimensions: Ref<
    TableViewDisplayProps["firstRowImageDimensions"]
  >;
}

const getInitialRowHeight = (settings: RelevantViewSettings) => {
  switch (settings.rowHeightMode) {
    case RowHeightMode.COMPACT:
      return constants.COMPACT_ROW_HEIGHT;
    case RowHeightMode.CUSTOM:
      return settings.customRowHeight;
    default:
      return constants.DEFAULT_ROW_HEIGHT;
  }
};

export default ({
  settings,
  firstRowImageDimensions,
}: UseAutoColumnSizesOptions) => {
  const currentRowHeight = ref(0);
  const initialRowHeight = computed(() => getInitialRowHeight(settings.value));
  const autoColumnSizes: Ref<ColumnSizes> = ref({});

  watch(
    () => initialRowHeight.value,
    () => {
      currentRowHeight.value = initialRowHeight.value;
    },
    { immediate: true },
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
