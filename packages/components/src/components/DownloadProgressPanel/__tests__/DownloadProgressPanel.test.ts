import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import CollapsiblePanel from "../../CollapsiblePanel/CollapsiblePanel.vue";
import ProgressList from "../../Progress/ProgressList/ProgressList.vue";
import DownloadProgressPanel from "../DownloadProgressPanel.vue";
import DownloadProgressPanelItem from "../DownloadProgressPanelItem.vue";
import type { DownloadItem } from "../types";

import { downloadItemMocks } from "./downloadItemMocks";

describe("DownloadProgressPanel.vue", () => {
  const doMount = ({
    downloadItems = structuredClone(downloadItemMocks),
  }: {
    downloadItems?: DownloadItem[];
  } = {}) => {
    const wrapper = mount(DownloadProgressPanel, {
      props: {
        items: downloadItems,
      },
    });

    return { wrapper };
  };

  it("renders download panel", () => {
    const { wrapper } = doMount();
    expect(wrapper.findComponent(CollapsiblePanel).exists()).toBe(true);
    expect(wrapper.findComponent(ProgressList).exists()).toBe(true);
    expect(wrapper.findAllComponents(DownloadProgressPanelItem).length).toBe(4);
  });

  it("emits item events", () => {
    const { wrapper } = doMount();
    const downloadItemWrappers = wrapper.findAllComponents(
      DownloadProgressPanelItem,
    );
    expect(wrapper.findAllComponents(DownloadProgressPanelItem).length).toBe(4);

    downloadItemWrappers[0].vm.$emit("remove");
    expect(wrapper.emitted("remove")).toBeDefined();

    downloadItemWrappers[1].vm.$emit("cancel");
    expect(wrapper.emitted("cancel")).toBeDefined();

    downloadItemWrappers[2].vm.$emit("download");
    expect(wrapper.emitted("download")).toBeDefined();
  });

  it("emits close event", async () => {
    const downloadItems = [structuredClone(downloadItemMocks[0])];
    const { wrapper } = doMount({ downloadItems });
    await wrapper.setProps({ items: [] });
    expect(wrapper.emitted("close")).toBeDefined();
  });
});
