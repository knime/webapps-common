import { it, describe, expect, beforeEach } from "vitest";
import useRowHeight from "../useRowHeight";
import { RowHeightMode } from "@/tableView/types/ViewSettings";

describe("useColumnSizes", () => {
  let comp: ReturnType<typeof useRowHeight>;

  beforeEach(() => {
    comp = useRowHeight();
  });

  describe("row height from settings", () => {
    it("creates the correct column sizes of image columns with compact row height", () => {
      comp.setRowHeightSettings({
        customRowHeight: 0,
        rowHeightMode: RowHeightMode.COMPACT,
      });

      expect(comp.currentRowHeight.value).toBe(24);
    });

    it("creates the correct column sizes of image columns with default row height", () => {
      comp.setRowHeightSettings({
        customRowHeight: 0,
        rowHeightMode: RowHeightMode.DEFAULT,
      });

      expect(comp.currentRowHeight.value).toBe(40);
    });

    it("creates the correct column sizes of image columns with custom row height", () => {
      const customRowHeight = 80;
      comp.setRowHeightSettings({
        customRowHeight,
        rowHeightMode: RowHeightMode.CUSTOM,
      });

      expect(comp.currentRowHeight.value).toBe(customRowHeight);
    });

    it("applies default value as minimum for small custom row heights", () => {
      const customRowHeight = 1;
      comp.setRowHeightSettings({
        customRowHeight,
        rowHeightMode: RowHeightMode.CUSTOM,
      });

      expect(comp.currentRowHeight.value).toBe(40);
    });
  });

  it("sets row height on update", () => {
    const manualRowHeight = 100;
    comp.onRowHeightChange(manualRowHeight);

    expect(comp.currentRowHeight.value).toBe(manualRowHeight);
  });
});
