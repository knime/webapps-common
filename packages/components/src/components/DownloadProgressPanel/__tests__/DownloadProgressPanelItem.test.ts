import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import FolderIcon from "@knime/styles/img/icons/folder.svg";

import ProgressItem from "../../Progress/ProgressItem/ProgressItem.vue";
import DownloadProgressPanelItem from "../DownloadProgressPanelItem.vue";

import { downloadItemMocks } from "./downloadItemMocks";

const itemStatesTestCases = {
  ready: {
    item: downloadItemMocks[0],
    match: { text: "Ready", variant: "success", tooltip: undefined },
    showButtons: { cancel: false, download: true, remove: true },
  },
  zipping: {
    item: downloadItemMocks[1],
    match: { text: "Zipping", variant: "info", tooltip: undefined },
    showButtons: { cancel: true, download: false, remove: false },
  },
  cancelled: {
    item: downloadItemMocks[2],
    match: {
      text: "Cancelled",
      variant: "error",
      tooltip: downloadItemMocks[2].failureDetails,
    },
    showButtons: { cancel: false, download: false, remove: true },
  },
  failed: {
    item: downloadItemMocks[3],
    match: {
      text: "Failed",
      variant: "error",
      tooltip: downloadItemMocks[3].failureDetails,
    },
    showButtons: { cancel: false, download: false, remove: true },
  },
} as const;

describe("DownloadProgressPanelItem.vue", () => {
  const doMount = ({ item = structuredClone(downloadItemMocks[0]) } = {}) => {
    return mount(DownloadProgressPanelItem, { props: { item } });
  };

  it("renders", () => {
    const wrapper = doMount();
    const progressItem = wrapper.findComponent(ProgressItem);
    expect(progressItem.exists()).toBe(true);
    expect(wrapper.findComponent(FolderIcon).exists()).toBe(true);
  });

  it.each(["ready", "zipping", "cancelled", "failed"] as const)(
    "renders state '%s'",
    (itemState) => {
      const testCase = itemStatesTestCases[itemState];
      const wrapper = doMount({
        item: structuredClone(testCase.item),
      });
      expect(
        wrapper.findComponent(ProgressItem).props("statusPill"),
      ).toMatchObject({
        text: testCase.match.text,
        variant: testCase.match.variant,
        ...(testCase.match.tooltip && { tooltip: testCase.match?.tooltip }),
      });
      expect(wrapper.find('[data-test-id="cancel-action"]').exists()).toBe(
        testCase.showButtons.cancel,
      );
      expect(wrapper.find('[data-test-id="download-action"]').exists()).toBe(
        testCase.showButtons.download,
      );
      expect(wrapper.find('[data-test-id="remove-action"]').exists()).toBe(
        testCase.showButtons.remove,
      );
    },
  );

  it("emits events", async () => {
    // ready state
    const readyWrapper = doMount({
      item: structuredClone(downloadItemMocks[0]),
    });
    await readyWrapper
      .find('[data-test-id="download-action"]')
      .trigger("click");
    expect(readyWrapper.emitted("download")).toBeDefined();
    await readyWrapper.find('[data-test-id="remove-action"]').trigger("click");
    expect(readyWrapper.emitted("remove")).toBeDefined();

    // zipping state
    const zippingWrapper = doMount({
      item: structuredClone(downloadItemMocks[1]),
    });
    await zippingWrapper
      .find('[data-test-id="cancel-action"]')
      .trigger("click");
    expect(zippingWrapper.emitted("cancel")).toBeDefined();
  });
});
