import { describe, expect, it, vi } from "vitest";
import { isRef, ref } from "vue";
import { flushPromises, shallowMount } from "@vue/test-utils";
import { useEventBus } from "@vueuse/core";
import { useFloating } from "@floating-ui/vue";

import LabelList from "../LabelList.vue";
import type { AssignedLabel } from "../types";

vi.mock("@vueuse/core", () => ({
  useEventBus: vi.fn(),
}));

vi.mock("@floating-ui/vue", () => ({
  offset: vi.fn(),
  autoUpdate: vi.fn(),
  useFloating: vi.fn(() => ({
    floatingStyles: ref({
      left: "11px",
      top: "22px",
    }),
  })),
}));

const defaultLabels: Array<AssignedLabel> = [
  {
    labelId: "1",
    message: "meow",
    label: {
      name: "Maine Coon",
      description:
        "Known for their large size, fluffy coat, and friendly, dog-like personality, Maine Coons are gentle giants of the cat world.",
    },
  },
  {
    labelId: "2",
    message: "meow meow",
    label: {
      name: "Siamese",
      description:
        "Sleek, vocal, and affectionate, Siamese cats are highly social and known for their striking blue eyes and elegant, slender bodies.",
    },
  },
  {
    labelId: "3",
    message: "meow meow meow",
    label: {
      name: "British Shorthair",
      description:
        "With a dense, plush coat and a calm, affectionate nature, British Shorthairs are sturdy cats known for their round faces and charmingly reserved personalities.",
    },
  },
];
const labelCount = 3;

describe("LabelList.vue", () => {
  const doMount = ({
    labels = defaultLabels,
    defaultLabelCount = labelCount,
    deltaTop = 0,
  } = {}) => {
    const onMock = vi.fn();
    const emitMock = vi.fn();

    (useEventBus as ReturnType<typeof vi.fn>).mockImplementation(() => ({
      on: onMock,
      emit: emitMock,
    }));

    const openMenuMock = vi.fn();
    const closeMenuMock = vi.fn();

    const wrapper = shallowMount(LabelList, {
      props: {
        labels,
        defaultLabelCount,
      },
      global: {
        stubs: {
          Popover: {
            template: "<div><slot name='content'></slot></div>",
            methods: {
              openMenu: openMenuMock,
              closeMenu: closeMenuMock,
            },
          },
        },
      },
    });

    vi.spyOn(
      HTMLElement.prototype,
      "getBoundingClientRect",
    ).mockReturnValueOnce({
      top: 0,
      left: 50,
      right: 150,
      bottom: 200,
      width: 100,
      height: 100,
      x: 50,
      y: 100,
      toJSON: () => ({}),
    });

    vi.spyOn(
      HTMLElement.prototype,
      "getBoundingClientRect",
    ).mockReturnValueOnce({
      top: deltaTop,
      left: 50,
      right: 150,
      bottom: 200,
      width: 100,
      height: 100,
      x: 50,
      y: 100,
      toJSON: () => ({}),
    });

    const findLabels = () =>
      wrapper.findAllComponents({ name: "FunctionButton" });
    const findPopover = () => wrapper.findComponent({ name: "Popover" });
    const findPopoverHeadline = () => wrapper.find(".headline");
    const findPopoverMessage = () => wrapper.find(".message");
    const findPopoverDescription = () => wrapper.find(".description");
    const findFloatingPanel = () => wrapper.find(".floating-panel");

    const triggerLabelClick = async (index: number) => {
      vi.useFakeTimers();
      const labels = findLabels();
      labels.at(index)?.trigger("click");

      vi.advanceTimersByTime(2);
      await flushPromises();
    };

    return {
      wrapper,
      findLabels,
      findPopover,
      findPopoverHeadline,
      findPopoverMessage,
      findPopoverDescription,
      findFloatingPanel,
      triggerLabelClick,
      openMenuMock,
      closeMenuMock,
      onMock,
      emitMock,
    };
  };

  it("renders with given labels", () => {
    const { findLabels } = doMount({ labels: defaultLabels });
    const labels = findLabels();
    expect(labels.length).toBe(defaultLabels.length);

    labels.forEach((label, index) =>
      expect(label.text()).toBe(defaultLabels[index].label.name),
    );
  });

  it("truncates labels and shows additional button", () => {
    const defaultLabelCount = 1;
    const { findLabels } = doMount({ defaultLabelCount });
    const labels = findLabels();

    // +1 for the show more button
    expect(labels.length).toBe(defaultLabelCount + 1);

    const showMoreButton = labels.at(defaultLabelCount);
    expect(showMoreButton).toBeDefined();
    expect(showMoreButton!.text()).toBe(`+${labelCount - defaultLabelCount}`);
  });

  it("initiates eventBus", () => {
    doMount();
    expect(useEventBus).toHaveBeenCalledWith("versionLabels");
  });

  it("initiates floatingUi", () => {
    doMount();

    const useFloatingArgs = vi.mocked(useFloating).mock.calls[0];

    expect(isRef(useFloatingArgs[0])).toBe(true);
    expect(isRef(useFloatingArgs[1])).toBe(true);
    expect(useFloatingArgs[2]).toEqual({
      middleware: expect.any(Array),
      placement: "left-start",
      strategy: "fixed",
      whileElementsMounted: expect.any(Function),
    });
  });

  describe("label interaction", () => {
    it("shows all labels when show more button is clicked", async () => {
      const defaultLabelCount = 1;
      const { findLabels } = doMount({ defaultLabelCount });
      const labels = findLabels();

      const showMoreButton = labels.at(defaultLabelCount);
      await showMoreButton?.trigger("click");

      const allLabels = findLabels();
      expect(allLabels.length).toBe(labelCount);
    });

    it("emits over and leaves events", async () => {
      const { wrapper, findLabels } = doMount();
      const labels = findLabels();

      await labels.at(0)?.trigger("mouseover");
      expect(wrapper.emitted("labelOver")).toBeDefined();

      await labels.at(0)?.trigger("mouseleave");
      expect(wrapper.emitted("labelLeave")).toBeDefined();
    });

    it("shows and populates popover on click on label", async () => {
      const {
        openMenuMock,
        emitMock,
        findPopoverHeadline,
        findPopoverDescription,
        findPopoverMessage,
        triggerLabelClick,
      } = doMount({
        labels: defaultLabels,
      });

      await triggerLabelClick(0);

      expect(emitMock).toHaveBeenCalledWith("versionLabelShowPopover");
      expect(openMenuMock).toHaveBeenCalled();

      expect(findPopoverHeadline().text()).toBe(defaultLabels[0].label.name);
      expect(findPopoverDescription().text()).toBe(
        defaultLabels[0].label.description,
      );
      expect(findPopoverMessage().text()).toBe(defaultLabels[0].message);
    });

    it("closes popover on additional click on label", async () => {
      const {
        findPopoverHeadline,
        triggerLabelClick,
        findPopoverDescription,
        findPopoverMessage,
        closeMenuMock,
      } = doMount({
        labels: defaultLabels,
      });

      // show
      await triggerLabelClick(0);
      // hide again
      await triggerLabelClick(0);

      expect(closeMenuMock).toHaveBeenCalled();
      expect(findPopoverHeadline().text()).toBe("");
      expect(findPopoverDescription().text()).toBe("");
      expect(findPopoverMessage().text()).toBe("");
    });

    it("updates popover position", async () => {
      const deltaTop = 100;
      const { findFloatingPanel, triggerLabelClick } = doMount({
        labels: defaultLabels,
        deltaTop,
      });

      expect(findFloatingPanel().attributes("style")).toBe(
        "left: 11px; top: 22px;",
      );

      await triggerLabelClick(0);
      expect(findFloatingPanel().attributes("style")).toBe(
        `left: 11px; top: ${22 + deltaTop}px;`,
      );
    });

    it("closes popover on event bus event", async () => {
      const {
        triggerLabelClick,
        closeMenuMock,
        onMock,
        findPopoverHeadline,
        findPopoverDescription,
        findPopoverMessage,
      } = doMount({
        labels: defaultLabels,
      });

      // show
      await triggerLabelClick(0);
      // hide via event emitter
      const onMockCallback = vi.mocked(onMock).mock.calls[0][0];
      await onMockCallback("versionLabelShowPopover");

      expect(closeMenuMock).toHaveBeenCalled();
      expect(findPopoverHeadline().text()).toBe("");
      expect(findPopoverDescription().text()).toBe("");
      expect(findPopoverMessage().text()).toBe("");
    });
  });
});
