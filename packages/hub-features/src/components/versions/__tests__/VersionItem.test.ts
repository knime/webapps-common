import { describe, expect, it } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { cloneDeep } from "lodash-es";

import {
  LocalDateTime,
  type MenuItem,
  SubMenu,
  Tooltip,
} from "@knime/components";
import MenuIcon from "@knime/styles/img/icons/menu-options.svg";

import HubAvatar from "../../avatars/HubAvatar.vue";
import LabelList from "../LabelList.vue";
import VersionItem from "../VersionItem.vue";
import type {
  AssignedLabel,
  NamedItemVersion,
  WithAvatar,
  WithLabels,
} from "../types";

const mockVersion: NamedItemVersion & WithAvatar & WithLabels = {
  author: "Mira Mock",
  avatar: {
    kind: "account",
    name: "Mira Mock",
  },
  createdOn: "2025-11-11T11:11:00.000Z",
  labels: [],
  title: "Version 42 Title",
  version: 42,
};

type Props = InstanceType<typeof VersionItem>["$props"];

const doMount = ({ mountProps }: { mountProps?: Partial<Props> } = {}) => {
  const defaultProps: Props = {
    hasAdminRights: true,
    hasEditCapability: true,
    isSelected: false,
    version: mockVersion,
  };

  const wrapper = shallowMount(VersionItem, {
    props: { ...defaultProps, ...mountProps },
    global: {
      stubs: {
        Tooltip,
      },
    },
  });

  const findLabelList = () => wrapper.findComponent(LabelList);

  return { wrapper, findLabelList };
};

const findMenuItemByText = (menuItems: Array<MenuItem>, text: string) =>
  menuItems.find((item) => item.text === text);

describe("VersionItem.vue", () => {
  describe("rendering", () => {
    it("renders basic component", () => {
      const { wrapper, findLabelList } = doMount();

      expect(wrapper.html()).toBeTruthy();
      expect(wrapper.text()).toContain(mockVersion.title);
      expect(wrapper.findComponent(LocalDateTime).exists()).toBe(true);
      expect(wrapper.findComponent(HubAvatar).exists()).toBe(true);
      expect(wrapper.find("p").exists()).toBe(false);
      expect(wrapper.findComponent(MenuIcon).exists()).toBe(true);
      expect(wrapper.findComponent(SubMenu).exists()).toBe(true);
      expect(findLabelList().exists()).toBe(true);
    });

    it("renders labels if assigned to version", () => {
      const assignedLabels: Array<AssignedLabel> = [
        { label: { name: "verified" }, labelId: "1" },
        { label: { name: "deployed" }, labelId: "2" },
      ];
      const version = cloneDeep(mockVersion);
      version.labels = assignedLabels;

      const { findLabelList } = doMount({ mountProps: { version } });

      expect(findLabelList().props("labels")).toEqual(assignedLabels);
    });

    describe("description", () => {
      it("rendering", () => {
        const version = cloneDeep(mockVersion);
        version.description = "First bugfix lorem ipsum";
        const { wrapper } = doMount({
          mountProps: { version },
        });

        expect(wrapper.find("p").text()).toBe("First bugfix lorem ipsum");
      });

      it("truncation", () => {
        const version = cloneDeep(mockVersion);
        version.description =
          "Funny is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";

        const { wrapper } = doMount({
          mountProps: { version },
        });

        expect(wrapper.find("p").text()).toContain(
          "Funny is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy…",
        );
      });

      it("expansion", async () => {
        const version = cloneDeep(mockVersion);
        version.description =
          "Funny is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";

        const { wrapper } = doMount({
          mountProps: { version },
        });

        const findShowMoreButton = () => wrapper.find("p button");
        expect(findShowMoreButton().text()).toBe("Show more");

        await findShowMoreButton().trigger("click");

        expect(wrapper.find("p").text()).toContain(version.description);
        expect(findShowMoreButton().exists()).toBe(false);
      });
    });

    it("renders version number", () => {
      const { wrapper } = doMount();

      expect(wrapper.find(".footer-info").text()).toContain("Created on");
      expect(wrapper.find(".footer-info").text()).toContain(
        ` Version ${mockVersion.version}`,
      );
    });
  });

  describe("actions", () => {
    describe("permissions", () => {
      it("allows actions with admins permissions", () => {
        const { wrapper } = doMount({
          mountProps: {
            hasEditCapability: true,
            hasAdminRights: true,
          },
        });

        const menuItems = wrapper.findComponent(SubMenu).props("items");
        expect(menuItems).toHaveLength(3);

        const showOption = findMenuItemByText(menuItems, "Show this version");
        const restoreOption = findMenuItemByText(
          menuItems,
          "Restore this version",
        );
        const deleteOption = findMenuItemByText(
          menuItems,
          "Delete this version",
        );

        expect(showOption).toBeDefined();
        expect(restoreOption).toBeDefined();
        expect(deleteOption).toBeDefined();
      });
    });

    it("allows actions with edit access", () => {
      const { wrapper } = doMount({
        mountProps: {
          hasEditCapability: true,
          hasAdminRights: false,
        },
      });

      const menuItems = wrapper.findComponent(SubMenu).props("items");
      expect(menuItems).toHaveLength(2);

      const showOption = findMenuItemByText(menuItems, "Show this version");
      const restoreOption = findMenuItemByText(
        menuItems,
        "Restore this version",
      );

      expect(showOption).toBeDefined();
      expect(restoreOption).toBeDefined();
    });
  });

  it.each(["select", "restore", "delete"] as const)(
    "emits item actions",
    async (action) => {
      const { wrapper } = doMount();

      const actionText = {
        select: "Show this version",
        restore: "Restore this version",
        delete: "Delete this version",
      };

      const actionOption = findMenuItemByText(
        wrapper.findComponent(SubMenu).props("items"),
        actionText[action],
      );
      await wrapper
        .findComponent(SubMenu)
        .vm.$emit("item-click", null, actionOption);

      expect(wrapper.emitted(action)).toBeDefined();
    },
  );

  it("hides tooltip when hovering over LabelList item", async () => {
    const assignedLabels = [
      { label: { name: "i hide your tooltip" }, labelId: "1" },
    ];
    const version = cloneDeep(mockVersion);
    version.labels = assignedLabels;
    const { wrapper, findLabelList } = doMount({
      mountProps: {
        version,
      },
    });

    const labelList = findLabelList();
    await labelList.vm.$emit("label-over");

    const getTooltipText = () => wrapper.findComponent(Tooltip).find(".text");

    expect(getTooltipText().exists()).toBe(false);

    await labelList.vm.$emit("label-leave");

    expect(getTooltipText().exists()).toBe(true);
    expect(getTooltipText().text()).toBeTruthy();
  });
});
