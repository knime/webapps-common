import { describe, vi, beforeEach, it, expect, type Mock } from "vitest";
import { JsonDataService } from "@knime/ui-extension-service";
import { shallowMount } from "@vue/test-utils";
import TableViewReport from "../TableViewReport.vue";
import TableViewDisplay from "../TableViewDisplay.vue";
import flushPromises from "flush-promises";
import type { DataType } from "../types";

describe("TableViewReport.vue", () => {
  let initialDataMock: {
      table: {
        columnDataTypeIds: string[];
        rows: string[][];
        displayedColumns: string[];
        rowCount: number;
        columnContentTypes: string[];
      };
      dataTypes: Record<string, DataType>;
      settings: any;
    },
    getData: Mock<[], Promise<any>>;

  beforeEach(() => {
    getData = vi.fn();
    initialDataMock = {
      table: {
        columnDataTypeIds: ["id1", "id2"],
        rows: [
          ["row1col1", "row1col2"],
          ["row2col1", "row2col2"],
        ],
        displayedColumns: ["col1", "col2"],
        rowCount: 1000,
        columnContentTypes: ["txt", "img_path"],
      },
      dataTypes: {
        id1: {
          name: "name1",
          renderers: [{ name: "renderer1", id: "id1" }],
        },
        id2: {
          name: "name2",
          renderers: [{ name: "renderer2", id: "id2" }],
        },
      },
      settings: {
        enablePagination: true,
      },
    };
    // eslint-disable-next-line no-extra-parens
    (JsonDataService as any).mockImplementation(() => ({
      initialData: vi.fn().mockResolvedValue(initialDataMock),
      data: getData,
    }));
  });

  const knimeSeviceMock = {
    foo: "bar",
  };

  const shallowMountTableViewReport = () => {
    const provide = {
      getKnimeService: () => knimeSeviceMock,
    };
    return shallowMount(TableViewReport as any, { global: { provide } });
  };

  const shallowMountTableViewReportAndWait = async () => {
    const wrapper = shallowMountTableViewReport();
    await flushPromises(); // initial data
    await flushPromises(); // fetch data
    return wrapper;
  };

  it("renders and loads initial data", async () => {
    const wrapper = await shallowMountTableViewReportAndWait();
    expect(wrapper.findComponent(TableViewDisplay).exists()).toBeTruthy();
    expect(wrapper.findComponent(TableViewDisplay).props()).toStrictEqual({
      enableColumnResizing: false,
      enableRowResizing: false,
      globalSearchQuery: "",
      knimeService: knimeSeviceMock,
      enableVirtualScrolling: false,
      forceHideTableSizes: false,
      includeImageResources: true,
      selection: undefined,
      sorting: undefined,
      firstRowImageDimensions: {},
      settings: {
        ...initialDataMock.settings,
        publishSelection: false,
        subscribeToSelection: false,
        enableColumnSearch: false,
        enableSortingByHeader: false,
        enableGlobalSearch: false,
        enableRendererSelection: false,
      },
      page: {
        columnCount: 0,
        currentPage: 1,
        currentRowCount: 2,
      },
      header: expect.objectContaining({
        columnDataTypeIds: initialDataMock.table.columnDataTypeIds,
        dataTypes: initialDataMock.dataTypes,
        indicateRemainingColumnsSkipped: false,
      }),
      rows: expect.anything(),
    });
  });

  it("uses initial data as data if pagination is enabled", async () => {
    const wrapper = await shallowMountTableViewReportAndWait();
    expect(wrapper.findComponent(TableViewDisplay).props()).toMatchObject({
      header: expect.objectContaining({
        displayedColumns: initialDataMock.table.displayedColumns,
        columnContentTypes: initialDataMock.table.columnContentTypes,
      }),
      rows: {
        loaded: true,
        top: initialDataMock.table.rows,
      },
    });
  });

  it("fetches new data if pagination is disabled", async () => {
    initialDataMock.settings.enablePagination = false;
    initialDataMock.settings.displayedColumns = {
      selected: ["col1", "col2", "col3"],
    };
    const columnCount = 1;
    const getDataReturnValue = {
      rows: [["row1col1"], ["row2col1"], ["row3col1"]],
      columnCount,
      displayedColumns: ["col1"],
      columnContentTypes: ["txt"],
    };
    getData.mockResolvedValue(getDataReturnValue);
    const wrapper = await shallowMountTableViewReportAndWait();

    expect(getData).toHaveBeenCalledWith({
      method: "getTable",
      options: [
        ["col1", "col2", "col3"],
        0,
        initialDataMock.table.rowCount,
        [],
        true,
        true,
        false,
      ],
    });

    expect(wrapper.findComponent(TableViewDisplay).props()).toMatchObject({
      header: expect.objectContaining({
        displayedColumns: getDataReturnValue.displayedColumns,
        columnContentTypes: getDataReturnValue.columnContentTypes,
      }),
      rows: {
        loaded: true,
        top: getDataReturnValue.rows,
      },
      page: {
        columnCount,
        currentPage: 1,
        currentRowCount: 3,
      },
    });
  });

  it("emits rendered", async () => {
    const wrapper = await shallowMountTableViewReportAndWait();
    const tableViewDisplay = wrapper.findComponent(TableViewDisplay);
    await tableViewDisplay.vm.$emit("table-is-ready");
    expect(wrapper.emitted()).toStrictEqual({ rendered: [[]] });
  });

  it("emits rendered with pending images", async () => {
    const wrapper = shallowMountTableViewReport();

    const tableViewDisplay = wrapper.findComponent(TableViewDisplay);
    tableViewDisplay.vm.$emit("pending-image", "id1");
    await flushPromises();
    expect(wrapper.emitted()).toStrictEqual({}); // still no emit, since there is a pending image

    await tableViewDisplay.vm.$emit("pending-image", "id2");
    expect(wrapper.emitted()).toStrictEqual({});
    await tableViewDisplay.vm.$emit("rendered-image", "id1");
    expect(wrapper.emitted()).toStrictEqual({});
    await tableViewDisplay.vm.$emit("pending-image", "id3");
    expect(wrapper.emitted()).toStrictEqual({});
    await tableViewDisplay.vm.$emit("rendered-image", "id3");
    expect(wrapper.emitted()).toStrictEqual({});
    await tableViewDisplay.vm.$emit("rendered-image", "id2");

    tableViewDisplay.vm.$emit("table-is-ready");
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted()).toStrictEqual({ rendered: [[]] });
  });

  it("does not emit rendered until the table is ready", async () => {
    const wrapper = shallowMountTableViewReport();
    const tableViewDisplay = wrapper.findComponent(TableViewDisplay);
    tableViewDisplay.vm.$emit("pending-image", "id1");

    await flushPromises();
    expect(wrapper.emitted()).toStrictEqual({}); // no emit, due to a pending image

    tableViewDisplay.vm.$emit("rendered-image", "id1");
    expect(wrapper.emitted()).toStrictEqual({}); // no emit, due to a table not yet ready

    tableViewDisplay.vm.$emit("table-is-ready");
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted()).toHaveProperty("rendered");
  });
});
