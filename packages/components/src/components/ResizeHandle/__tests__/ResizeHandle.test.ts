import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import ResizeHandle from "../ResizeHandle.vue";

describe("ResizeHandle.vue", () => {
  type ComponentProps = InstanceType<typeof ResizeHandle>["$props"];

  const doMount = (props: ComponentProps) => {
    const wrapper = mount(ResizeHandle, {
      props,
    });

    return { wrapper };
  };

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("renders a single handle", () => {
    const { wrapper } = doMount({
      numberOfHandles: 1,
      handleWidth: "50%",
    });

    const handleContainers = wrapper.findAll(".handle-container");
    expect(handleContainers).toHaveLength(1);
    expect(handleContainers[0].attributes("style")).toBe(
      "width: calc(50% + 2 * 2px);",
    );
  });

  it("renders multiple handles", () => {
    const { wrapper } = doMount({
      numberOfHandles: 2,
      handleWidth: "33%",
      multipleHandlesHandleGap: "10px",
    });

    const handleContainers = wrapper.findAll(".handle-container");
    expect(handleContainers).toHaveLength(2);
    expect(handleContainers[0].attributes("style")).toBe(
      "width: calc(33% + 2 * 2px);",
    );
    expect(handleContainers[1].attributes("style")).toBe(
      "width: calc(33% + 2 * 2px);",
    );
    expect(wrapper.find(".resize-handle-container").attributes("style")).toBe(
      "gap: 10px;",
    );
  });

  it("renders a connection handle", async () => {
    const { wrapper } = doMount({
      numberOfHandles: 2,
      handleWidth: "33%",
      multipleHandlesHandleGap: "10px",
      connectHandlesOnResize: true,
    });

    const handleContainer = wrapper.find(".handle-container");
    HTMLElement.prototype.setPointerCapture = vi.fn();

    expect(wrapper.find(".handle.connection").exists()).toBeFalsy();
    await handleContainer.trigger("pointerdown", { pointerId: 1, clientY: 50 });
    expect(wrapper.find(".handle.connection").exists()).toBeTruthy();
  });

  describe("events", () => {
    it("listens to pointer events on the handle container", async () => {
      const { wrapper } = doMount({
        numberOfHandles: 1,
        handleWidth: "50%",
      });
      const handleContainer = wrapper.find(".handle-container");
      HTMLElement.prototype.setPointerCapture = vi.fn();

      await handleContainer.trigger("pointerdown", {
        pointerId: 1,
        clientY: 50,
      });
      expect(handleContainer.element.setPointerCapture).toHaveBeenCalled();

      await handleContainer.trigger("pointermove", {
        pointerId: 1,
        clientY: 50.5,
        offsetY: 2,
      });

      expect(wrapper.emitted("resize-move")).toHaveLength(1);
      expect(wrapper.emitted("resize-move")).toStrictEqual([[0.5]]);

      await handleContainer.trigger("pointerup", { pointerId: 1 });
      expect(wrapper.emitted("resize-end")).toHaveLength(1);
    });

    it("does not emit resize move when the move delta is positive and the offset is negative and vice versa", async () => {
      const { wrapper } = doMount({
        numberOfHandles: 1,
        handleWidth: "50%",
      });

      const handleContainer = wrapper.find(".handle-container");
      HTMLElement.prototype.setPointerCapture = vi.fn();
      await handleContainer.trigger("pointerdown", {
        pointerId: 1,
        clientY: 50,
      });

      await handleContainer.trigger("pointermove", {
        pointerId: 1,
        clientY: 50.5,
        offsetY: -2,
      });
      expect(wrapper.emitted("resize-move")).toBeFalsy();

      await handleContainer.trigger("pointermove", {
        pointerId: 1,
        clientY: 49.5,
        offsetY: 2,
      });
      expect(wrapper.emitted("resize-move")).toBeFalsy();
    });

    it("does not set a pointer capture when resizing is disabled", async () => {
      const { wrapper } = doMount({
        numberOfHandles: 1,
        handleWidth: "50%",
        disabled: true,
      });

      const handleContainer = wrapper.find(".handle-container");
      await handleContainer.trigger("pointerdown", {
        pointerId: 1,
        clientY: 50,
      });
      expect(handleContainer.element.setPointerCapture).not.toHaveBeenCalled();
    });

    it("does not emit a resize move when pointerDown has a different pointerId than pointerMove", async () => {
      const { wrapper } = doMount({
        numberOfHandles: 1,
        handleWidth: "50%",
        disabled: true,
      });

      const handleContainer = wrapper.find(".handle-container");
      await handleContainer.trigger("pointerdown", {
        pointerId: null,
        clientY: 50,
      });
      await handleContainer.trigger("pointermove", {
        pointerId: 1,
        clientY: 50.5,
        offsetY: 2,
      });
      expect(wrapper.emitted("resize-move")).toBeFalsy();
    });

    it("does not emit a resize end when pointerDown has a different pointerId than pointerUp", async () => {
      const { wrapper } = doMount({
        numberOfHandles: 1,
        handleWidth: "50%",
        disabled: true,
      });

      const handleContainer = wrapper.find(".handle-container");
      await handleContainer.trigger("pointerdown", {
        pointerId: null,
        clientY: 50,
      });
      await handleContainer.trigger("pointerup", { pointerId: 1 });
      expect(wrapper.emitted("resize-up")).toBeFalsy();
    });
  });
});
