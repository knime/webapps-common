import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import { KdsButton } from "@knime/kds-components";

import SimpleArrayLayoutItemControls from "../SimpleArrayLayoutItemControls.vue";

const doMount = (
  props: Partial<
    InstanceType<typeof SimpleArrayLayoutItemControls>["$props"]
  > = {},
) =>
  mount(SimpleArrayLayoutItemControls, {
    props: {
      isFirst: false,
      isLast: false,
      showSortControls: false,
      isHidingControlHeader: false,
      ...props,
    },
  });

describe("SimpleArrayLayoutItemControls", () => {
  it("renders the delete button", () => {
    const wrapper = doMount();
    const buttons = wrapper.findAllComponents(KdsButton);
    expect(buttons).toHaveLength(1);
    expect(buttons[0].props("leadingIcon")).toBe("trash");
  });

  it("emits delete on trash button click", async () => {
    const wrapper = doMount();
    await wrapper.findComponent(KdsButton).trigger("click");
    expect(wrapper.emitted("delete")).toHaveLength(1);
  });

  describe("sort controls", () => {
    it("hides sort buttons when showSortControls is false", () => {
      const wrapper = doMount({ showSortControls: false });
      const buttons = wrapper.findAllComponents(KdsButton);
      expect(buttons).toHaveLength(1); // only trash
    });

    it("shows sort buttons when showSortControls is true", () => {
      const wrapper = doMount({ showSortControls: true });
      const buttons = wrapper.findAllComponents(KdsButton);
      expect(buttons).toHaveLength(3); // up, down, trash
    });

    it("disables up button when isFirst", () => {
      const wrapper = doMount({ showSortControls: true, isFirst: true });
      const [upButton] = wrapper.findAllComponents(KdsButton);
      expect(upButton.props("leadingIcon")).toBe("arrow-up");
      expect(upButton.props("disabled")).toBe(true);
    });

    it("disables down button when isLast", () => {
      const wrapper = doMount({ showSortControls: true, isLast: true });
      const [, downButton] = wrapper.findAllComponents(KdsButton);
      expect(downButton.props("leadingIcon")).toBe("arrow-down");
      expect(downButton.props("disabled")).toBe(true);
    });

    it("emits moveUp on up button click", async () => {
      const wrapper = doMount({ showSortControls: true });
      const [upButton] = wrapper.findAllComponents(KdsButton);
      await upButton.trigger("click");
      expect(wrapper.emitted("moveUp")).toHaveLength(1);
    });

    it("emits moveDown on down button click", async () => {
      const wrapper = doMount({ showSortControls: true });
      const [, downButton] = wrapper.findAllComponents(KdsButton);
      await downButton.trigger("click");
      expect(wrapper.emitted("moveDown")).toHaveLength(1);
    });
  });

  describe("isHidingControlHeader", () => {
    it("sets marginTop to 20px when not hiding control header", () => {
      const wrapper = doMount({ isHidingControlHeader: false });
      expect(wrapper.find(".item-controls").attributes("style")).toContain(
        "margin-top: 20px",
      );
    });

    it("sets marginTop to 0px when hiding control header", () => {
      const wrapper = doMount({ isHidingControlHeader: true });
      expect(wrapper.find(".item-controls").attributes("style")).toContain(
        "margin-top: 0px",
      );
    });
  });
});
