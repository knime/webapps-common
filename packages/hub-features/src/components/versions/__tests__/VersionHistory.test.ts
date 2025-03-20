import { describe, expect, it } from "vitest";
import { shallowMount } from "@vue/test-utils";

import { IdleReadyButton } from "@knime/components";

import NoVersionItem from "../NoVersionItem.vue";
import VersionHistory from "../VersionHistory.vue";
import VersionItem from "../VersionItem.vue";
import { CURRENT_STATE_VERSION } from "../constants";
import type { NamedItemVersion, WithAvatar, WithLabels } from "../types";

const mockVersions: Array<NamedItemVersion & WithAvatar & WithLabels> = [
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
    title: "Version 2",
    version: 2,
  },
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

type Props = InstanceType<typeof VersionHistory>["$props"];

const doMount = ({
  mountProps,
}: {
  mountProps?: Partial<Props>;
} = {}) => {
  const defaultProps: Props = {
    hasAdminRights: true,
    hasEditCapability: true,
    hasLoadedAllVersions: false,
    hasUnversionedChanges: false,
    loading: false,
    selectedVersion: CURRENT_STATE_VERSION,
    versionHistory: mockVersions,
  };

  const wrapper = shallowMount(VersionHistory, {
    props: { ...defaultProps, ...mountProps },
  });

  const findLoadMoreButton = () => wrapper.findComponent(IdleReadyButton);

  return { wrapper, findLoadMoreButton };
};

describe("VersionHistory.vue", () => {
  it("renders component", () => {
    const { wrapper, findLoadMoreButton } = doMount();

    expect(wrapper.html()).toBeTruthy();
    expect(wrapper.findAllComponents(VersionItem).length).toBe(2);

    const loadMoreButton = findLoadMoreButton();
    expect(loadMoreButton.exists()).toBe(true);
  });

  it("renders no versions component when no versions to display", () => {
    const { wrapper, findLoadMoreButton } = doMount({
      mountProps: {
        hasLoadedAllVersions: true,
        versionHistory: [],
      },
    });

    expect(wrapper.html()).toBeTruthy();
    expect(wrapper.findComponent(NoVersionItem).exists()).toBe(true);
    expect(findLoadMoreButton().exists()).toBe(false);
  });

  it('stops rendering "show all" button when all is loaded', async () => {
    const { wrapper, findLoadMoreButton } = doMount({
      mountProps: {
        hasLoadedAllVersions: false,
      },
    });
    expect(findLoadMoreButton().exists()).toBe(true);

    await wrapper.setProps({ hasLoadedAllVersions: true });
    expect(wrapper.findComponent(findLoadMoreButton).exists()).toBe(false);
  });

  describe("events", () => {
    it('loads all version on "show all"', async () => {
      const { wrapper, findLoadMoreButton } = doMount();
      await findLoadMoreButton().vm.$emit("click");

      expect(wrapper.emitted()).toEqual({ loadAll: [[]] });
    });

    it("handles VersionItem delete", async () => {
      const { wrapper } = doMount();

      const versionItems = await wrapper.findAllComponents(VersionItem);

      versionItems.at(0)?.vm.$emit("delete");
      versionItems.at(1)?.vm.$emit("delete");

      expect(wrapper.emitted()).toEqual({
        delete: [[mockVersions[0].version], [mockVersions[1].version]],
      });
    });

    it("handles VersionItem restore", async () => {
      const { wrapper } = doMount();

      const versionItems = await wrapper.findAllComponents(VersionItem);

      versionItems.at(0)?.vm.$emit("restore");
      versionItems.at(1)?.vm.$emit("restore");

      expect(wrapper.emitted()).toEqual({
        restore: [[mockVersions[0].version], [mockVersions[1].version]],
      });
    });

    it("handles VersionItem select", async () => {
      const { wrapper } = doMount();

      const versionItems = await wrapper.findAllComponents(VersionItem);

      versionItems.at(0)?.vm.$emit("select", true); // select
      versionItems.at(0)?.vm.$emit("select", false); // deselect
      versionItems.at(1)?.vm.$emit("select", true);
      versionItems.at(1)?.vm.$emit("select", false);

      expect(wrapper.emitted()).toEqual({
        select: [
          [mockVersions[0].version],
          [null],
          [mockVersions[1].version],
          [null],
        ],
      });
    });
  });
});
