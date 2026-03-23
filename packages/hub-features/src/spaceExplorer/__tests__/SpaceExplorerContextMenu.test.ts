import {
  useAuthStore,
  useDownloadsStore,
  useExecutionContextStore,
} from "#imports";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { nextTick, ref } from "vue";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import { flushPromises, mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";

import { MenuItems } from "@knime/components";

import { toastServiceMock } from "~/__shared/test-utils/mockToastService";
import type { MenuItemWithHandler } from "~/composables/contextMenu";
import { useWorkflowEditing } from "~/composables/workflowEditing/useWorkflowEditing";
import type { EditSession } from "~/composables/workflowEditing/useWorkflowEditingSessions";
import type { HubFileExplorerItem } from "../SpaceExplorer.vue";
import SpaceExplorerContextMenu from "../SpaceExplorerContextMenu.vue";

vi.mock("~/composables/workflowEditing/useEditingUserData", () => {
  return {
    useEditingUserData: vi.fn(() => ({
      userData: ref({}),
    })),
  };
});

vi.mock("~/composables/workflowEditing/useWorkflowEditing", () => {
  return {
    useWorkflowEditing: vi.fn(() => ({
      workFlowEditingUrl: ref("https://example.com/workflow/editor"),
      isWorkflowEditingPossible: ref(true),
    })),
  };
});

const contextMenuItems = [
  {
    canBeDeleted: true,
    canBeRenamed: true,
    disabled: false,
    id: "1",
    isDirectory: false,
    isOpen: false,
    isOpenableFile: true,
    meta: {
      repositoryItem: {
        id: "1",
        path: "/Users/horst/testpath/to/B",
        type: "Workflow",
      },
    },
    name: "B",
  },
  {
    canBeDeleted: true,
    canBeRenamed: true,
    disabled: false,
    id: "2",
    isDirectory: true,
    isOpen: false,
    isOpenableFile: true,
    meta: {
      repositoryItem: {
        id: "2",
        path: "/Users/horst/testpath/to/C",
        type: "WorkflowGroup",
      },
    },
    name: "C",
  },
  {
    canBeDeleted: true,
    canBeRenamed: true,
    disabled: false,
    id: "3",
    isDirectory: false,
    isOpen: false,
    isOpenableFile: true,
    meta: {
      repositoryItem: {
        id: "3",
        path: "/Users/horst/testpath/to/F",
        type: "Workflow",
      },
    },
    name: "F",
  },
  {
    canBeDeleted: true,
    canBeRenamed: true,
    disabled: false,
    id: "4",
    isDirectory: false,
    isOpen: false,
    isOpenableFile: false,
    meta: {
      repositoryItem: {
        id: "4",
        path: "/Users/horst/testpath/to/Metanode",
        type: "WorkflowTemplate",
      },
    },
    name: "Metanode",
  },
  {
    canBeDeleted: true,
    canBeRenamed: true,
    disabled: false,
    id: "5",
    isDirectory: false,
    isOpen: false,
    isOpenableFile: false,
    meta: {
      repositoryItem: {
        id: "5",
        path: "/Users/horst/testpath/to/Z",
        type: "Data",
      },
    },
    name: "Z",
  },
  {
    canBeDeleted: true,
    canBeRenamed: true,
    disabled: false,
    id: "6",
    isDirectory: false,
    isOpen: false,
    isOpenableFile: true,
    meta: {
      repositoryItem: {
        id: "6",
        path: "/Users/horst/testpath/to/Xyz",
        type: "Workflow",
      },
    },
    name: "Xyz",
  },
  {
    canBeDeleted: true,
    canBeRenamed: true,
    disabled: false,
    id: "7",
    isDirectory: false,
    isOpen: false,
    isOpenableFile: true,
    meta: {
      repositoryItem: {
        id: "7",
        path: "/Users/horst/testpath/to/Component",
        type: "Component",
      },
    },
    name: "Component",
  },
  {
    canBeDeleted: true,
    canBeRenamed: false, // just for the test
    disabled: false,
    id: "8",
    isDirectory: false,
    isOpen: false,
    isOpenableFile: false,
    meta: {
      repositoryItem: {
        id: "8",
        path: "/Users/horst/testpath/to/MetaNode",
        type: "WorkflowTemplate",
      },
    },
    name: "MetaNode",
  },
  {
    canBeDeleted: false, // can't be deleted just fake for test
    canBeRenamed: true,
    disabled: false,
    id: "9",
    isDirectory: false,
    isOpen: false,
    isOpenableFile: true,
    meta: {
      repositoryItem: {
        id: "9",
        path: "/Users/horst/testpath/to/New",
        type: "Unknown",
      },
    },
    name: "New",
  },
];

const { useNuxtAppMock, useRuntimeConfigMock, useRouteMock } = vi.hoisted(
  () => ({
    useNuxtAppMock: vi.fn(),
    useRuntimeConfigMock: vi.fn().mockReturnValue({ public: {} }),
    useRouteMock: vi.fn(),
  }),
);
mockNuxtImport("useNuxtApp", () => useNuxtAppMock);
mockNuxtImport("useRuntimeConfig", () => useRuntimeConfigMock);
mockNuxtImport("useRoute", () => useRouteMock);
mockNuxtImport("navigateTo", () => vi.fn());

describe("SpaceExplorerContextMenu.vue", () => {
  const doMount = ({
    items = [contextMenuItems[0]],
    index = 1,
    element = document.createElement("td"),
    hasServerSession = false,
    editSessionState = { state: "free" } as EditSession,
  } = {}) => {
    const getRepoItemDownloadUrlMock = vi.fn();
    useNuxtAppMock.mockReturnValue({
      $apiURLs: {
        getRepoItemDownloadUrl: getRepoItemDownloadUrlMock,
      },
    });
    useRouteMock.mockReturnValue({
      fullPath: "/some/path",
    });

    const testingPinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: true,
    });

    const downloadsStore = useDownloadsStore(testingPinia);
    const authStore = useAuthStore(testingPinia);
    useExecutionContextStore(testingPinia);

    // @ts-expect-error
    authStore.hasServerSession = hasServerSession;

    const wrapper = mount(SpaceExplorerContextMenu, {
      props: {
        anchor: { item: items[0], index, element, openedBy: "mouse" },
        getEditSessionsState: vi.fn(
          (_workflowId: string) =>
            ({
              ...editSessionState,
            }) as EditSession,
        ),
        onItemClick: () => {},
        closeContextMenu: () => {},
        createRenameOption: vi
          .fn()
          .mockReturnValue({ id: "rename", text: "rename" }),
        createDeleteOption: vi
          .fn()
          .mockReturnValue({ id: "delete", text: "delete" }),
        selectedItems: items as HubFileExplorerItem[],
        generateShortLink: vi.fn().mockReturnValue("/a/shortlink"),
      },
      global: {
        plugins: [testingPinia],
      },
    });

    return {
      wrapper,
      getRepoItemDownloadUrlMock,
      downloadsStore,
      authStore,
    };
  };

  const getAllItems = (wrapper: ReturnType<typeof doMount>["wrapper"]) => {
    return wrapper
      .findComponent(MenuItems)
      .props("items") as MenuItemWithHandler[];
  };

  it("renders the menu", () => {
    const { wrapper } = doMount();
    expect(wrapper.findComponent(MenuItems).exists()).toBe(true);
    expect(getAllItems(wrapper).map((i) => i.id)).toStrictEqual([
      "showDetails",
      "edit",
      "rename",
      "delete",
      "download",
    ]);
  });

  it.each([
    ["Metanode", contextMenuItems[3]],
    ["Component", contextMenuItems[6]],
  ])("hides download if its a %s", (_name, item) => {
    const { wrapper } = doMount({ items: [item] });
    expect(wrapper.findComponent(MenuItems).exists()).toBe(true);
    expect(getAllItems(wrapper).map((i) => i.id)).not.toContain("download");
  });

  describe("delete", () => {
    it("hides delete if it is not allowed", () => {
      const { wrapper } = doMount({ items: [contextMenuItems[8]] });
      expect(wrapper.findComponent(MenuItems).exists()).toBe(true);
      expect(getAllItems(wrapper).map((i) => i.id)).not.toContain("delete");
    });

    it("hides delete if file is open", () => {
      const { wrapper } = doMount({
        items: [{ ...contextMenuItems[8], isOpen: true }],
      });
      expect(wrapper.findComponent(MenuItems).exists()).toBe(true);
      expect(getAllItems(wrapper).map((i) => i.id)).not.toContain("delete");
    });
  });

  describe("rename", () => {
    it("hides rename on multi select", () => {
      const { wrapper } = doMount({
        items: [contextMenuItems[2], contextMenuItems[3]],
      });
      expect(wrapper.findComponent(MenuItems).exists()).toBe(true);
      expect(getAllItems(wrapper).map((i) => i.id)).not.toContain("rename");
    });

    it("hides rename if it is not allowed", () => {
      const { wrapper } = doMount({ items: [contextMenuItems[7]] });
      expect(wrapper.findComponent(MenuItems).exists()).toBe(true);
      expect(getAllItems(wrapper).map((i) => i.id)).not.toContain("rename");
    });
  });

  describe("downloads", () => {
    it("downloads workflow", () => {
      const { wrapper, downloadsStore } = doMount();

      const downloadItem = getAllItems(wrapper).find(
        (item) => item.id === "download",
      );

      expect(downloadItem).not.toBeNull();

      downloadItem?.metadata?.handler?.();

      expect(downloadsStore.startDownload).toHaveBeenCalledWith({
        itemId: "1",
        name: "B",
      });
    });

    it("does not download a workflow group (folder) if we are not logged in", () => {
      const { wrapper, downloadsStore } = doMount({
        items: [contextMenuItems[1]],
      });

      const downloadItem = getAllItems(wrapper).find(
        (item) => item.id === "download",
      );

      expect(downloadItem).not.toBeNull();

      downloadItem?.metadata?.handler?.();

      expect(toastServiceMock.show).toHaveBeenCalledWith(
        expect.objectContaining({ headline: "Login required" }),
      );
      expect(downloadsStore.startDownload).not.toHaveBeenCalled();
    });

    it("downloads a workflow group (folder) if we are logged in", () => {
      const { wrapper, downloadsStore } = doMount({
        items: [contextMenuItems[1]],
        hasServerSession: true,
      });

      const downloadItem = getAllItems(wrapper).find(
        (item) => item.id === "download",
      );

      expect(downloadItem).not.toBeNull();

      downloadItem?.metadata?.handler?.();

      expect(downloadsStore.startDownload).toHaveBeenCalledWith({
        itemId: "2",
        name: "C",
      });
    });
  });

  describe("show details / open folder", () => {
    it.each([
      [
        "workflow",
        contextMenuItems[0],
        "/horst/spaces/testpath/to/B1/current-state",
      ],
      ["folder", contextMenuItems[1], "/horst/spaces/testpath/to/C2/"],
      ["metanode", contextMenuItems[3], null],
      [
        "component",
        contextMenuItems[6],
        "/horst/spaces/testpath/to/Component7/current-state",
      ],
      ["data", contextMenuItems[4], null],
    ])("navigates to details page for %s", async (_type, item, path) => {
      const { wrapper } = doMount({
        items: [item],
        hasServerSession: true,
      });

      const showDetails = getAllItems(wrapper).find(
        (item) => item.id === "showDetails",
      );

      expect(showDetails).not.toBeNull();

      showDetails?.metadata?.handler?.();

      await nextTick();

      if (path === null) {
        expect(wrapper.emitted("showItemDetails")?.[0][0]).toBeUndefined();
      } else {
        expect(wrapper.emitted("showItemDetails")?.[0][0]).toStrictEqual({
          item: item.meta.repositoryItem,
          openInNewTab: false,
        });
      }
    });
  });

  describe("copy shortlink", () => {
    const getCopyShortlinkItem = (wrapper: VueWrapper<any>) => {
      return getAllItems(wrapper).find((item) => item.id === "copyShortlink");
    };

    beforeAll(() => {
      Object.assign(navigator, {
        clipboard: {
          writeText: vi.fn(() => Promise.resolve()),
        },
      });
    });

    it("is not shown if runtime config does not enable it", () => {
      const firstMount = doMount({
        items: [contextMenuItems[0]],
        hasServerSession: true,
      });

      expect(getCopyShortlinkItem(firstMount.wrapper)).toBeUndefined();
      firstMount.wrapper.unmount();

      // remount
      useRuntimeConfigMock.mockImplementation(() => ({
        public: { ENABLE_SHORTLINKS: true },
      }));

      const secondMount = doMount({
        items: [contextMenuItems[0]],
        hasServerSession: true,
      });

      expect(getCopyShortlinkItem(secondMount.wrapper)).toBeDefined();
    });

    it("is not shown if item is not a Workflow or Component", () => {
      const workflow = contextMenuItems[0];
      const data = contextMenuItems[4];
      const component = contextMenuItems[6];
      useRuntimeConfigMock.mockImplementation(() => ({
        public: { ENABLE_SHORTLINKS: true },
      }));

      const mountAndAssert = (
        item: any,
        assert: (wrapper: VueWrapper<any>) => void,
      ) => {
        const { wrapper } = doMount({
          items: [item],
          hasServerSession: true,
        });

        assert(wrapper);
        wrapper.unmount();
      };

      mountAndAssert(workflow, (wrapper) =>
        expect(getCopyShortlinkItem(wrapper)).toBeDefined(),
      );
      mountAndAssert(component, (wrapper) =>
        expect(getCopyShortlinkItem(wrapper)).toBeDefined(),
      );
      mountAndAssert(data, (wrapper) =>
        expect(getCopyShortlinkItem(wrapper)).toBeUndefined(),
      );
    });

    it("copies link to clipboard", async () => {
      useRuntimeConfigMock.mockImplementation(() => ({
        public: { ENABLE_SHORTLINKS: true, PUBLIC_URL: "http://example.com" },
      }));

      const { wrapper } = doMount({
        items: [contextMenuItems[0]],
        hasServerSession: true,
      });

      const item = getCopyShortlinkItem(wrapper);
      item?.metadata?.handler?.();

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        "/a/shortlink",
      );
      await flushPromises();
      expect(toastServiceMock.show).toHaveBeenCalledWith({
        type: "success",
        message: "Short link copied to clipboard",
      });
    });
  });

  describe("edit workflow", () => {
    it("open workflow editor for workflows", async () => {
      const { wrapper } = doMount({
        items: [contextMenuItems[0]],
        hasServerSession: true,
      });

      const editItem = getAllItems(wrapper).find((item) => item.id === "edit");

      expect(editItem).not.toBeNull();

      window.open = vi.fn();

      editItem?.metadata?.handler?.();

      await nextTick();

      expect(window.open).toHaveBeenCalledWith(
        "https://example.com/workflow/editor",
        "_blank",
      );
    });

    it("enables edit if workflow editing is possible", () => {
      const { wrapper } = doMount({
        items: [contextMenuItems[0]],
        hasServerSession: true,
      });

      const editItem = getAllItems(wrapper).find((item) => item.id === "edit");

      expect(editItem).not.toBeNull();
      expect(editItem?.disabled).toBe(false);
    });

    it("disables edit when there's another edit session", () => {
      const composableResult = {
        isWorkflowEditingPossible: ref(true),
      };

      // @ts-expect-error mock
      useWorkflowEditing.mockImplementation(() => composableResult);

      const { wrapper } = doMount({
        items: [contextMenuItems[0]],
        hasServerSession: true,
        editSessionState: {
          state: "locked",
          sessionId: "session-1",
          creator: "user-1",
          workflowId: "workflow-1",
          type: "EDIT_WORKFLOW",
        },
      });

      const editItem = getAllItems(wrapper).find((item) => item.id === "edit");

      expect(editItem).not.toBeNull();
      expect(editItem?.disabled).toBe(true);
    });

    it("does not offer edit for non workflows", () => {
      const { wrapper } = doMount({
        items: [contextMenuItems[1], contextMenuItems[3], contextMenuItems[4]],
        hasServerSession: true,
      });

      expect(getAllItems(wrapper).map((i) => i.id)).not.toContain("edit");
    });

    it("does not show option when editing is not possible", () => {
      const composableResult = {
        isWorkflowEditingPossible: ref(false),
      };

      // @ts-expect-error mock
      useWorkflowEditing.mockImplementation(() => composableResult);

      const { wrapper } = doMount({
        items: [contextMenuItems[0]],
        hasServerSession: true,
      });

      expect(getAllItems(wrapper).map((i) => i.id)).not.toContain("edit");
    });
  });
});
