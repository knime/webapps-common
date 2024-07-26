import { constants } from "@knime/knime-ui-table";
import { ref } from "vue";
import type TableViewViewSettings from "../types/ViewSettings";
import { RowHeightMode } from "../types/ViewSettings";

type RelevantViewSettings = Pick<
  TableViewViewSettings,
  "customRowHeight" | "rowHeightMode" | "verticalPaddingMode"
>;

export const getCustomRowHeight = ({
  customRowHeight,
}: Pick<RelevantViewSettings, "customRowHeight">) => {
  return Math.max(customRowHeight, constants.DEFAULT_ROW_HEIGHT);
};

export const getInitialRowHeight = (settings: RelevantViewSettings) => {
  switch (settings.rowHeightMode) {
    case RowHeightMode.AUTO:
      return constants.DEFAULT_ROW_HEIGHT;
    case RowHeightMode.CUSTOM:
      return getCustomRowHeight(settings);
    default:
      return constants.DEFAULT_ROW_HEIGHT;
  }
};

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
