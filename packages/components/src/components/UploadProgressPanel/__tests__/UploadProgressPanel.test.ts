import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import CollapsiblePanel from "../../CollapsiblePanel/CollapsiblePanel.vue";
import SkeletonItem from "../../SkeletonItem/SkeletonItem.vue";
import UploadProgressPanel from "../UploadProgressPanel.vue";
import UploadProgressPanelItem from "../UploadProgressPanelItem.vue";
import type { UploadItem } from "../types";

describe("UploadProgressPanel.vue", () => {
  type ComponentProps = InstanceType<typeof UploadProgressPanel>["$props"];

  const item1: UploadItem = {
    id: "1",
    name: "Hello world.txt",
    progress: 20,
    size: 5000,
    status: "inprogress",
  };
  const item2: UploadItem = {
    id: "2",
    name: "Hello world2.txt",
    progress: 50,
    size: 5000,
    status: "cancelled",
  };
  const item3: UploadItem = {
    id: "4",
    name: "Hello world3.txt",
    progress: 50,
    size: 5000,
    status: "complete",
  };

  const defaultProps: ComponentProps = {
    items: [item1, item2, item3],
  };

  const doMount = ({ props }: { props?: Partial<ComponentProps> } = {}) => {
    const wrapper = mount(UploadProgressPanel, {
      props: { ...defaultProps, ...props },
    });

    return { wrapper };
  };

  it("should render items", () => {
    const { wrapper } = doMount();

    expect(wrapper.findAllComponents(UploadProgressPanelItem).length).toBe(3);
    expect(
      wrapper.findAllComponents(UploadProgressPanelItem).at(0)?.props("item"),
    ).toEqual(item1);
    expect(
      wrapper.findAllComponents(UploadProgressPanelItem).at(1)?.props("item"),
    ).toEqual(item2);
    expect(
      wrapper.findAllComponents(UploadProgressPanelItem).at(2)?.props("item"),
    ).toEqual(item3);
  });

  it("should render title", () => {
    const { wrapper } = doMount();

    expect(wrapper.findComponent(CollapsiblePanel).props("title")).toBe(
      "Uploaded 1 of 3 file(s)",
    );
  });

  it("should emit remove event", () => {
    const { wrapper } = doMount();
    wrapper
      .findAllComponents(UploadProgressPanelItem)
      .at(1)!
      .vm.$emit("remove", item2);

    expect(wrapper.emitted("remove")![0][0]).toEqual(item2);
  });

  it("should emit cancel event", () => {
    const { wrapper } = doMount();
    wrapper
      .findAllComponents(UploadProgressPanelItem)
      .at(1)!
      .vm.$emit("cancel", item2);

    expect(wrapper.emitted("cancel")![0][0]).toEqual(item2);
  });

  it("should emit close event", () => {
    const { wrapper } = doMount();
    wrapper.findComponent(CollapsiblePanel).vm.$emit("close");
    expect(wrapper.emitted("close")).toBeDefined();
  });

  it("should close when the last item is removed", async () => {
    const { wrapper } = doMount();

    expect(wrapper.emitted("close")).toBeUndefined();

    await wrapper.setProps({ items: [] });
    expect(wrapper.emitted("close")).toBeDefined();
  });

  it("should render placeholder items", async () => {
    const { wrapper } = doMount({ props: { placeholderItems: 2 } });

    expect(wrapper.findComponent(SkeletonItem).props("loading")).toBe(true);
    expect(wrapper.findComponent(SkeletonItem).props("repeat")).toBe(2);

    await wrapper.setProps({ placeholderItems: 0 });

    expect(wrapper.findComponent(SkeletonItem).props("loading")).toBe(false);
    expect(wrapper.findComponent(SkeletonItem).props("repeat")).toBe(0);
  });

  it("should determine when the panel is closeable", async () => {
    const { wrapper } = doMount();

    expect(wrapper.findComponent(CollapsiblePanel).props("closeable")).toBe(
      false,
    );

    // just one completed item
    await wrapper.setProps({ items: [item3] });

    expect(wrapper.findComponent(CollapsiblePanel).props("closeable")).toBe(
      true,
    );

    // add placeholders -> new items are possibly coming => can't close
    await wrapper.setProps({ placeholderItems: 2 });
    expect(wrapper.findComponent(CollapsiblePanel).props("closeable")).toBe(
      false,
    );
  });
});
