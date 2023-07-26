// @ts-ignore
import { constants as tableUIConstants } from "@knime/knime-ui-table";
const { MIN_COLUMN_SIZE } = tableUIConstants as { MIN_COLUMN_SIZE: number };

import specialColumns from "./specialColumns";
const { INDEX, ROW_ID, SKIPPED_REMAINING_COLUMNS_COLUMN } = specialColumns;

const DEFAULT_COLUMN_SIZE = 100;
const SKIPPED_REMAINING_COLUMNS_COLUMN_MIN_WIDTH = 200;

const getDataColumnSizes = ({
  availableSpace,
  displayedColumns,
  columnSizeOverrides,
  defaultColumnSizeOverride,
}: {
  availableSpace: number;
  displayedColumns: string[];
  columnSizeOverrides: Record<string, number>;
  defaultColumnSizeOverride?: number;
}) => {
  const defaultColumnSize = Math.max(
    DEFAULT_COLUMN_SIZE,
    availableSpace / displayedColumns.length,
  );
  const currentDefaultColumnSize =
    defaultColumnSizeOverride || defaultColumnSize;
  return displayedColumns.reduce((columnSizes, columnName) => {
    columnSizes.push(
      columnSizeOverrides[columnName] || currentDefaultColumnSize,
    );
    return columnSizes;
  }, [] as number[]);
};

const stretchOneColumnToFillAvailableSpace = ({
  columnSizes,
  index,
  availableSpace,
}: {
  columnSizes: number[];
  index: number;
  availableSpace: number;
}) => {
  const totalSize = columnSizes.reduce((sum, size) => sum + size, 0);
  if (totalSize < availableSpace) {
    columnSizes[index] += availableSpace - totalSize;
  }
  return columnSizes;
};

export default ({
  settings,
  availableWidth,
  columnSizeOverrides,
  indicateRemainingColumnsSkipped,
  displayedColumns,
  defaultColumnSizeOverride,
}: {
  settings: any;
  availableWidth: number;
  columnSizeOverrides: Record<string | symbol, number>;
  indicateRemainingColumnsSkipped: boolean;
  displayedColumns: string[];
  defaultColumnSizeOverride?: number;
}) => {
  const initialIndexColumnSize = settings.showRowIndices ? MIN_COLUMN_SIZE : 0;
  const initialRowKeyColumnSize = settings.showRowKeys ? MIN_COLUMN_SIZE : 0;
  const initialRemainingSkippedColumnSize = indicateRemainingColumnsSkipped
    ? SKIPPED_REMAINING_COLUMNS_COLUMN_MIN_WIDTH
    : 0;

  const initialTableColumnsSizeTotal =
    availableWidth -
    initialIndexColumnSize -
    initialRowKeyColumnSize -
    initialRemainingSkippedColumnSize;

  const indexColumnSize =
    columnSizeOverrides[INDEX.id] || initialIndexColumnSize;
  const rowKeyColumnSize =
    columnSizeOverrides[ROW_ID.id] || initialRowKeyColumnSize;
  const remainingSkippedColumnSize =
    columnSizeOverrides[SKIPPED_REMAINING_COLUMNS_COLUMN.id] ||
    initialRemainingSkippedColumnSize;

  const currentColumnSizes = [indexColumnSize, rowKeyColumnSize]
    .concat(
      getDataColumnSizes({
        availableSpace: initialTableColumnsSizeTotal,
        displayedColumns,
        columnSizeOverrides,
        defaultColumnSizeOverride,
      }),
    )
    .concat(
      indicateRemainingColumnsSkipped ? [remainingSkippedColumnSize] : [],
    );

  const indexColumnIsOnlyColumn =
    currentColumnSizes.length === 2 && !settings.showRowKeys;
  const lastColumnIndex = indexColumnIsOnlyColumn
    ? 0
    : currentColumnSizes.length - 1;
  return stretchOneColumnToFillAvailableSpace({
    columnSizes: currentColumnSizes,
    index: lastColumnIndex,
    availableSpace: availableWidth,
  });
};
