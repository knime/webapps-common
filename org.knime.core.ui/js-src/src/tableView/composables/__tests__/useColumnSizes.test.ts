import { it, describe, expect, beforeEach } from "vitest";
import useColumnSizes, { type UseColumnSizesOptions } from "../useColumnSizes";
import { nextTick, ref } from "vue";
import specialColumns from "../../utils/specialColumns";
const { INDEX, ROW_ID, SKIPPED_REMAINING_COLUMNS_COLUMN } = specialColumns;

describe("useColumnSizes", () => {
  let initialDataMock: UseColumnSizesOptions;

  beforeEach(() => {
    initialDataMock = {
      header: ref({
        displayedColumns: ["col1", "col2", "col3"],
        indicateRemainingColumnsSkipped: false,
      }),
      settings: ref({
        autoSizeColumnsToContent: "FIXED",
        showRowIndices: false,
        showRowKeys: false,
      }),
      autoColumnSizes: ref({}),
      autoColumnSizesActive: ref(false),
    };
  });

  it("uses the default column width without specific settings", () => {
    const { columnSizes } = useColumnSizes(initialDataMock);
    expect(columnSizes.value).toStrictEqual([0, 0, 100, 100, 100]);
  });

  it("updates the overrides for a single column", () => {
    const { columnSizes, onColumnResize } = useColumnSizes(initialDataMock);

    const newColumnSizeCol2 = 99;
    onColumnResize("col2", newColumnSizeCol2);
    expect(columnSizes.value).toStrictEqual([
      0,
      0,
      100,
      newColumnSizeCol2,
      100,
    ]);

    const newColumnSizeCol1 = 65;
    onColumnResize("col1", newColumnSizeCol1);
    const newColumnSizeCol3 = 90;
    onColumnResize("col3", newColumnSizeCol3);
    expect(columnSizes.value).toStrictEqual([
      0,
      0,
      newColumnSizeCol1,
      newColumnSizeCol2,
      newColumnSizeCol3,
    ]);
  });

  it("updates the overrides for all columns", () => {
    const { columnSizes, onAllColumnsResize } = useColumnSizes(initialDataMock);

    let newColumnSize = 55;
    onAllColumnsResize(newColumnSize);
    expect(columnSizes.value).toStrictEqual([
      0,
      0,
      newColumnSize,
      newColumnSize,
      newColumnSize,
    ]);

    newColumnSize = 750;
    onAllColumnsResize(newColumnSize);
    expect(columnSizes.value).toStrictEqual([
      0,
      0,
      newColumnSize,
      newColumnSize,
      newColumnSize,
    ]);
  });

  it("updates the available width and divides the space equally", () => {
    const { columnSizes, onUpdateAvailableWidth } =
      useColumnSizes(initialDataMock);

    const newAvailableWidth = 600;
    onUpdateAvailableWidth(newAvailableWidth);

    expect(columnSizes.value).toStrictEqual([0, 0, 200, 200, 200]);
  });

  it("updates the available width and stretches the last column", () => {
    const { columnSizes, onColumnResize, onUpdateAvailableWidth } =
      useColumnSizes(initialDataMock);

    const newAvailableWidth = 600;
    onUpdateAvailableWidth(newAvailableWidth);

    const newColumnSize = 50;
    onColumnResize("col1", newColumnSize);
    expect(columnSizes.value).toStrictEqual([0, 0, newColumnSize, 200, 350]);
  });

  it("uses the ratio of the initial/new available width to override single column size", () => {
    const { columnSizes, onUpdateAvailableWidth, onColumnResize } =
      useColumnSizes(initialDataMock);
    const initialAvailableWidth = 600;
    onUpdateAvailableWidth(initialAvailableWidth);

    const initialColumnSize = 300;
    onColumnResize("col1", initialColumnSize);
    expect(columnSizes.value).toStrictEqual([
      0,
      0,
      initialColumnSize,
      200,
      200,
    ]);

    const newAvailableWidth = initialAvailableWidth * 2;
    const newColumnSize = initialColumnSize * 2;
    onUpdateAvailableWidth(newAvailableWidth);
    expect(columnSizes.value).toStrictEqual([0, 0, newColumnSize, 400, 400]);
  });

  it("uses the ratio of the initial/new available width to override all sizes", () => {
    const { columnSizes, onUpdateAvailableWidth, onAllColumnsResize } =
      useColumnSizes(initialDataMock);
    const initialAvailableWidth = 600;
    onUpdateAvailableWidth(initialAvailableWidth);

    const initialColumnSize = 300;
    onAllColumnsResize(initialColumnSize);
    expect(columnSizes.value).toStrictEqual([
      0,
      0,
      initialColumnSize,
      initialColumnSize,
      initialColumnSize,
    ]);

    const newAvailableWidth = initialAvailableWidth * 2;
    const newColumnSize = initialColumnSize * 2;
    onUpdateAvailableWidth(newAvailableWidth);
    expect(columnSizes.value).toStrictEqual([
      0,
      0,
      newColumnSize,
      newColumnSize,
      newColumnSize,
    ]);
  });

  it("divides the space of default overridden columns equally", () => {
    const { columnSizes, onUpdateAvailableWidth, onAllColumnsResize } =
      useColumnSizes(initialDataMock);
    const initialAvailableWidth = 600;
    onUpdateAvailableWidth(initialAvailableWidth);

    const initialColumnSize = 300;
    onAllColumnsResize(initialColumnSize);
    expect(columnSizes.value).toStrictEqual([
      0,
      0,
      initialColumnSize,
      initialColumnSize,
      initialColumnSize,
    ]);

    const newAvailableWidth = initialAvailableWidth * 2;
    const newColumnSize = initialColumnSize * 2;
    onUpdateAvailableWidth(newAvailableWidth);
    expect(columnSizes.value).toStrictEqual([
      0,
      0,
      newColumnSize,
      newColumnSize,
      newColumnSize,
    ]);
  });

  it("takes into account special columns", () => {
    initialDataMock.header.value.indicateRemainingColumnsSkipped = true;
    initialDataMock.settings.value.showRowIndices = true;
    initialDataMock.settings.value.showRowKeys = true;

    const { columnSizes, onUpdateAvailableWidth } =
      useColumnSizes(initialDataMock);

    let newAvailableWidth = 1200;
    onUpdateAvailableWidth(newAvailableWidth);
    expect(columnSizes.value).toStrictEqual([
      INDEX.defaultSize,
      ROW_ID.defaultSize,
      300,
      300,
      300,
      SKIPPED_REMAINING_COLUMNS_COLUMN.defaultSize,
    ]);

    newAvailableWidth = 900;
    onUpdateAvailableWidth(newAvailableWidth);
    expect(columnSizes.value).toStrictEqual([
      INDEX.defaultSize,
      ROW_ID.defaultSize,
      200,
      200,
      200,
      SKIPPED_REMAINING_COLUMNS_COLUMN.defaultSize,
    ]);

    newAvailableWidth = 300;
    onUpdateAvailableWidth(newAvailableWidth);
    expect(columnSizes.value).toStrictEqual([
      INDEX.defaultSize,
      ROW_ID.defaultSize,
      100,
      100,
      100,
      SKIPPED_REMAINING_COLUMNS_COLUMN.defaultSize,
    ]);
  });

  it("provides expected column sizes for empty tables", () => {
    initialDataMock.header.value.indicateRemainingColumnsSkipped = false;
    initialDataMock.header.value.displayedColumns = [];
    initialDataMock.settings.value.showRowIndices = false;
    initialDataMock.settings.value.showRowKeys = false;

    const { columnSizes } = useColumnSizes(initialDataMock);
    expect(columnSizes.value).toStrictEqual([0, 0]);
  });

  it("uses the correct column sizes when the index column is the only column", () => {
    initialDataMock.header.value.indicateRemainingColumnsSkipped = false;
    initialDataMock.header.value.displayedColumns = [];
    initialDataMock.settings.value.showRowIndices = true;
    initialDataMock.settings.value.showRowKeys = false;

    const { columnSizes, onUpdateAvailableWidth } =
      useColumnSizes(initialDataMock);
    const availableWidth = 400;
    onUpdateAvailableWidth(availableWidth);
    expect(columnSizes.value).toStrictEqual([400, 0]);
  });

  it("deletes the override for the given column ids when calling deleteColumnSizeOverrides", () => {
    initialDataMock.settings.value.showRowIndices = true;
    initialDataMock.settings.value.showRowKeys = true;

    const { columnSizes, deleteColumnSizeOverrides, onColumnResize } =
      useColumnSizes(initialDataMock);
    expect(columnSizes.value).toStrictEqual([50, 50, 100, 100, 100]);

    const columnSizeOverride = 75;
    onColumnResize(specialColumns.ROW_ID.id, columnSizeOverride);
    onColumnResize("col1", columnSizeOverride);
    onColumnResize("col3", columnSizeOverride);
    expect(columnSizes.value).toStrictEqual([
      50,
      columnSizeOverride,
      columnSizeOverride,
      100,
      columnSizeOverride,
    ]);

    deleteColumnSizeOverrides(["col1", "col3"]);
    expect(columnSizes.value).toStrictEqual([
      50,
      columnSizeOverride,
      100,
      100,
      100,
    ]);
  });

  it("deletes all overrides when calling deleteColumnSizeOverrides with null/nothing", () => {
    initialDataMock.settings.value.showRowIndices = true;
    initialDataMock.settings.value.showRowKeys = true;

    const { columnSizes, deleteColumnSizeOverrides, onColumnResize } =
      useColumnSizes(initialDataMock);
    expect(columnSizes.value).toStrictEqual([50, 50, 100, 100, 100]);

    const columnSizeOverride = 75;
    onColumnResize(specialColumns.ROW_ID.id, columnSizeOverride);
    onColumnResize("col1", columnSizeOverride);
    onColumnResize("col3", columnSizeOverride);
    expect(columnSizes.value).toStrictEqual([
      50,
      columnSizeOverride,
      columnSizeOverride,
      100,
      columnSizeOverride,
    ]);

    deleteColumnSizeOverrides();
    expect(columnSizes.value).toStrictEqual([50, 50, 100, 100, 100]);
  });

  it("deletes the default override when calling deleteColumnSizeOverrides with null/nothing", () => {
    initialDataMock.settings.value.showRowIndices = true;
    initialDataMock.settings.value.showRowKeys = true;

    const { columnSizes, deleteColumnSizeOverrides, onAllColumnsResize } =
      useColumnSizes(initialDataMock);
    expect(columnSizes.value).toStrictEqual([50, 50, 100, 100, 100]);

    const defaultColumnSizeOverride = 75;
    onAllColumnsResize(defaultColumnSizeOverride);
    expect(columnSizes.value).toStrictEqual([
      50,
      50,
      defaultColumnSizeOverride,
      defaultColumnSizeOverride,
      defaultColumnSizeOverride,
    ]);

    deleteColumnSizeOverrides();
    expect(columnSizes.value).toStrictEqual([50, 50, 100, 100, 100]);
  });

  describe("auto column size changes", () => {
    beforeEach(() => {
      initialDataMock.autoColumnSizesActive.value = true;
    });

    it("does not override existing overrides when new auto sizes were calculated", async () => {
      const { columnSizes, onColumnResize, onUpdateAvailableWidth } =
        useColumnSizes(initialDataMock);

      const initialAvailableWidth = 600;
      onUpdateAvailableWidth(initialAvailableWidth);

      const newColumnSizeCol1 = 99;
      onColumnResize("col1", newColumnSizeCol1);
      expect(columnSizes.value).toStrictEqual([
        0,
        0,
        newColumnSizeCol1,
        200,
        301,
      ]);

      const newAutoColumnSizeCol1 = 75;
      initialDataMock.autoColumnSizes.value = { col1: newAutoColumnSizeCol1 };
      await nextTick(); // wait for overrides to be updated
      expect(columnSizes.value).toStrictEqual([
        0,
        0,
        newColumnSizeCol1,
        200,
        301,
      ]);
    });

    it("adds the new auto sizes for columns that have no overrides yet", async () => {
      const { columnSizes, onUpdateAvailableWidth } =
        useColumnSizes(initialDataMock);

      const initialAvailableWidth = 600;
      onUpdateAvailableWidth(initialAvailableWidth);

      initialDataMock.autoColumnSizes.value = { col2: 60 };
      await nextTick(); // wait for overrides to be updated
      expect(columnSizes.value).toStrictEqual([0, 0, 200, 60, 340]);
    });

    it("does not use the ratio of the initial/new available width to update overrides when auto sizes active", async () => {
      const { columnSizes, onUpdateAvailableWidth } =
        useColumnSizes(initialDataMock);
      const initialAvailableWidth = 600;
      onUpdateAvailableWidth(initialAvailableWidth);

      initialDataMock.autoColumnSizes.value = { col1: 55, col2: 55, col3: 55 };
      await nextTick(); // wait for overrides to be updated
      expect(columnSizes.value).toStrictEqual([0, 0, 55, 55, 490]);

      let newAvailableWidth = 1200;
      onUpdateAvailableWidth(newAvailableWidth);
      expect(columnSizes.value).toStrictEqual([0, 0, 55, 55, 1090]);

      newAvailableWidth = 100;
      onUpdateAvailableWidth(newAvailableWidth);
      expect(columnSizes.value).toStrictEqual([0, 0, 55, 55, 55]);
    });
  });
});
