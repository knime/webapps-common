import { describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { flushPromises, mount } from "@vue/test-utils";

import Tree from "../Tree.vue";

const treeSource = [
  { nodeKey: "root/1", name: "rootNode1", hasChildren: true },
  { nodeKey: "root/2", name: "rootNode2" },
];

describe("Tree", () => {
  const doMount = (options = {}) => {
    const loadDataMock = vi.fn((node, callback) => {
      callback([{ nodeKey: `${node.key}/1`, name: "loadedNode1" }]);
    });
    const defaultMountOptions = {
      props: {
        source: treeSource,
        loadData: loadDataMock,
      },
    };

    const mountOptions = {
      ...defaultMountOptions,
      ...options,
    };
    const wrapper = mount(Tree, mountOptions);
    return { wrapper, mountOptions };
  };

  it("shows source data", async () => {
    const { wrapper, mountOptions } = doMount();
    await flushPromises();

    const treeNodes = wrapper.findAllComponents({ name: "TreeNode" });
    expect(treeNodes.length).toBe(mountOptions.props.source.length);

    for (let i = 0; i < mountOptions.props.source.length; i++) {
      expect(treeNodes.at(i)?.props("node").name).toBe(
        mountOptions.props.source[i].name,
      );
    }
  });

  describe("tree interactions", () => {
    it("click to expand", async () => {
      const { wrapper, mountOptions } = doMount();
      const baseTree = wrapper.getComponent({ ref: "baseTree" });
      const treeNodes = wrapper.findAllComponents({ name: "TreeNode" });

      expect(baseTree.emitted("expandChange")).toBeUndefined();

      const i = 0;

      treeNodes.at(i)!.trigger("click");
      await nextTick();
      expect(baseTree.emitted("expandChange")?.[0]).toStrictEqual([
        {
          node: expect.objectContaining({
            origin: mountOptions.props.source[i],
          }),
          source: "click",
          state: expect.any(Boolean),
        },
      ]);
    });

    it("emits keypress", async () => {
      const { wrapper, mountOptions } = doMount();
      const baseTree = wrapper.getComponent({ ref: "baseTree" });

      await baseTree.trigger("focusin");
      await baseTree.trigger("keydown", { key: "someTestKey" });

      expect(wrapper.emitted("keydown")?.[0]).toStrictEqual([
        {
          event: expect.objectContaining({ key: "someTestKey" }),
          node: expect.objectContaining({
            key: mountOptions.props.source[0].nodeKey,
          }),
        },
      ]);
    });

    describe("load children", () => {
      it("does nothing if loadData prop is not set", async () => {
        const { wrapper } = doMount({
          props: {
            source: treeSource,
          },
        });

        wrapper.vm.loadChildren("root/1");
        await nextTick();

        const treeNodes = wrapper.findAllComponents({ name: "TreeNode" });
        expect(treeNodes.length).toBe(2);
      });

      it("loads children", async () => {
        const { wrapper } = doMount();

        wrapper.vm.loadChildren("root/1");
        await nextTick();

        // still open it as otherwise it will not be rendered
        wrapper.vm.toggleExpand("root/1", true);
        await nextTick();

        expect(wrapper.props("loadData")).toBeCalledTimes(1);

        const treeNodes = wrapper.findAllComponents({ name: "TreeNode" });
        expect(treeNodes.length).toBe(3);
      });

      it("handle empty load data response", async () => {
        const emptyLoadDataMock = vi.fn((node, callback) => {
          callback([]);
        });
        const { wrapper } = doMount({
          props: {
            source: treeSource,
            loadData: emptyLoadDataMock,
          },
        });

        wrapper.vm.loadChildren("root/1");
        await nextTick();

        expect(emptyLoadDataMock).toBeCalled();

        // still open it as otherwise it will not be rendered
        wrapper.vm.toggleExpand("root/1", true);
        await nextTick();

        const treeNodes = wrapper.findAllComponents({ name: "TreeNode" });
        expect(treeNodes.length).toBe(2);
      });
    });

    it("clear children", async () => {
      const { wrapper } = doMount({
        props: {
          source: [
            {
              ...treeSource[0],
              children: [
                { nodeKey: "child/1", name: "Child 1" },
                { nodeKey: "child/2", name: "Child 2" },
              ],
            },
            treeSource[1],
          ],
        },
      });

      // still open it as otherwise it will not be rendered
      wrapper.vm.toggleExpand("root/1", true);
      await nextTick();

      const treeNodes = wrapper.findAllComponents({ name: "TreeNode" });
      expect(treeNodes.length).toBe(4);

      wrapper.vm.clearChildren("root/1");
      await nextTick();

      const treeNodesAfterClear = wrapper.findAllComponents({
        name: "TreeNode",
      });
      expect(treeNodesAfterClear.length).toBe(2);
    });

    describe("keyboard navigation", () => {
      it("arrow up/down and enter", async () => {
        const { wrapper, mountOptions } = doMount();
        const baseTree = wrapper.getComponent({ ref: "baseTree" });

        await baseTree.trigger("focusin");
        expect(baseTree.emitted("focusChange")?.[0]).toStrictEqual([
          {
            node: expect.objectContaining({
              key: mountOptions.props.source[0].nodeKey,
            }),
          },
        ]);

        await baseTree.trigger("keydown", { key: "ArrowDown" });
        expect(baseTree.emitted("focusChange")?.[1]).toStrictEqual([
          {
            node: expect.objectContaining({
              key: mountOptions.props.source[1].nodeKey,
            }),
          },
        ]);

        await baseTree.trigger("keydown", { key: "ArrowUp" });
        expect(baseTree.emitted("focusChange")?.[2]).toStrictEqual([
          {
            node: expect.objectContaining({
              key: mountOptions.props.source[0].nodeKey,
            }),
          },
        ]);

        mountOptions.props.loadData.mockClear();
        await baseTree.trigger("keydown", { key: "Enter" });
        expect(mountOptions.props.loadData).toHaveBeenCalledWith(
          expect.objectContaining({ origin: mountOptions.props.source[0] }),
          expect.any(Function),
        );
      });

      it("arrow right", async () => {
        const { wrapper } = doMount({
          props: {
            source: [
              {
                ...treeSource[0],
                children: [{ nodeKey: "sub/1", name: "subNode1" }],
              },
              treeSource[1],
            ],
          },
        });
        const baseTree = wrapper.getComponent({ ref: "baseTree" });

        await baseTree.trigger("focusin");
        expect(baseTree.emitted("focusChange")?.[0]).toStrictEqual([
          {
            node: expect.objectContaining({
              key: "root/1",
            }),
          },
        ]);

        await baseTree.trigger("keydown", { key: "ArrowRight" });
        expect(baseTree.emitted("expandChange")?.[0]).toStrictEqual([
          {
            node: expect.objectContaining({
              key: "root/1",
            }),
            source: "key",
            state: true,
          },
        ]);

        await baseTree.trigger("keydown", { key: "ArrowRight" });
        expect(baseTree.emitted("focusChange")?.[1]).toStrictEqual([
          {
            node: expect.objectContaining({
              key: "sub/1",
            }),
          },
        ]);
      });

      it("arrow left", async () => {
        const { wrapper } = doMount({
          props: {
            source: [
              {
                ...treeSource[0],
                children: [{ nodeKey: "sub/1", name: "subNode1" }],
              },
              treeSource[1],
            ],
          },
        });
        const baseTree = wrapper.getComponent({ ref: "baseTree" });

        await baseTree.trigger("focusin");
        await baseTree.trigger("keydown", { key: "ArrowRight" });
        await baseTree.trigger("keydown", { key: "ArrowRight" });

        await baseTree.trigger("keydown", { key: "ArrowLeft" });
        // focus parent node
        expect(baseTree.emitted("focusChange")?.[2]).toStrictEqual([
          {
            node: expect.objectContaining({
              key: "root/1",
            }),
          },
        ]);

        await baseTree.trigger("keydown", { key: "ArrowLeft" });
        // closed root/1
        expect(baseTree.emitted("expandChange")?.[1]).toStrictEqual([
          {
            node: expect.objectContaining({
              key: "root/1",
            }),
            source: "key",
            state: false,
          },
        ]);
      });
    });
  });

  it("renders tree with virtual scrolling", () => {
    const { wrapper } = doMount({
      props: {
        source: treeSource,
        virtual: true,
      },
    });
    const treeNodes = wrapper.findAllComponents({ name: "TreeNode" });
    expect(wrapper.find(".vir-tree-wrap.virtual").exists()).toBe(true);
    expect(treeNodes.length).toBe(treeSource.length);
  });

  it("expanding node loads its children", async () => {
    const { wrapper, mountOptions } = doMount();
    const treeNodes = wrapper.findAllComponents({ name: "TreeNode" });

    const i = 0;
    const treeNode = treeNodes[i];
    mountOptions.props.loadData.mockClear();
    expect(treeNode.vm.$props.node.children).toStrictEqual([]);
    treeNode.trigger("click");
    await flushPromises();

    expect(mountOptions.props.loadData).toHaveBeenCalledWith(
      expect.objectContaining({ origin: mountOptions.props.source[i] }),
      expect.any(Function),
    );
    expect(treeNode.vm.$props.node.children).toStrictEqual([
      expect.objectContaining({
        key: `${mountOptions.props.source[i].nodeKey}/1`,
      }),
    ]);
  });
});
