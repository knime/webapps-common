import { beforeEach, describe, expect, it, vi, afterEach } from "vitest";
import { getDefaultProps, mountDisplay } from "./utils/display";
import ImageRenderer from "../ImageRenderer.vue";
import HTMLRenderer from "../HtmlRenderer.vue";
// @ts-ignore
import { TableUIWithAutoSizeCalculation } from "@knime/knime-ui-table";
import type { TableViewDisplayProps } from "../types";
import * as vuexModule from "vuex";
import * as imagesModule from "../../utils/images";

// TODO: UIEXT-1073 Reactivate tests
describe.skip("slot rendering", () => {
  let props: TableViewDisplayProps;

  const mount = async (props: TableViewDisplayProps) => {
    const wrapper = await mountDisplay({ props });
    const tableUI = wrapper.getComponent(TableUIWithAutoSizeCalculation);
    return { wrapper, tableUI };
  };

  beforeEach(() => {
    // TableUI uses ResizeObserver, which is not available in jsdom
    Object.defineProperty(window, "ResizeObserver", {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      })),
    });
    props = getDefaultProps();
    props.header.columnContentTypes = ["txt", "img_path", "html"];
    props.header.displayedColumns = ["col1", "col2", "col3"];
    props.rows.top = [
      ["0", "Row0", "cell(0,0)", "dummyImagePath0.png", "<h1>dummyHtml0</h1>"],
      ["1", "Row1", "cell(1,0)", "dummyImagePath1.png", "<h1>dummyHtml1</h1>"],
      ["2", "Row2", "cell(2,0)", "dummyImagePath2.png", "<h1>dummyHtml2</h1>"],
    ];
    vi.spyOn(vuexModule, "useStore").mockReturnValue({
      getters: {
        "api/uiExtResourceLocation": vi.fn(),
      },
    } as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("creates the correct source urls", async () => {
    const { wrapper } = await mount(props);
    expect(wrapper.findComponent(ImageRenderer).props()).toMatchObject({
      path: "dummyImagePath0.png",
      // @ts-ignore baseUrl not present in resourceInfo
      baseUrl: props.knimeService.extensionConfig.resourceInfo?.baseUrl,
      height: 80,
      width: 90,
      update: true,
    });
  });

  it("prevents size update if column resizing is active", async () => {
    const { tableUI, wrapper } = await mount(props);
    await tableUI.vm.$emit("columnResizeStart");
    expect(wrapper.findComponent(ImageRenderer).props().update).toBe(false);
  });

  describe("reporting", () => {
    beforeEach(() => {
      props.includeImageResources = true;
      vi.spyOn(imagesModule, "fetchImage").mockResolvedValue(
        "dummyFetchedImageSrc",
      );
    });

    it("includes image resources if desired", async () => {
      props.includeImageResources = true;
      const { wrapper } = await mount(props);
      expect(wrapper.findComponent(ImageRenderer).props()).toMatchObject({
        includeDataInHtml: true,
      });
    });

    it("emits pending and rendered events", async () => {
      const { wrapper } = await mount(props);
      expect(wrapper.emitted()).toMatchObject({
        "pending-image": [
          [expect.stringContaining("Image")],
          [expect.stringContaining("Image")],
          [expect.stringContaining("Image")],
        ],
        "rendered-image": [
          [expect.stringContaining("Image")],
          [expect.stringContaining("Image")],
          [expect.stringContaining("Image")],
        ],
      });
    });
  });

  it("creates the correct content for html", async () => {
    const { wrapper } = await mount(props);
    expect(wrapper.findComponent(HTMLRenderer).props()).toMatchObject({
      content: "<h1>dummyHtml0</h1>",
    });
  });
});
