import {
  type Children,
  useRepositoryStore,
  useWorkflowGroupStore,
} from "#imports";
import { type Mock, describe, expect, it, vi } from "vitest";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { flushPromises, mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";

import { FileExplorer, type FileExplorerItem } from "@knime/components";
import UnknownIcon from "@knime/styles/img/icons/file-question.svg";
import DataIcon from "@knime/styles/img/icons/file-text.svg";
import WorkflowGroupIcon from "@knime/styles/img/icons/folder.svg";
import ComponentIcon from "@knime/styles/img/icons/node-workflow.svg";
import MetaNodeIcon from "@knime/styles/img/icons/workflow-node-stack.svg";
import WorkflowIcon from "@knime/styles/img/icons/workflow.svg";
import { sleep } from "@knime/utils";

import SpaceExplorer from "~/components/spaceExplorer/SpaceExplorer.vue";
import EditSessionAvatar from "../EditSessionAvatar.vue";

const masonControls = {
  "@controls": {
    "knime:delete": {
      href: "https://api.knime.com/repository/Users/darthvader",
      method: "DELETE",
    },
    "knime:move": {},
    "knime:rename": {
      href: "https://api.knime.com/repository/Users/darthvader/{name}",
      method: "PUT",
    },
  },
};

const repoItemDummy: {
  path: string;
  canonicalPath: string;
  items: Pick<Children, "type" | "path" | "id" | "canonicalPath">[];
} = {
  path: "/Users/horst/testpath/to",
  canonicalPath: "/Users/account:id-of-horst/testpath/to",
  items: [
    { type: "Workflow", path: "/Users/horst/testpath/to/B", id: "1" },
    {
      type: "WorkflowGroup",
      path: "/Users/horst/testpath/to/C",
      id: "2",
      canonicalPath: "/Users/account:id-of-horst/testpath/to/C",
    },
    { type: "Workflow", path: "/Users/horst/testpath/to/F", id: "3" },
    {
      type: "WorkflowTemplate",
      path: "/Users/horst/testpath/to/Metanode",
      id: "4",
    },
    { type: "Data", path: "/Users/horst/testpath/to/Z", id: "5" },
    { type: "Workflow", path: "/Users/horst/testpath/to/Xyz", id: "6" },
    {
      type: "Component",
      path: "/Users/horst/testpath/to/Component",
      id: "7",
    },
    {
      type: "WorkflowTemplate",
      path: "/Users/horst/testpath/to/MetaNode",
      id: "8",
    },
    // @ts-expect-error Unknown is not part of the type but we test for it
    { type: "Unknown", path: "/Users/horst/testpath/to/New", id: "9" },
  ],
};

// this is the transformed result of the repo items above
const fileExplorerItems = [
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
        ...masonControls,
        canonicalPath: "/Users/account:id-of-horst/testpath/to/C",
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
    id: "1",
    isDirectory: false,
    isOpen: false,
    isOpenableFile: true,
    meta: {
      repositoryItem: {
        ...masonControls,
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
    id: "7",
    isDirectory: false,
    isOpen: false,
    isOpenableFile: true,
    meta: {
      repositoryItem: {
        ...masonControls,
        id: "7",
        path: "/Users/horst/testpath/to/Component",
        type: "Component",
      },
    },
    name: "Component",
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
        ...masonControls,
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
    id: "8",
    isDirectory: false,
    isOpen: false,
    isOpenableFile: false,
    meta: {
      repositoryItem: {
        ...masonControls,
        id: "8",
        path: "/Users/horst/testpath/to/MetaNode",
        type: "WorkflowTemplate",
      },
    },
    name: "MetaNode",
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
        ...masonControls,
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
    id: "9",
    isDirectory: false,
    isOpen: false,
    isOpenableFile: true,
    meta: {
      repositoryItem: {
        ...masonControls,
        id: "9",
        path: "/Users/horst/testpath/to/New",
        type: "Unknown",
      },
    },
    name: "New",
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
        ...masonControls,
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
    id: "5",
    isDirectory: false,
    isOpen: false,
    isOpenableFile: false,
    meta: {
      repositoryItem: {
        ...masonControls,
        id: "5",
        path: "/Users/horst/testpath/to/Z",
        type: "Data",
      },
    },
    name: "Z",
  },
];
const spaceItemDummy = {
  path: "/Users/horst/horstspace",
  items: [{ type: "Workflow", path: "/Users/horst/horstspace/B" }],
};

const typeIconsMap = {
  WorkflowGroup: WorkflowGroupIcon,
  Workflow: WorkflowIcon,
  WorkflowTemplate: MetaNodeIcon,
  Component: ComponentIcon,
  Data: DataIcon,
};

const unknownTypeIcon = UnknownIcon;

const {
  useNuxtAppMock,
  useRuntimeConfigMock,
  useRouteMock,
  getSessionByWorkflowIdMock,
} = vi.hoisted(() => ({
  useNuxtAppMock: vi.fn(),
  useRuntimeConfigMock: vi.fn().mockReturnValue({
    public: {
      ENABLE_RECYCLE_BIN_PAGE: true,
    },
  }),
  useRouteMock: vi.fn(),
  getSessionByWorkflowIdMock: vi.fn((_: string) => ({
    state: "",
  })),
}));
mockNuxtImport("useNuxtApp", () => useNuxtAppMock);
mockNuxtImport("useRuntimeConfig", () => useRuntimeConfigMock);
mockNuxtImport("useRoute", () => useRouteMock);
mockNuxtImport("navigateTo", () => vi.fn());

vi.mock("~/composables/workflowEditing/useWorkflowEditingSessions", () => ({
  useSessionsForWorkflowIds: () => ({
    getSessionByWorkflowId: getSessionByWorkflowIdMock,
  }),
}));

describe("SpaceExplorer.vue", () => {
  const doMount = ({
    path = repoItemDummy.path,
    canonicalPath = repoItemDummy.canonicalPath,
    items = repoItemDummy.items,
    canDelete = true,
    canRename = true,
  } = {}) => {
    useRouteMock.mockReturnValue({
      fullPath: "/some/path",
    });

    const testingPinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: true,
    });

    const workflowGroupStore = useWorkflowGroupStore(testingPinia);
    const repositoryStore = useRepositoryStore(testingPinia);

    (repositoryStore.deleteItems as Mock).mockResolvedValue({
      succeeded: [],
      failed: [],
    });

    // @ts-expect-error just a test mock only what we need
    workflowGroupStore.item = { path, children: items, canonicalPath };
    // @ts-expect-error its mocked so this works
    workflowGroupStore.childrenById = Object.fromEntries(
      items.map((i) => [i.id, i]),
    );

    (workflowGroupStore.moveOrCopyItems as Mock).mockReturnValue(
      Promise.resolve({
        succeeded: [],
        failed: [],
        conflicts: [],
      }),
    );

    const masonControls = {};
    if (canDelete) {
      masonControls["knime:delete"] = {
        href: "https://api.knime.com/repository/Users/darthvader",
        method: "DELETE",
      };
    }

    if (canRename) {
      masonControls["knime:rename"] = {
        href: "https://api.knime.com/repository/Users/darthvader/{name}",
        method: "PUT",
      };
    }

    const wrapper = mount(SpaceExplorer, {
      props: {
        masonControls,
        generateShortLink: vi.fn().mockReturnValue("/a/link"),
      },
      global: {
        plugins: [testingPinia],
      },
    });

    return { wrapper, repositoryStore, workflowGroupStore };
  };

  it("renders the FileExplorer", () => {
    const { wrapper } = doMount();
    expect(wrapper.findComponent(FileExplorer).exists()).toBe(true);
    expect(wrapper.findComponent(FileExplorer).props("items")).toStrictEqual(
      fileExplorerItems,
    );
    expect(wrapper.findComponent(FileExplorer).props("isRootFolder")).toBe(
      false,
    );
  });

  it("renders a list of repository items", () => {
    const { wrapper } = doMount();

    const items = Object.fromEntries(
      wrapper
        .findComponent(FileExplorer)
        .props("items")
        .map((i) => [i.id, i]),
    ) as Record<string, FileExplorerItem>;

    repoItemDummy.items.forEach((child) => {
      expect(items[child.id]?.name).toEqual(child.path.split("/").pop());

      if (typeIconsMap[child.type]) {
        expect(
          wrapper.findComponent(typeIconsMap[child.type]).exists(),
        ).toBeTruthy();
      } else {
        expect(wrapper.findComponent(unknownTypeIcon).exists()).toBeTruthy();
      }
    });
  });

  it("renders no parent link for space root", () => {
    const { wrapper } = doMount({
      items: spaceItemDummy.items as any,
      path: spaceItemDummy.path,
    });
    expect(wrapper.findComponent(FileExplorer).props("isRootFolder")).toBe(
      true,
    );
  });

  it("renders user avatar for workflows with active editing sessions", () => {
    const editingUser = "user1";
    const firstWorkflow = fileExplorerItems[1];
    const secondWorkflow = fileExplorerItems[3];
    getSessionByWorkflowIdMock.mockImplementation((workflowId: string) => {
      // Edit session
      if (workflowId === firstWorkflow.id) {
        return {
          sessionId: "session-1",
          workflowId: firstWorkflow.id,
          state: "locked",
          creator: editingUser,
          type: "EDIT_WORKFLOW",
        };
      }

      // Job inspector session
      if (workflowId === secondWorkflow.id) {
        return {
          sessionId: "session-2",
          workflowId: secondWorkflow.id,
          state: "locked",
          creator: "user2",
          type: "VIEW_JOB",
        };
      }

      return { state: "" };
    });

    const { wrapper } = doMount();

    // Workflow with edit session locked
    expect(
      wrapper.findComponent(FileExplorer).props("items").at(1),
    ).toStrictEqual({
      ...firstWorkflow,
      canBeDeleted: false,
      canBeRenamed: false,
      isOpen: true,
    });

    // Workflow with job inspector session not locked
    expect(
      wrapper.findComponent(FileExplorer).props("items").at(3),
    ).toStrictEqual(fileExplorerItems[3]);

    // Only one EditSessionAvatar visible - for the edit session
    expect(wrapper.findAllComponents(EditSessionAvatar).length).toBe(1);
    expect(wrapper.find(".base-avatar").attributes("title")).toBe(editingUser);
  });

  describe("rights", () => {
    it("does not allow delete if rights are missing", () => {
      const { wrapper } = doMount({ canDelete: false });
      const canDelete = wrapper
        .findComponent(FileExplorer)
        .props("items")
        .map((i) => i.canBeDeleted);

      expect(canDelete).toStrictEqual([
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ]);
    });

    it("does not allow rename if rights are missing", () => {
      const { wrapper } = doMount({ canRename: false });
      const canRename = wrapper
        .findComponent(FileExplorer)
        .props("items")
        .map((i) => i.canBeRenamed);

      expect(canRename).toStrictEqual([
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ]);
    });
  });

  describe("actions", () => {
    it("renames item", async () => {
      const { wrapper, workflowGroupStore } = doMount();

      const newName = "some new name";

      wrapper
        .findComponent(FileExplorer)
        .vm.$emit("renameFile", { itemId: "3", newName });

      // optimistic update
      expect(
        wrapper
          .findComponent(FileExplorer)
          .props("items")
          .find((item) => item.id === "3")!.name,
      ).toBe("some new name");

      await flushPromises();

      expect(workflowGroupStore.renameItem).toHaveBeenCalledWith({
        id: "3",
        newName,
      });
    });

    it("renames reverts optimistic update on failure", () => {
      consola.mockTypes(() => vi.fn());
      const { wrapper, workflowGroupStore } = doMount();

      // @ts-expect-error mocked store
      workflowGroupStore.renameItem.mockImplementationOnce(() => {
        throw new Error("Boom");
      });

      wrapper
        .findComponent(FileExplorer)
        .vm.$emit("renameFile", { itemId: "3", newName: "some new name" });

      // optimistic update should be reverted
      expect(
        wrapper
          .findComponent(FileExplorer)
          .props("items")
          .find((item) => item.id === "3")!.name,
      ).toBe("F");
    });

    it("deletes items", async () => {
      const { wrapper, repositoryStore } = doMount();

      await sleep(100);

      wrapper.findComponent(FileExplorer).vm.$emit("deleteItems", {
        items: fileExplorerItems.slice(0, 2),
      });

      await flushPromises();

      expect(repositoryStore.deleteItems).toHaveBeenCalledWith({
        ids: ["2", "1"],
        softDelete: true,
      });
    });

    describe("move items", () => {
      it("moves items to another folder", async () => {
        const { wrapper, workflowGroupStore } = doMount();

        const sourceItems = fileExplorerItems.slice(1, 3);

        wrapper.findComponent(FileExplorer).vm.$emit("moveItems", {
          sourceItems: sourceItems.map((i) => i.id),
          targetItem: fileExplorerItems.at(0)?.id,
        });

        await flushPromises();

        const targetCanonicalPath = "/Users/account:id-of-horst/testpath/to/C";

        expect(workflowGroupStore.moveOrCopyItems).toHaveBeenCalledWith({
          operation: "move",
          ids: ["1", "7"],
          targetCanonicalPath,
          suffix: "",
          force: false,
        });
      });

      it("moves items to parent folder", async () => {
        const { wrapper, workflowGroupStore } = doMount();

        const sourceItems = fileExplorerItems.slice(2, 4);

        wrapper.findComponent(FileExplorer).vm.$emit("moveItems", {
          sourceItems: sourceItems.map((i) => i.id),
          targetItem: "..",
        });

        await flushPromises();

        const targetCanonicalPath = "/Users/account:id-of-horst/testpath";

        expect(workflowGroupStore.moveOrCopyItems).toHaveBeenCalledWith({
          operation: "move",
          ids: ["7", "3"],
          targetCanonicalPath,
          suffix: "",
          force: false,
        });
      });
    });
  });

  describe("navigate", () => {
    it("changes directory to a WorkflowGroup (aka folder)", () => {
      const { wrapper } = doMount();

      wrapper.findComponent(FileExplorer).vm.$emit("changeDirectory", "2");

      expect(wrapper.emitted("navigate")?.[0][0]).toStrictEqual({
        type: "to-child-dir",
        item: repoItemDummy.items[1],
      });
    });

    it("goes to parent folder", () => {
      const { wrapper } = doMount();

      wrapper.findComponent(FileExplorer).vm.$emit("changeDirectory", "..");

      expect(wrapper.emitted("navigate")?.[0][0]).toStrictEqual({
        type: "to-parent-dir",
      });
    });

    it("opens a workflow", () => {
      const { wrapper } = doMount();

      const repositoryItem = repoItemDummy.items[2];

      wrapper.findComponent(FileExplorer).vm.$emit("openFile", {
        id: repositoryItem.id,
        meta: { repositoryItem },
      });

      expect(wrapper.emitted("navigate")?.[0][0]).toStrictEqual({
        type: "to-item-details",
        item: {
          id: repositoryItem.id,
          path: repositoryItem.path,
          type: repositoryItem.type,
        },
      });
    });

    it("opens a component", () => {
      const { wrapper } = doMount();

      const repositoryItem = repoItemDummy.items[6];

      wrapper.findComponent(FileExplorer).vm.$emit("openFile", {
        id: repositoryItem.id,
        meta: { repositoryItem },
      });

      expect(wrapper.emitted("navigate")?.[0][0]).toStrictEqual({
        type: "to-item-details",
        item: {
          id: repositoryItem.id,
          path: repositoryItem.path,
          type: repositoryItem.type,
        },
      });
    });
  });
});
