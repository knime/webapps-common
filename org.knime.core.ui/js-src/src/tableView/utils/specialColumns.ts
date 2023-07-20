// @ts-ignore
import { constants as tableUIConstants } from "@knime/knime-ui-table";

const { MIN_COLUMN_SIZE } = tableUIConstants;
export default {
  INDEX: {
    name: "#",
    defaultSize: MIN_COLUMN_SIZE,
    id: Symbol("Index"),
  },
  ROW_ID: {
    name: "RowID",
    defaultSize: MIN_COLUMN_SIZE,
    id: Symbol("RowID"),
  },
  SKIPPED_REMAINING_COLUMNS_COLUMN: {
    name: "(skipped remaining columns)",
    defaultSize: 200,
    id: Symbol("Remaining columns"),
  },
};
