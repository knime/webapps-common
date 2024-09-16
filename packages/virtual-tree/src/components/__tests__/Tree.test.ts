import { describe, expect, it, vi } from "vitest";
import Tree from "../Tree.vue";
import { flushPromises, mount } from "@vue/test-utils";
import { nextTick } from "vue";

describe("Tree", () => {
  const doMount = (options = {}) => {
    const loadDataMock = vi.fn((node, callback) => {
      callback([{ nodeKey: `${node.key}/1`, name: "loadedNode1" }]);
    });
    const defaultMountOptions = {
      props: {
        source: [
          { nodeKey: "root/1", name: "rootNode1", hasChildren: true },
          { nodeKey: "root/2", name: "rootNode2" },
        ],
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

    it("keyboard navigation", async () => {
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
