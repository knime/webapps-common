import { describe, expect, it } from "vitest";
import { flushPromises, shallowMount } from "@vue/test-utils";
import { find } from "lodash-es";

import { Button, LocalDateTime, SubMenu } from "@knime/components";
import MenuIcon from "@knime/styles/img/icons/menu-options.svg";

import type { HubAvatarData } from "../../avatars";
import HubAvatar from "../../avatars/HubAvatar.vue";
import CurrentState from "../CurrentState.vue";
import type { AssignedLabel, ItemSavepoint } from "../types";

type Props = InstanceType<typeof CurrentState>["$props"];

const mockDate = "2025-01-01T00:00:00+00:00";

const label1: AssignedLabel = {
  labelId: "labelOneId",
  label: {
    name: "Label 1 Name",
    description: "This is a test description.",
  },
};

const label2: AssignedLabel = {
  labelId: "labelTwoId",
  label: {
    name: "Another Label Name",
    description: "Much test. Very label. Wow.",
  },
};

const change1: ItemSavepoint["changes"][number] = {
  author: "Jane Doe",
  createdOn: mockDate,
  eventActionType: "UPDATED",
  message: "Updated item.",
};

const mockAvatar: HubAvatarData = {
  kind: "account",
  name: "Jane Doe",
};

const savepoint: Props["currentStateSavepoint"] = {
  author: "Jane Doe",
  avatar: mockAvatar,
  changes: [change1],
  labels: [label1, label2],
  lastEditedOn: mockDate,
  savepointNumber: 3,
};

describe("CurrentState.vue", () => {
  const doMount = ({ mountProps }: { mountProps?: Partial<Props> } = {}) => {
    const defaultProps: Props = {
      hasEditCapability: true,
      hasPreviousVersion: true,
      isSelected: false,
      currentStateSavepoint: savepoint,
    };

    const wrapper = shallowMount(CurrentState, {
      props: {
        ...defaultProps,
        ...mountProps,
      },
    });

    const findLabelList = () => wrapper.findComponent({ name: "LabelList" });
    const clickMenuItem = (i: number) => {
      const subMenu = wrapper.getComponent(SubMenu);
      subMenu.vm.$emit("item-click", null, subMenu.props("items")[i]);
    };

    return {
      wrapper,
      findLabelList,
      clickMenuItem,
    };
  };

  describe("rendering", () => {
    it("renders component", () => {
      const { wrapper, findLabelList } = doMount();

      expect(wrapper.html()).toBeTruthy();
      expect(wrapper.findComponent(LocalDateTime).exists()).toBeTruthy();
      expect(wrapper.findComponent(HubAvatar).exists()).toBeTruthy();
      expect(wrapper.findComponent(MenuIcon).exists()).toBeTruthy();
      expect(wrapper.findComponent(SubMenu).exists()).toBeTruthy();

      const labelList = findLabelList();
      expect(labelList.exists()).toBe(true);
      expect(labelList.props("labels")).toEqual([label1, label2]);
    });

    it("reacts to isSelected state", async () => {
      const { wrapper } = doMount({ mountProps: { isSelected: false } });
      expect(wrapper.find(".current-state").classes()).not.toContain(
        "selected",
      );

      await wrapper.setProps({ isSelected: true });
      expect(wrapper.find(".current-state").classes()).toContain("selected");
    });
  });

  describe("actions", () => {
    describe("handles selection", () => {
      it("select", () => {
        const { wrapper } = doMount();

        wrapper.find(".current-state").trigger("click");
        expect(wrapper.emitted("select")).toBeDefined();
      });

      it("already selected", () => {
        const { wrapper } = doMount({ mountProps: { isSelected: true } });

        wrapper.find(".current-state").trigger("click");
        expect(wrapper.emitted("select")).toBeUndefined();
      });
    });

    it("handles create version", async () => {
      const { wrapper } = doMount();

      await wrapper.find(".create-button").trigger("click");
      expect(wrapper.emitted("createVersion")).toBeDefined();
      expect(wrapper.emitted("select")).toBeUndefined();
    });

    it("handles pending changes deletion", async () => {
      const { wrapper, clickMenuItem } = doMount();

      clickMenuItem(0);
      await flushPromises();

      expect(wrapper.emitted("discard")).toBeDefined();
    });

    it("conditionally enables discard action", () => {
      const { wrapper } = doMount({
        mountProps: {
          hasEditCapability: true,
          hasPreviousVersion: true,
        },
      });

      const discardItem = find(wrapper.getComponent(SubMenu).props("items"), {
        text: "Discard",
      });
      expect(discardItem).toBeDefined();
    });

    it.each([
      { hasEditCapability: false },
      { hasPreviousVersion: false },
      { hasEditCapability: false, hasPreviousVersion: false },
    ])("disables discard action (condition: '%o')", async (props) => {
      const { wrapper } = doMount({
        mountProps: {
          hasEditCapability: true,
          hasPreviousVersion: true,
        },
      });

      await wrapper.setProps(props);

      // @ts-expect-error menuItems private field accessed in test
      const discardItem = find(wrapper.vm.menuItems, { text: "Discard" });
      expect(discardItem).toBeUndefined();
    });

    it("enables version creation", () => {
      const { wrapper } = doMount({ mountProps: { hasEditCapability: true } });

      const createButton = wrapper.findComponent(Button);
      expect(createButton.exists()).toBeTruthy();
      expect(createButton.text().toLowerCase()).toContain("create");
    });

    it("disables version creation", () => {
      const { wrapper } = doMount({ mountProps: { hasEditCapability: false } });

      expect(wrapper.findComponent(Button).exists()).toBeFalsy();
    });

    it("hides kebab menu if it has no entries", () => {
      const { wrapper } = doMount({
        mountProps: { hasEditCapability: false },
      });

      expect(wrapper.findComponent(SubMenu).exists()).toBeFalsy();
    });
  });
});
