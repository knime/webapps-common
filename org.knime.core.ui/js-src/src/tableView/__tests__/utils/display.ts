import { type VueWrapper, mount, shallowMount } from "@vue/test-utils";
import flushPromises from "flush-promises";

import {
  AutoSizeColumnsToContent,
  RowHeightMode,
  SelectionMode,
  VerticalPaddingMode,
} from "@/tableView/types/ViewSettings";
import TableViewDisplay from "../../TableViewDisplay.vue";
import type { TableViewDisplayProps } from "../../types";

export const mountDisplay = async ({
  props,
}: {
  props: TableViewDisplayProps;
}) => {
  const wrapper = mount(TableViewDisplay, { props });
  await flushPromises();
  return wrapper;
};

export const shallowMountDisplay = ({
  props,
}: {
  props: TableViewDisplayProps;
}): VueWrapper => shallowMount(TableViewDisplay, { props });

export const getDefaultProps = (): TableViewDisplayProps => {
  const dataTypes = {
    datatype1: {
      name: "col1And2TypeName",
      renderers: [
        { name: "type1renderer1", id: "t1r1" },
        { name: "type1renderer2", id: "t1r2" },
        { name: "type1renderer3", id: "t1r3" },
        { name: "type1renderer4", id: "t1r4" },
      ],
      hasDataValueView: true,
    },
    datatype2: {
      name: "col3TypeName",
      renderers: [
        { name: "type2renderer1", id: "t2r1" },
        { name: "type2renderer2", id: "t2r2" },
      ],
      hasDataValueView: false,
    },
    datatype3: {
      name: "col4TypeName",
      renderers: [
        { name: "type3renderer1", id: "t3r1" },
        { name: "type3renderer2", id: "t3r2" },
        { name: "type3renderer3", id: "t3r3" },
      ],
      hasDataValueView: true,
    },
  };
  return {
    rows: {
      loaded: true,
      top: [
        ["cell(0,0)", "cell(0,1)", "cell(0,2)"],
        ["cell(1,0)", "cell(1,1)", "cell(1,2)"],
        ["cell(2,0)", "cell(2,1)", "cell(2,2)"],
        ["cell(3,0)", "cell(3,1)", "cell(3,2)"],
      ],
      bottom: [
        ["bottomCell(0,0)", "bottomCell(0,1)", "bottomCell(0,2)"],
        ["bottomCell(1,0)", "bottomCell(1,1)", "bottomCell(1,2)"],
      ],
    },
    header: {
      displayedColumns: ["col1", "col2", "col3"],
      columnContentTypes: ["txt", "txt", "txt"],
      columnDataTypeIds: ["datatype1", "datatype2", "datatype3"],
      indicateRemainingColumnsSkipped: false,
      dataTypes,
      columnNamesColors: ["#ff0000", "#00ff00", "#0000ff"],
    },
    settings: {
      showRowKeys: false,
      showRowIndices: false,
      showTableSize: false,
      showColumnCount: false,
      rowHeightMode: RowHeightMode.AUTO,
      verticalPaddingMode: VerticalPaddingMode.DEFAULT,
      customRowHeight: 80,
      showColumnDataType: false,
      enableRendererSelection: false,
      selectionMode: SelectionMode.OFF,
      enableColumnSearch: false,
      enableGlobalSearch: false,
      enablePagination: false,
      pageSize: 10,
      enableSortingByHeader: false,
      autoSizeColumnsToContent: AutoSizeColumnsToContent.FIXED,
      title: "Title",
      skipRemainingColumns: false,
      showOnlySelectedRows: false,
      showOnlySelectedRowsConfigurable: false,
      displayedColumns: { selected: [] },
      enableCellCopying: false,
      enableDataValueViews: false,
      rowLabel: "",
    },
    page: {
      currentRowCount: 4,
      totalRowCount: 6,
      currentPage: 1,
      columnCount: 3,
    },
    globalSearchQuery: "",
    enableVirtualScrolling: false,
    enableColumnResizing: false,
    enableRowResizing: false,
    currentRowHeight: 50,
    includeImageResources: false,
    knimeService: {
      extensionConfig: { resourceInfo: { baseUrl: "baseUrl" } },
    } as any,
    firstRowImageDimensions: {},
    enableCellSelection: false,
    enableDataValueViews: false,
  };
};
