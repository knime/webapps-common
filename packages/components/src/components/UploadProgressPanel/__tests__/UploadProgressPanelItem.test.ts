import { describe, expect, it } from "vitest";
import { VueWrapper, mount } from "@vue/test-utils";

import ProgressItem from "../../Progress/ProgressItem/ProgressItem.vue";
import UploadProgressPanelItem from "../UploadProgressPanelItem.vue";
import type { UploadItem } from "../types";

describe("UploadProgressPanelItem.vue", () => {
  type ComponentProps = InstanceType<typeof UploadProgressPanelItem>["$props"];

  const item: UploadItem = {
    id: "1",
    name: "Hello world.txt",
    progress: 38,
    size: 500_000,
    status: "inprogress",
  };

  const defaultProps: ComponentProps = {
    item,
    allowCancel: false,
    allowRemove: false,
  };

  const doMount = ({ props }: { props?: Partial<ComponentProps> } = {}) => {
    const wrapper = mount(UploadProgressPanelItem, {
      props: { ...defaultProps, ...props },
    });

    return { wrapper };
  };

  it("should render correctly", () => {
    const { wrapper } = doMount();

    expect(wrapper.findComponent(ProgressItem).props()).toEqual({
      id: item.id,
      title: item.name,
      subtitle: "190 kB of 500 kB",
      progress: item.progress,
      statusPill: {
        icon: expect.any(Object),
        text: "Uploading",
        variant: "info",
      },
    });
  });

  it.each([
    ["inprogress" as const, "Uploading", "info"],
    ["failed" as const, "Failed", "error"],
    ["complete" as const, "Uploaded", "success"],
    ["cancelled" as const, "Cancelled", "error"],
  ])(
    "should render correct status pill for %s state",
    (status, expectedText, expectedPillVariant) => {
      const { wrapper } = doMount({
        props: {
          item: { ...item, status },
        },
      });

      expect(wrapper.findComponent(ProgressItem).props()).toEqual(
        expect.objectContaining({
          statusPill: {
            icon: expect.any(Object),
            text: expectedText,
            variant: expectedPillVariant,
          },
        }),
      );
    },
  );

  it("should render forward the failure details to the status pill", () => {
    const { wrapper } = doMount({
      props: {
        item: {
          ...item,
          status: "failed",
          failureDetails: "This is some failure",
        },
      },
    });

    expect(wrapper.findComponent(ProgressItem).props()).toEqual(
      expect.objectContaining({
        statusPill: {
          icon: expect.any(Object),
          text: "Failed",
          variant: "error",
          tooltip: "This is some failure",
        },
      }),
    );
  });

  describe("cancel action", () => {
    const hasCancelAction = (wrapper: VueWrapper<any>) =>
      wrapper.find('[data-test-id="cancel-action"]').exists();

    it("should emit event", async () => {
      const { wrapper } = doMount({ props: { allowCancel: true } });

      expect(wrapper.emitted("cancel")).toBeUndefined();
      await wrapper.find('[data-test-id="cancel-action"]').trigger("click");
      expect(wrapper.emitted("cancel")).toBeDefined();
    });

    it("should show cancel only for inprogress status", async () => {
      const { wrapper } = doMount({ props: { allowCancel: true } });

      await wrapper.setProps({ item: { ...item, status: "inprogress" } });
      expect(hasCancelAction(wrapper)).toBe(true);

      await wrapper.setProps({ item: { ...item, status: "complete" } });
      expect(hasCancelAction(wrapper)).toBe(false);

      await wrapper.setProps({ item: { ...item, status: "cancelled" } });
      expect(hasCancelAction(wrapper)).toBe(false);

      await wrapper.setProps({ item: { ...item, status: "failed" } });
      expect(hasCancelAction(wrapper)).toBe(false);
    });

    it("should not show cancel if prop does not allow", () => {
      const { wrapper } = doMount({ props: { allowCancel: false } });
      expect(hasCancelAction(wrapper)).toBe(false);
    });
  });

  describe("remove action", () => {
    const hasRemoveAction = (wrapper: VueWrapper<any>) =>
      wrapper.find('[data-test-id="remove-action"]').exists();

    it("should show remove only for the correct statuses", async () => {
      const { wrapper } = doMount({ props: { allowRemove: true } });

      await wrapper.setProps({ item: { ...item, status: "inprogress" } });
      expect(hasRemoveAction(wrapper)).toBe(false);

      await wrapper.setProps({ item: { ...item, status: "complete" } });
      expect(hasRemoveAction(wrapper)).toBe(false);

      await wrapper.setProps({ item: { ...item, status: "cancelled" } });
      expect(hasRemoveAction(wrapper)).toBe(true);

      await wrapper.setProps({ item: { ...item, status: "failed" } });
      expect(hasRemoveAction(wrapper)).toBe(true);
    });

    it("should emit event", async () => {
      const { wrapper } = doMount({
        props: {
          item: { ...item, status: "failed" },
          allowRemove: true,
        },
      });

      expect(wrapper.emitted("remove")).toBeUndefined();
      await wrapper.find('[data-test-id="remove-action"]').trigger("click");
      expect(wrapper.emitted("remove")).toBeDefined();
    });
  });
});
