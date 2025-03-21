import { describe, expect, it } from "vitest";
import { shallowMount } from "@vue/test-utils";

import { FunctionButton } from "@knime/components";
import CloseIcon from "@knime/styles/img/icons/close.svg";
import HistoryIcon from "@knime/styles/img/icons/history.svg";

import CurrentState from "../CurrentState.vue";
import ManageVersions from "../ManageVersions.vue";
import VersionHistory from "../VersionHistory.vue";
import { CURRENT_STATE_VERSION } from "../constants";
import type {
  ItemSavepoint,
  NamedItemVersion,
  WithAvatar,
  WithLabels,
} from "../types";

type Props = InstanceType<typeof ManageVersions>["$props"];

const mockHistory: Array<NamedItemVersion & WithAvatar & WithLabels> = [
  {
    author: "Max Mustermock",
    avatar: {
      kind: "account",
      name: "Max Mustermock",
    },
    createdOn: "2025-11-11T11:11:00.000Z",
    labels: [
      {
        label: {
          name: "Mock Label",
        },
        labelId: "MockLabelId",
      },
    ],
    title: "Version 1",
    version: 1,
  },
];

const mockSavepoint: ItemSavepoint & WithAvatar & WithLabels = {
  author: mockHistory[0].author,
  changes: [],
  lastEditedOn: "2025-11-11T11:11:00.000Z",
  savepointNumber: 1,
  avatar: mockHistory[0].avatar,
  labels: [],
};

const doMount = ({ mountProps }: { mountProps?: Partial<Props> } = {}) => {
  const defaultProps: Props = {
    currentVersion: CURRENT_STATE_VERSION,
    hasAdminRights: true,
    hasEditCapability: true,
    hasLoadedAllVersions: false,
    hasUnversionedChanges: true,
    loading: false,
    versionHistory: mockHistory,
    unversionedSavepoint: mockSavepoint,
  };
  const wrapper = shallowMount(ManageVersions, {
    props: { ...defaultProps, ...mountProps },
  });

  return { wrapper };
};

describe("ManageVersions.vue", () => {
  describe("rendering", () => {
    it("renders component", () => {
      const { wrapper } = doMount();
      expect(wrapper.html()).toBeTruthy();

      const closeButton = wrapper.findComponent(FunctionButton);
      expect(closeButton.exists()).toBe(true);
      expect(closeButton.findComponent(CloseIcon).exists()).toBe(true);
      expect(wrapper.find("h4").text()).toBe("Version history");
      expect(wrapper.findComponent(HistoryIcon).exists()).toBe(true);
      expect(wrapper.findComponent(CurrentState).exists()).toBe(true);
    });

    it("renders item changes", async () => {
      const { wrapper } = doMount({
        mountProps: { hasUnversionedChanges: false },
      });
      expect(wrapper.findComponent(CurrentState).exists()).toBe(false);

      await wrapper.setProps({ hasUnversionedChanges: true });
      expect(wrapper.findComponent(CurrentState).exists()).toBe(true);
    });
  });

  describe("event handling", () => {
    it("handles close button click", async () => {
      const { wrapper } = doMount();
      const closeButton = wrapper.findComponent(FunctionButton);
      expect(closeButton.classes()).toContain("close");
      await closeButton.vm.$emit("click");
      expect(wrapper.emitted()).toEqual({ close: [[]] });
    });

    describe("currentState events", () => {
      it("select", async () => {
        const { wrapper } = doMount();
        await wrapper.findComponent(CurrentState).vm.$emit("select");
        expect(wrapper.emitted()).toEqual({
          select: [[CURRENT_STATE_VERSION]],
        });
      });

      it("createVersion", async () => {
        const { wrapper } = doMount();
        await wrapper.findComponent(CurrentState).vm.$emit("createVersion");
        expect(wrapper.emitted()).toEqual({
          create: [[]],
        });
      });
    });

    describe("versionHistory events", () => {
      it("select version", async () => {
        const { wrapper } = doMount();
        await wrapper.findComponent(VersionHistory).vm.$emit("select", 42);
        expect(wrapper.emitted()).toEqual({
          select: [[42]],
        });
      });

      it("deselect version", async () => {
        const { wrapper } = doMount();
        await wrapper.findComponent(VersionHistory).vm.$emit("select", null);
        expect(wrapper.emitted()).toEqual({
          select: [[CURRENT_STATE_VERSION]],
        });
      });

      it("delete version", async () => {
        const { wrapper } = doMount();
        await wrapper.findComponent(VersionHistory).vm.$emit("delete", 42);
        expect(wrapper.emitted()).toEqual({
          delete: [[42]],
        });
      });

      it("restore version", async () => {
        const { wrapper } = doMount();
        await wrapper.findComponent(VersionHistory).vm.$emit("restore", 42);
        expect(wrapper.emitted()).toEqual({
          restore: [[42]],
        });
      });

      it("loadAll versions", async () => {
        const { wrapper } = doMount();
        await wrapper.findComponent(VersionHistory).vm.$emit("loadAll");
        expect(wrapper.emitted()).toEqual({
          loadAll: [[]],
        });
      });
    });
  });
});
