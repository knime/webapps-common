import {
  CachingSelectionService,
  type KnimeService,
} from "@knime/ui-extension-service";
import { ref } from "vue";

export default (knimeService: KnimeService) => {
  const selectionService = new CachingSelectionService(knimeService);

  const currentSelection = ref([] as boolean[]);
  const currentBottomSelection = ref([] as boolean[]);

  const getCurrentSelectedRowKeys = () => {
    return selectionService.getCachedSelection();
  };

  const mapSelectionToRows = (rows: {
    topRows: string[][] | undefined;
    bottomRows: string[][];
  }) => {
    const { topRows, bottomRows } = rows;

    if (typeof topRows === "undefined") {
      return;
    }
    const getRowKey = (row: string[]) => row[1];
    const rowKeysTop = topRows
      .map(getRowKey)
      .filter((x) => typeof x !== "undefined");
    const rowKeysBottom = bottomRows.map(getRowKey);

    const currentSelectedRowKeys = getCurrentSelectedRowKeys();
    currentSelection.value = rowKeysTop.map((rowKey) =>
      currentSelectedRowKeys.has(rowKey),
    );
    currentBottomSelection.value = rowKeysBottom.map((rowKey) =>
      currentSelectedRowKeys.has(rowKey),
    );
  };

  return {
    mapSelectionToRows,
    selectionService,
    getCurrentSelectedRowKeys,
    currentSelection,
    currentBottomSelection,
  };
};
