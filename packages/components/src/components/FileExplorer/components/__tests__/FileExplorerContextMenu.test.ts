import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { mount } from "@vue/test-utils";
import { useFloating } from "@floating-ui/vue";

import MenuItems from "../../../base/MenuItem/MenuItems.vue";
import FileExplorerContextMenu from "../../components/FileExplorerContextMenu.vue";
import { MockIntersectionObserver } from "../../composables/useTestUtils";
import type { Anchor, FileExplorerItem } from "../../types";

vi.mock("@floating-ui/vue", () => ({
  useFloating: vi.fn().mockReturnValue({
    update: vi.fn(),
    floatingStyles: {},
  }),
  offset: vi.fn((options) => options),
  autoUpdate: vi.fn(),
  shift: vi.fn(),
  flip: vi.fn(),
}));

describe("FileExplorerContextMenu", () => {
  beforeAll(() => {
    window.innerHeight = 100;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockItem = {
    id: "0",
    name: "Mock item",
    canBeRenamed: true,
    canBeDeleted: true,
    isOpen: false,
    isOpenableFile: false,
    isDirectory: true,
  } satisfies FileExplorerItem;

  const defaultProps = {
    position: { x: 40, y: 40 },
    anchor: {
      item: mockItem,
      element: document.createElement("td"),
      index: 0,
      openedBy: "mouse",
    } as Anchor,
    isMultipleSelectionActive: false,
    selectedItems: [mockItem],
  };

  type MountOpts = {
    props?: Partial<InstanceType<typeof FileExplorerContextMenu>["$props"]>;
    attachTo?: HTMLElement | string;
  };

  const doMount = ({ props = {}, attachTo }: MountOpts = {}) => {
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

    const wrapper = mount(FileExplorerContextMenu, {
      props: { ...defaultProps, ...props },
      attachTo,
    });

    return { wrapper, MockIntersectionObserver };
  };

  it("should render MenuItems", () => {
    const { wrapper } = doMount();

    const menu = wrapper.findComponent(MenuItems);
    expect(menu.props("items")).toEqual([
      { id: "rename", text: "Rename", disabled: false },
      { id: "delete", text: "Delete", disabled: false },
    ]);
  });

  it("should set the popper offset accounting for the menu height", async () => {
    // @ts-expect-error Type 'Mock<() => { top: number; left: number; height: number; }>' is not assignable to type '() => DOMRect'.
    defaultProps.anchor.element.getBoundingClientRect = vi.fn(() => ({
      top: 0,
      left: 10,
      height: 20,
    }));

    const { wrapper } = doMount();

    const mockMenuHeight = 50;

    wrapper.element.getBoundingClientRect = vi.fn(() => ({
      height: mockMenuHeight,
    }));

    await nextTick();

    // @ts-expect-error Property 'mock' does not exist on type

    const [_, __, options] = useFloating.mock.calls[0];
    expect(options.middleware.value[0]).toStrictEqual({
      crossAxis: 30,
      mainAxis: -90,
    });
  });

  it("should hide the menu if the anchor is not visible", async () => {
    const { wrapper, MockIntersectionObserver } = doMount({
      attachTo: document.body,
    });

    expect(wrapper.isVisible()).toBe(true);

    MockIntersectionObserver.__trigger__(false);

    await nextTick();

    expect(wrapper.isVisible()).toBe(false);
    wrapper.unmount();
  });

  it("should set the popper offset accounting distance to the window bottom", async () => {
    // @ts-expect-error Type 'Mock<() => { top: number; left: number; height: number; }>' is not assignable to type '() => DOMRect'.
    defaultProps.anchor.element.getBoundingClientRect = vi.fn(() => ({
      top: 20,
      left: 10,
      height: 20,
    }));

    const mockMenuHeight = 50;

    const { wrapper } = doMount({
      props: { position: { ...defaultProps.position, y: 80 } },
    });

    wrapper.element.getBoundingClientRect = vi.fn(() => ({
      height: mockMenuHeight,
    }));

    await nextTick();

    // @ts-expect-error Property 'mock' does not exist on type

    const [_, __, options] = useFloating.mock.calls[0];
    expect(options.middleware.value[0]).toStrictEqual({
      crossAxis: 30,
      mainAxis: -60,
    });
  });

  it.each([
    ["rename", { id: "rename" }, { isDelete: false, isRename: true }],
    ["delete", { id: "delete" }, { isDelete: true, isRename: false }],
  ])(
    "should emit an `itemClick` event when clicking on the %s option",
    async (optionName, optionId, payloadProps) => {
      const { wrapper } = doMount();

      const optionIndex = optionName === "rename" ? 0 : 1;

      const menuItem = wrapper
        .findComponent(MenuItems)
        .findAll("li")
        .at(optionIndex)!;
      await menuItem.trigger("click");

      expect(wrapper.emitted("itemClick")![0][0]).toEqual({
        contextMenuItem: expect.objectContaining(optionId),
        anchorItem: defaultProps.anchor.item,
        ...payloadProps,
      });
    },
  );
});
