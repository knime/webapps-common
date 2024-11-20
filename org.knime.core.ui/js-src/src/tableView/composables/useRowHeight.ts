import { ref } from "vue";

import { constants } from "@knime/knime-ui-table";

import type { TableViewViewSettings } from "../types/ViewSettings";
import { RowHeightMode, VerticalPaddingMode } from "../types/ViewSettings";

type RelevantViewSettings = Pick<
  TableViewViewSettings,
  "customRowHeight" | "rowHeightMode" | "verticalPaddingMode"
>;

const getRowHeightByVerticalPadding = (
  verticalPaddingMode: VerticalPaddingMode,
) =>
  verticalPaddingMode === VerticalPaddingMode.DEFAULT
    ? constants.DEFAULT_ROW_HEIGHT
    : constants.COMPACT_ROW_HEIGHT;

export const getCustomRowHeight = ({
  customRowHeight,
}: Pick<RelevantViewSettings, "customRowHeight">) => {
  return Math.max(customRowHeight, constants.MIN_ROW_HEIGHT);
};

export const getInitialRowHeight = (settings: RelevantViewSettings) =>
  settings.rowHeightMode === RowHeightMode.CUSTOM
    ? getCustomRowHeight(settings)
    : getRowHeightByVerticalPadding(settings.verticalPaddingMode);

export default () => {
  const currentRowHeight = ref(constants.DEFAULT_ROW_HEIGHT);

  const setRowHeightSettings = (settings: RelevantViewSettings) => {
    currentRowHeight.value = getInitialRowHeight(settings);
  };

  const onRowHeightChange = (rowHeight: number | "dynamic" | null) => {
    if (typeof rowHeight === "number") {
      currentRowHeight.value = rowHeight;
    }
  };

  return { currentRowHeight, setRowHeightSettings, onRowHeightChange };
};
