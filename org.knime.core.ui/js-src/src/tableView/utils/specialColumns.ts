// @ts-ignore
import { constants as tableUIConstants } from "@knime/knime-ui-table";

const { MIN_COLUMN_SIZE } = tableUIConstants;
const specialColumns = {
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

export default specialColumns;

export const separateSpecialColumns = (columnIds: (string | symbol)[]) => {
  const columnNames: string[] = [];
  const containedSpecialColumns: Set<keyof typeof specialColumns> = new Set();
  columnIds.forEach((id) => {
    if (typeof id === "string") {
      columnNames.push(id);
    }
    (Object.keys(specialColumns) as (keyof typeof specialColumns)[]).forEach(
      (key) => {
        if (id === specialColumns[key].id) {
          containedSpecialColumns.add(key);
        }
      },
    );
  });
  return { columnNames, containedSpecialColumns };
};
