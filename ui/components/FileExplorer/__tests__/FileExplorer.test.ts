/* eslint-disable max-lines */
import * as Vue from "vue";
import { expect, describe, beforeEach, it, vi } from "vitest";
import { DOMWrapper, mount, VueWrapper } from "@vue/test-utils";

import FolderIcon from "webapps-common/ui/assets/img/icons/folder.svg";
import WorkflowIcon from "webapps-common/ui/assets/img/icons/workflow.svg";
import ComponentIcon from "webapps-common/ui/assets/img/icons/node-workflow.svg";
import MetaNodeIcon from "webapps-common/ui/assets/img/icons/workflow-node-stack.svg";

import FileExplorer from "../FileExplorer.vue";
import FileExplorerItemComp from "../FileExplorerItem.vue";
import FileExplorerContextMenu from "../FileExplorerContextMenu.vue";
import { MockIntersectionObserver } from "@/test/utils/mockIntersectionObserver";
import type { FileExplorerItem } from "../types";
import { createSlottedChildComponent } from "@/test/utils/slottedChildComponent";

vi.mock("gsap", () => ({
  gsap: {
    to: (_, { onComplete }) => {
      onComplete();
    },
    killTweensOf: vi.fn(),
  },
}));

describe("FileExplorer.vue", () => {
  const MOCK_DATA: Array<FileExplorerItem> = [
    {
      id: "0",
      name: "Folder 1",
      meta: {
        type: "Folder",
      },
      isDirectory: true,
      isOpenableFile: false,
      isOpen: false,
      canBeRenamed: true,
      canBeDeleted: true,
    },
    {
      id: "1",
      name: "Folder 2",
      meta: {
        type: "Folder",
      },
      isDirectory: true,
      isOpenableFile: false,
      isOpen: false,
      canBeRenamed: true,
      canBeDeleted: true,
    },
    {
      id: "2",
      name: "File 1",
      meta: {
        type: "Workflow",
      },
      isDirectory: false,
      isOpenableFile: true,
      isOpen: false,
      canBeRenamed: true,
      canBeDeleted: true,
    },
    {
      id: "3",
      name: "File 2",
      meta: {
        type: "Workflow",
      },
      isDirectory: false,
      isOpenableFile: true,
      isOpen: false,
      canBeRenamed: true,
      canBeDeleted: true,
    },
    {
      id: "4",
      name: "File 3",
      meta: {
        type: "Component",
      },
      isDirectory: false,
      isOpenableFile: false,
      isOpen: false,
      canBeRenamed: true,
      canBeDeleted: true,
    },
    {
      id: "5",
      name: "File 3",
      meta: {
        type: "Metanode",
      },
      isDirectory: false,
      isOpenableFile: false,
      isOpen: false,
      canBeRenamed: true,
      canBeDeleted: true,
    },
  ];

  const itemIconRenderer = (item: FileExplorerItem) => {
    const typeIcons = {
      Folder: FolderIcon,
      Workflow: WorkflowIcon,
      Component: ComponentIcon,
      Metanode: MetaNodeIcon,
    };

    return typeIcons[item.meta.type];
  };

  const doMount = ({
    props = {},
    customSlots = {
      contextMenu: null,
    },
  } = {}) => {
    const defaultProps = {
      items: MOCK_DATA,
      isRootFolder: true,
      mode: "normal",
      itemIconRenderer,
      activeRenamedItemId: "",
    };

    const slots = {
      // eslint-disable-next-line @typescript-eslint/no-extra-parens
      ...(customSlots.contextMenu
        ? { contextMenu: customSlots.contextMenu }
        : {}),
    };

    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

    const wrapper = mount(FileExplorer, {
      props: { ...defaultProps, ...props },
      slots,
    });

    return { wrapper };
  };

  const getRenderedItems = (_wrapper: VueWrapper<any>) =>
    _wrapper.findAll('[data-test-id="file-explorer-item"]');

  it("should display all files and directories correctly", () => {
    const { wrapper } = doMount();

    const allItems = getRenderedItems(wrapper);

    expect(allItems.length).toBe(MOCK_DATA.length);

    allItems.forEach((item, index) => {
      const icon = itemIconRenderer(MOCK_DATA.at(index));
      expect(wrapper.findComponent(icon).exists()).toBe(true);
    });
  });

  it("should only allow navigating into directories", () => {
    const { wrapper } = doMount();

    const allItems = getRenderedItems(wrapper);
    allItems.at(0).trigger("dblclick");

    expect(wrapper.emitted("changeDirectory")[0][0]).toBe(MOCK_DATA.at(0).id);

    allItems.at(3).trigger("dblclick");
    expect(wrapper.emitted("changeDirectory")[1]).toBeUndefined();
  });

  it("should navigate back to parent", () => {
    const { wrapper } = doMount({ props: { isRootFolder: false } });

    const allItems = getRenderedItems(wrapper);

    // includes go back button
    expect(allItems.length).toBe(MOCK_DATA.length + 1);

    allItems.at(0).trigger("click");
    expect(wrapper.emitted("changeDirectory")[0][0]).toBe("..");
  });

  it("should render placeholder for empty directories", () => {
    const { wrapper } = doMount({ props: { items: [] } });

    expect(getRenderedItems(wrapper).length).toBe(0);
    expect(wrapper.find(".empty").exists()).toBe(true);
  });

  it('should apply the right styles for "mini" mode', () => {
    const { wrapper } = doMount({ props: { mode: "mini" } });

    expect(wrapper.find("tbody").classes()).toContain("mini");
  });

  describe("selection", () => {
    it("should select items and emit selected ones", async () => {
      const { wrapper } = doMount();
      await getRenderedItems(wrapper).at(1).trigger("click");
      await getRenderedItems(wrapper)
        .at(3)
        .trigger("click", { shiftKey: true });
      await getRenderedItems(wrapper).at(5).trigger("click", { ctrlKey: true });

      expect(getRenderedItems(wrapper).at(1).classes()).toContain("selected");
      expect(getRenderedItems(wrapper).at(2).classes()).toContain("selected");
      expect(getRenderedItems(wrapper).at(3).classes()).toContain("selected");
      expect(getRenderedItems(wrapper).at(5).classes()).toContain("selected");

      expect(wrapper.emitted("changeSelection")[0][0]).toEqual(["1"]);
      expect(wrapper.emitted("changeSelection")[1][0]).toEqual(["1", "2", "3"]);
      expect(wrapper.emitted("changeSelection")[2][0]).toEqual([
        "1",
        "2",
        "3",
        "5",
      ]);
    });
  });

  describe("drag", () => {
    beforeEach(() => {
      document.querySelectorAll('[data-id="drag-ghost"]').forEach((el) => {
        el.parentNode.removeChild(el);
      });
    });

    const dragAndDropItem = async (
      _srcItemWrapper: DOMWrapper<Element>,
      _tgtItemWrapper: DOMWrapper<Element> | null,
      dropEffect: "move" | "none" = "move",
      skipDrop = false
    ) => {
      const dataTransfer = { setDragImage: vi.fn() };
      await _srcItemWrapper.trigger("dragstart", { dataTransfer });

      if (_tgtItemWrapper) {
        await _tgtItemWrapper.trigger("dragenter");
        await _tgtItemWrapper.trigger("drag");
        if (!skipDrop) {
          await _tgtItemWrapper.trigger("drop");
        }
      }

      await _srcItemWrapper.trigger("dragend", {
        dataTransfer: { dropEffect },
      });
    };

    it("should add the proper classes when handling dragging events", async () => {
      const dataTransfer = { setDragImage: vi.fn() };
      const { wrapper } = doMount();
      const firstItem = getRenderedItems(wrapper).at(0);
      const secondItem = getRenderedItems(wrapper).at(1);
      const thirdItem = getRenderedItems(wrapper).at(2);

      // select items 1 and 2
      await firstItem.trigger("click");
      await secondItem.trigger("click", { ctrlKey: true });

      // start dragging on 1
      await firstItem.trigger("dragstart", { dataTransfer });

      // selected items (1 & 2) should have the proper class
      expect(firstItem.classes()).toContain("dragging");
      expect(secondItem.classes()).toContain("dragging");
      expect(thirdItem.classes()).not.toContain("dragging");

      // dragging over selected items does not add the dragging-over class
      await firstItem.trigger("dragenter");
      expect(firstItem.classes()).not.toContain("dragging-over");
      await secondItem.trigger("dragenter");
      expect(secondItem.classes()).not.toContain("dragging-over");

      // dragging over non-selected items adds the dragging-over class
      await thirdItem.trigger("dragenter");
      expect(thirdItem.classes()).toContain("dragging-over");

      // leaving drag on non-selected items removes the dragging-over class
      await thirdItem.trigger("dragleave");
      expect(thirdItem.classes()).not.toContain("dragging-over");
    });

    it("should create drag ghosts when dragging items", async () => {
      const { wrapper } = doMount();
      const firstItem = getRenderedItems(wrapper).at(0);
      const secondItem = getRenderedItems(wrapper).at(1);
      const thirdItem = getRenderedItems(wrapper).at(2);

      // select 2nd and 3rd item
      await secondItem.trigger("click");
      await thirdItem.trigger("click", { ctrlKey: true });

      // drag them to 1st item
      await dragAndDropItem(secondItem, firstItem);

      expect(
        document.body.querySelectorAll('[data-id="drag-ghost"]').length
      ).toBe(2);
    });

    it('should only allow dropping on "WorkflowGroup"s', async () => {
      const { wrapper } = doMount();

      // workflow-group item
      const firstItem = getRenderedItems(wrapper).at(0);
      // non workflow-group items
      const thirdItem = getRenderedItems(wrapper).at(2);
      const fourthItem = getRenderedItems(wrapper).at(3);
      const fifthItem = getRenderedItems(wrapper).at(4);

      await dragAndDropItem(firstItem, thirdItem);
      await dragAndDropItem(firstItem, fourthItem);
      await dragAndDropItem(firstItem, fifthItem);
      expect(wrapper.emitted("moveItems")).toBeUndefined();
    });

    it('should emit a "moveItems" event when dropping on a "WorkflowGroup"', async () => {
      const { wrapper } = doMount();

      // workflow-group item
      const firstItem = getRenderedItems(wrapper).at(0);
      // workflow-group item
      const secondItem = getRenderedItems(wrapper).at(1);

      await dragAndDropItem(firstItem, secondItem);

      expect(wrapper.emitted("moveItems")[0][0]).toEqual({
        sourceItems: ["0"],
        targetItem: "1",
        onComplete: expect.any(Function),
      });
    });

    it("should remove drag ghosts and reset selection after a successful move", async () => {
      const { wrapper } = doMount();

      const firstItem = getRenderedItems(wrapper).at(0);
      const secondItem = getRenderedItems(wrapper).at(1);
      const thirdItem = getRenderedItems(wrapper).at(2);

      // select 2nd and 3rd item
      await secondItem.trigger("click");
      await thirdItem.trigger("click", { ctrlKey: true });

      // drag them to 1st item
      await dragAndDropItem(secondItem, firstItem);

      expect(wrapper.emitted("moveItems")[0][0]).toEqual(
        expect.objectContaining({ onComplete: expect.any(Function) })
      );

      // @ts-ignore
      const { onComplete } = wrapper.emitted("moveItems")[0][0];

      // mimic callback being triggered from outside listener
      onComplete(true);

      await Vue.nextTick();

      // ghosts are removed
      expect(
        document.body.querySelectorAll('[data-id="drag-ghost"]').length
      ).toBe(0);

      getRenderedItems(wrapper).forEach((item) => {
        expect(item.classes()).not.toContain("selected");
      });
    });

    it('should not emit a "moveItems" event when the target item is among the selected items', async () => {
      const { wrapper } = doMount();

      // workflow-group item
      const firstItem = getRenderedItems(wrapper).at(0);
      // workflow-group item
      const secondItem = getRenderedItems(wrapper).at(1);

      await getRenderedItems(wrapper).at(0).trigger("click");
      await getRenderedItems(wrapper).at(1).trigger("click", { ctrlKey: true });

      await dragAndDropItem(firstItem, secondItem);

      expect(wrapper.emitted("moveItems")).toBeUndefined();
    });

    it('should emit a "moveItems" event when dropping on the "Go back" item', async () => {
      const { wrapper } = doMount({ props: { isRootFolder: false } });

      // workflow-group item
      const firstItem = getRenderedItems(wrapper).at(0);
      // workflow-group item
      const secondItem = getRenderedItems(wrapper).at(1);

      await dragAndDropItem(secondItem, firstItem);

      expect(wrapper.emitted("moveItems")[0][0]).toEqual({
        sourceItems: ["0"],
        targetItem: "..",
        onComplete: expect.any(Function),
      });
    });

    it('should emit a "dragend" event', async () => {
      const { wrapper } = doMount();

      // workflow-group item
      const firstItem = getRenderedItems(wrapper).at(0);
      // workflow-group item
      const secondItem = getRenderedItems(wrapper).at(1);

      await dragAndDropItem(secondItem, firstItem);

      expect(wrapper.emitted("dragend")[0][0]).toEqual({
        event: expect.anything(),
        sourceItem: MOCK_DATA[1], // second item
        onComplete: expect.any(Function),
      });
    });

    it('should not emit a "dragend" event if drag was cancelled', async () => {
      const { wrapper } = doMount();

      // workflow-group item
      const firstItem = getRenderedItems(wrapper).at(0);

      // workflow-group item
      const secondItem = getRenderedItems(wrapper).at(1);

      await dragAndDropItem(secondItem, firstItem, "none", true);

      expect(wrapper.emitted("dragend")).toBeUndefined();

      expect(wrapper.emitted("drag")[0][0]).toEqual({
        event: expect.anything(),
        item: MOCK_DATA[0], // second item
      });
    });

    it('should emit a "drag" event', async () => {
      const { wrapper } = doMount();

      // workflow-group item
      const firstItem = getRenderedItems(wrapper).at(0);

      // workflow-group item
      const secondItem = getRenderedItems(wrapper).at(1);

      await dragAndDropItem(secondItem, firstItem);
      expect(wrapper.emitted("drag")[0][0]).toEqual({
        event: expect.anything(),
        item: MOCK_DATA[0], // second item
      });
    });
  });

  it("should emit an event when opening a file", () => {
    const { wrapper } = doMount();

    // workflow-group
    getRenderedItems(wrapper).at(0).trigger("dblclick");
    // component
    getRenderedItems(wrapper).at(4).trigger("dblclick");

    expect(wrapper.emitted("openFile")).toBeUndefined();

    // workflow
    getRenderedItems(wrapper).at(3).trigger("dblclick");
    expect(wrapper.emitted("openFile")[0][0]).toEqual(MOCK_DATA[3]);
  });

  it("should show the open indicator for items that specify it", () => {
    const indexOfItemWithIndicator = 3;
    const { wrapper } = doMount({
      props: {
        items: MOCK_DATA.map((item, index) => ({
          ...item,
          isOpen: index === indexOfItemWithIndicator,
        })),
      },
    });

    const items = getRenderedItems(wrapper);
    expect(items.at(0).find(".open-indicator").exists()).toBe(false);
    expect(
      items.at(indexOfItemWithIndicator).find(".open-indicator").exists()
    ).toBe(true);
  });

  describe("context menu", () => {
    const openContextMenu = (
      _wrapper: VueWrapper<any>,
      itemIndex: number,
      position = { clientX: 100, clientY: 100 }
    ) => {
      const item = getRenderedItems(_wrapper).at(itemIndex);

      return item.trigger("contextmenu", position);
    };

    const closeContextMenu = (_wrapper: VueWrapper<any>) => {
      _wrapper.findComponent(FileExplorerContextMenu).vm.$emit("close");
      return Vue.nextTick();
    };

    it("should open menu", async () => {
      const { wrapper } = doMount();

      const firstItem = getRenderedItems(wrapper).at(0);
      const secondItem = getRenderedItems(wrapper).at(1);

      await firstItem.trigger("click");
      await secondItem.trigger("click", { ctrlKey: true });

      await openContextMenu(wrapper, 0);

      expect(wrapper.findComponent(FileExplorerContextMenu).exists()).toBe(
        true
      );

      expect(
        wrapper.findComponent(FileExplorerContextMenu).props("position")
      ).toEqual({
        x: 100,
        y: 100,
      });

      expect(
        wrapper.findComponent(FileExplorerContextMenu).props("selectedItems")
      ).toEqual([MOCK_DATA[0], MOCK_DATA[1]]);

      expect(
        wrapper.findComponent(FileExplorerContextMenu).props("anchor")
      ).toEqual({
        element: firstItem.element,
        index: 0,
        item: MOCK_DATA.at(0),
      });
    });

    it("should close context menu", async () => {
      const { wrapper } = doMount();

      await openContextMenu(wrapper, 0);

      await closeContextMenu(wrapper);
      expect(wrapper.findComponent(FileExplorerContextMenu).exists()).toBe(
        false
      );
    });

    it("should reset selection when opening context menu from an unselected item", async () => {
      const { wrapper } = doMount();

      const firstItem = getRenderedItems(wrapper).at(0);
      const secondItem = getRenderedItems(wrapper).at(1);

      await secondItem.trigger("click");

      await openContextMenu(wrapper, 0);

      expect(
        wrapper.findComponent(FileExplorerContextMenu).props("selectedItems")
      ).toEqual([MOCK_DATA[0]]);

      expect(
        wrapper.findComponent(FileExplorerContextMenu).props("anchor")
      ).toEqual({
        element: firstItem.element,
        index: 0,
        item: MOCK_DATA.at(0),
      });
    });

    describe("rename option", () => {
      const getRenameOptionElement = (_wrapper: VueWrapper<any>) =>
        _wrapper.findComponent(FileExplorerContextMenu).findAll("li").at(0);

      const triggerRename = async (
        _wrapper: VueWrapper<any>,
        itemIndex: number
      ) => {
        await openContextMenu(_wrapper, itemIndex);

        const renameOption = getRenameOptionElement(_wrapper);
        renameOption.trigger("click");
      };

      it("should handle event from contextmenu and activate rename option on item", async () => {
        const { wrapper } = doMount();

        const renamedItemIndex = 0;
        await triggerRename(wrapper, renamedItemIndex);

        // all items' names except the first one, whose rename has been activated
        const expectedBlacklistedNames = MOCK_DATA.slice(1).map(
          ({ name }) => name
        );

        const firstItemComponent = wrapper
          .findAllComponents(FileExplorerItemComp)
          .at(renamedItemIndex);
        expect(firstItemComponent.props("isRenameActive")).toBe(true);
        expect(firstItemComponent.props("blacklistedNames")).toEqual(
          expectedBlacklistedNames
        );
      });

      it("should handle rename submit", async () => {
        const { wrapper } = doMount();

        const renamedItemIndex = 0;
        await triggerRename(wrapper, renamedItemIndex);

        const newName = "this is the new name";
        const itemElement = getRenderedItems(wrapper).at(renamedItemIndex);
        itemElement.find("input").setValue(newName);
        itemElement.find("input").trigger("keyup", { key: "Enter" });

        expect(wrapper.emitted("renameFile")[0][0]).toEqual({
          itemId: MOCK_DATA.at(0).id,
          newName,
        });
      });

      it("should handle rename clear", async () => {
        const { wrapper } = doMount();

        const renamedItemIndex = 0;
        await triggerRename(wrapper, renamedItemIndex);

        const itemElement = getRenderedItems(wrapper).at(renamedItemIndex);
        await itemElement.find("input").trigger("keyup", { key: "Escape" });

        const firstItemComponent = wrapper
          .findAllComponents(FileExplorerItemComp)
          .at(renamedItemIndex);
        expect(firstItemComponent.props("isRenameActive")).toBe(false);
      });

      it("should be disabled if anchor item cannot be renamed", async () => {
        const indexOfItemWithRenameDisabled = 0;
        const { wrapper } = doMount({
          props: {
            items: MOCK_DATA.map((item, index) => ({
              ...item,
              canBeRenamed: index !== indexOfItemWithRenameDisabled,
            })),
          },
        });

        await openContextMenu(wrapper, indexOfItemWithRenameDisabled);

        const renameOption = getRenameOptionElement(wrapper);
        // option is disabled (cannot check attr because MenuItems component doesn't set it)
        expect(renameOption.find("button").classes()).toContain("disabled");

        // attempt clicking it
        await renameOption.trigger("click");

        // rename did not activate
        const itemComponent = wrapper
          .findAllComponents(FileExplorerItemComp)
          .at(indexOfItemWithRenameDisabled);
        expect(itemComponent.props("isRenameActive")).toBe(false);

        await closeContextMenu(wrapper);

        // open different item
        await openContextMenu(wrapper, 1);

        // this one is not disabled
        expect(
          getRenameOptionElement(wrapper).find("button").classes()
        ).not.toContain("disabled");
      });

      it("should be disabled if more than one item is selected", async () => {
        const { wrapper } = doMount();

        await getRenderedItems(wrapper).at(1).trigger("click");
        await getRenderedItems(wrapper)
          .at(3)
          .trigger("click", { shiftKey: true });

        await openContextMenu(wrapper, 1);

        const renameOption = getRenameOptionElement(wrapper);
        // option is disabled (cannot check attr because MenuItems component doesn't set it)
        expect(renameOption.find("button").classes()).toContain("disabled");

        // attempt clicking it
        await renameOption.trigger("click");

        // rename did not activate
        const itemComponent = wrapper
          .findAllComponents(FileExplorerItemComp)
          .at(1);
        expect(itemComponent.props("isRenameActive")).toBe(false);
      });
    });

    describe("delete option", () => {
      const getDeleteOptionElement = (_wrapper: VueWrapper<any>) =>
        _wrapper.findComponent(FileExplorerContextMenu).findAll("li").at(1);

      it("should handle delete event", async () => {
        const { wrapper } = doMount();

        const firstItem = getRenderedItems(wrapper).at(0);
        const secondItem = getRenderedItems(wrapper).at(1);
        await firstItem.trigger("click");
        await secondItem.trigger("click", { ctrlKey: true });

        await openContextMenu(wrapper, 0);

        const deleteOption = getDeleteOptionElement(wrapper);
        deleteOption.trigger("click");

        expect(wrapper.emitted("deleteItems")[0][0]).toEqual({
          items: [MOCK_DATA.at(0), MOCK_DATA.at(1)],
        });
      });

      it("should be disabled if anchor item cannot be deleted", async () => {
        const indexOfItemWithDeleteDisabled = 0;
        const { wrapper } = doMount({
          props: {
            items: MOCK_DATA.map((item, index) => ({
              ...item,
              canBeDeleted: index !== indexOfItemWithDeleteDisabled,
            })),
          },
        });

        await openContextMenu(wrapper, indexOfItemWithDeleteDisabled);

        const deleteOption = getDeleteOptionElement(wrapper);
        // option is disabled (cannot check attr because MenuItems component doesn't set it)
        expect(deleteOption.find("button").classes()).toContain("disabled");

        // attempt clicking it
        await deleteOption.trigger("click");

        // delete did not activate
        expect(wrapper.emitted("deleteItems")).toBeUndefined();

        // close menu
        await closeContextMenu(wrapper);

        // open different item
        await openContextMenu(wrapper, 1);

        // this one is not disabled
        expect(
          getDeleteOptionElement(wrapper).find("button").classes()
        ).not.toContain("disabled");
      });

      it("should be disabled if an item in the selection cannot be deleted", async () => {
        const indexOfItemWithDeleteDisabled = 0;
        const { wrapper } = doMount({
          props: {
            items: MOCK_DATA.map((item, index) => ({
              ...item,
              canBeDeleted: index !== indexOfItemWithDeleteDisabled,
            })),
          },
        });

        await getRenderedItems(wrapper).at(0).trigger("click");
        await getRenderedItems(wrapper)
          .at(3)
          .trigger("click", { shiftKey: true });

        // open menu at a different item other than the one that can't be deleted
        await openContextMenu(wrapper, 1);

        const deleteOption = getDeleteOptionElement(wrapper);
        // option is disabled (cannot check attr because MenuItems component doesn't set it)
        expect(deleteOption.find("button").classes()).toContain("disabled");

        // attempt clicking it
        await deleteOption.trigger("click");

        // delete did not activate
        expect(wrapper.emitted("deleteItems")).toBeUndefined();
      });
    });

    describe("slot", () => {
      const doMountCustomWithSlots = ({ props = {} } = {}) => {
        const slottedComponentTemplate = `<div
          id="slotted-component"
          v-bind="scope"
        ></div>`;

        const { renderSlot, getSlottedChildComponent, getSlottedStubProp } =
          createSlottedChildComponent({
            slottedComponentTemplate,
          });

        const mountResults = doMount({
          props,
          customSlots: { contextMenu: renderSlot },
        });

        return {
          ...mountResults,
          getSlottedChildComponent,
          getSlottedStubProp,
        };
      };

      it("should render a custom component on the contextmenu slot", async () => {
        const { wrapper, getSlottedChildComponent } = doMountCustomWithSlots();

        await openContextMenu(wrapper, 0);
        expect(getSlottedChildComponent(wrapper).exists()).toBe(true);
      });

      it("should provide contextmenu-related values on the slot as props", async () => {
        const { wrapper, getSlottedStubProp } = doMountCustomWithSlots();

        const firstItem = getRenderedItems(wrapper).at(0);
        await openContextMenu(wrapper, 0, { clientX: 200, clientY: 200 });

        expect(getSlottedStubProp({ wrapper, propName: "items" })).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: "rename",
              disabled: false,
            }),
            expect.objectContaining({
              id: "delete",
              disabled: false,
            }),
          ])
        );
        expect(getSlottedStubProp({ wrapper, propName: "anchor" })).toEqual({
          item: MOCK_DATA.at(0),
          element: firstItem.element,
          index: 0,
        });
        expect(
          getSlottedStubProp({ wrapper, propName: "isContextMenuVisible" })
        ).toBe(true);
        expect(getSlottedStubProp({ wrapper, propName: "position" })).toEqual({
          x: 200,
          y: 200,
        });
      });

      it.each([
        [
          "createRenameOption",
          { id: "rename", text: "Rename", disabled: false },
        ],
        [
          "createDeleteOption",
          { id: "delete", text: "Delete", disabled: false },
        ],
      ])(
        'should provide a "%s" function on the slot',
        async (expectedFunctionName, expectedReturnValue) => {
          const { wrapper, getSlottedStubProp } = doMountCustomWithSlots();

          await openContextMenu(wrapper, 0);

          const getOptionFn = getSlottedStubProp({
            wrapper,
            propName: expectedFunctionName,
          });
          expect(typeof getOptionFn === "function").toBe(true);
          const optionValue = getOptionFn(MOCK_DATA.at(0));
          expect(optionValue).toEqual(expectedReturnValue);
        }
      );

      it("should set the correct `disabled` value to the rename option", async () => {
        const indexOfItemWithRenameDisabled = 0;
        const items = MOCK_DATA.map((item, index) => ({
          ...item,
          canBeRenamed: index !== indexOfItemWithRenameDisabled,
        }));

        const { wrapper, getSlottedStubProp } = doMountCustomWithSlots({
          props: { items },
        });

        await openContextMenu(wrapper, indexOfItemWithRenameDisabled);

        const assertRenameOptionIsDisabled = () => {
          const createRenameOptionFn = getSlottedStubProp({
            wrapper,
            propName: "createRenameOption",
          });
          expect(createRenameOptionFn(items.at(0)).disabled).toBe(true);
        };

        // disabled based on item's `canBeRenamed` property
        assertRenameOptionIsDisabled();

        // START OVER
        await closeContextMenu(wrapper);

        const secondItem = getRenderedItems(wrapper).at(1);
        const thirdItem = getRenderedItems(wrapper).at(2);

        await secondItem.trigger("click");
        await thirdItem.trigger("click", { ctrlKey: true });

        await openContextMenu(wrapper, 1);

        // disabled because multiple selection is active
        assertRenameOptionIsDisabled();
      });

      it("should set the correct `disabled` value to the delete option", async () => {
        const indexOfItemWithDeleteDisabled = 0;
        const items = MOCK_DATA.map((item, index) => ({
          ...item,
          canBeDeleted: index !== indexOfItemWithDeleteDisabled,
        }));

        const { wrapper, getSlottedStubProp } = doMountCustomWithSlots({
          props: { items },
        });

        await openContextMenu(wrapper, indexOfItemWithDeleteDisabled);

        // disabled based on item's `canBeDeleted` property
        const createDeleteOptionFn = getSlottedStubProp({
          wrapper,
          propName: "createDeleteOption",
        });
        expect(createDeleteOptionFn(items.at(0)).disabled).toBe(true);
      });

      it.each([
        ["createRenameOption", { id: "rename" }],
        ["createDeleteOption", { id: "delete" }],
      ])(
        "should allow sending custom values to the default options",
        async (createOptionFnName, baseValue) => {
          const { wrapper, getSlottedStubProp } = doMountCustomWithSlots();

          await openContextMenu(wrapper, 0);
          const getOptionFn = getSlottedStubProp({
            wrapper,
            propName: createOptionFnName,
          });
          const option = getOptionFn(MOCK_DATA.at(0), {
            text: "custom text",
            title: "custom title",
            disabled: true,
          });
          expect(option).toEqual({
            ...baseValue,
            text: "custom text",
            title: "custom title",
            disabled: true,
          });
        }
      );

      it('should expose an "onItemClick" function on the slot', async () => {
        const { wrapper, getSlottedStubProp } = doMountCustomWithSlots();

        await openContextMenu(wrapper, 0);
        const onItemClick = getSlottedStubProp({
          wrapper,
          propName: "onItemClick",
        });
        expect(typeof onItemClick === "function").toBe(true);
      });
    });
  });
});
