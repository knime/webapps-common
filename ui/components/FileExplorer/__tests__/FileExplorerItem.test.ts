import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import InputField from "webapps-common/ui/components/forms/InputField.vue";
import { SpaceItem } from "@/api/gateway-api/generated-api";

import FileExplorerItemComponent from "../FileExplorerItem.vue";
import FileExplorerItemBase from "../FileExplorerItemBase.vue";
import type { FileExplorerItem } from "../types";

describe("FileExplorerItem.vue", () => {
  const defaultProps = {
    blacklistedNames: [],
    item: {
      id: "0",
      name: "Mock item",
      isOpen: false,
      isDirectory: false,
      isOpenableFile: true,
      canBeDeleted: true,
      canBeRenamed: true,
      meta: {
        type: SpaceItem.TypeEnum.Workflow,
      },
    } satisfies FileExplorerItem,
    isSelected: false,
    isDragging: false,
    isRenameActive: false,
  };

  const doMount = ({ props = {} } = {}) => {
    const wrapper = mount(FileExplorerItemComponent, {
      props: { ...defaultProps, ...props },
    });

    return { wrapper };
  };

  it("should render correctly", () => {
    const { wrapper } = doMount();

    expect(wrapper.find(".item-content").text()).toMatch(
      defaultProps.item.name
    );
    expect(wrapper.find(".item-content").attributes("title")).toEqual(
      defaultProps.item.name
    );
  });

  it("should set the light class for Workflow type items", () => {
    const { wrapper } = doMount({
      props: {
        item: { ...defaultProps.item, type: SpaceItem.TypeEnum.Workflow },
      },
    });

    expect(wrapper.find(".item-content").classes()).toContain("light");
  });

  it("should forward `isDragging` and `isSelected` props", () => {
    const { wrapper } = doMount({
      props: {
        isDragging: true,
        isSelected: true,
      },
    });

    expect(
      wrapper.findComponent(FileExplorerItemBase).props("isDragging")
    ).toBe(true);
    expect(
      wrapper.findComponent(FileExplorerItemBase).props("isSelected")
    ).toBe(true);
  });

  describe("rename", () => {
    const props = { isRenameActive: true };

    it("should render the rename input", () => {
      const { wrapper } = doMount({ props });

      expect(wrapper.findComponent(InputField).exists()).toBe(true);
    });

    it("should render the error message when name is not valid", async () => {
      const { wrapper } = doMount({ props });

      wrapper.find("input").setValue('invalid [*?#:"<>%~|.] string');
      await wrapper.find("input").trigger("keyup", { key: "Enter" });

      expect(wrapper.find(".item-error").exists()).toBe(true);
      expect(wrapper.findComponent(InputField).props("isValid")).toBe(false);
    });

    it('should submit the name and emit "rename:submit" and "rename:clear" events', async () => {
      const { wrapper } = doMount({ props });

      wrapper.find("input").setValue("new name");
      await wrapper.find("input").trigger("keyup", { key: "Enter" });

      expect(wrapper.emitted("rename:submit")[0][0]).toEqual({
        itemId: defaultProps.item.id,
        newName: "new name",
      });
      expect(wrapper.emitted("rename:clear")).toBeDefined();
    });

    it("should not submit name if new name is empty", async () => {
      const { wrapper } = doMount({ props });

      wrapper.find("input").setValue("");
      await wrapper.find("input").trigger("keyup", { key: "Enter" });

      expect(wrapper.emitted("rename:submit")).toBeUndefined();
      expect(wrapper.emitted("rename:clear")).toBeDefined();
    });

    it("should not submit name if name didn't change", async () => {
      const { wrapper } = doMount({ props });

      wrapper.find("input").setValue(defaultProps.item.name);
      await wrapper.find("input").trigger("keyup", { key: "Enter" });

      expect(wrapper.emitted("rename:submit")).toBeUndefined();
      expect(wrapper.emitted("rename:clear")).toBeDefined();
    });

    it("should cancel the rename", async () => {
      const { wrapper } = doMount({ props });

      wrapper.find("input").setValue("new name");
      await wrapper.find("input").trigger("keyup", { key: "Escape" });

      expect(wrapper.emitted("rename:submit")).toBeUndefined();
      expect(wrapper.emitted("rename:clear")).toBeDefined();
    });

    it("should not emit events when rename is active", async () => {
      const { wrapper } = doMount({ props });

      const preventedEvents = [
        "dragstart",
        "dragenter",
        "dragleave",
        "dragend",
        "contextmenu",
        "drop",
        "dblclick",
      ];

      for await (const event of preventedEvents) {
        wrapper.trigger(event);
      }

      expect(wrapper.emitted()).toEqual({});
    });
  });
});
