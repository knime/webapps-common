import { beforeEach, describe, expect, it, vi } from "vitest";
import SideDrawerContent, { type Props } from "../SideDrawerContent.vue";
import SideDrawerContentBase from "../SideDrawerContentBase.vue";
import { shallowMount } from "@vue/test-utils";
import { TabBar } from "@knime/components";
import FileExplorerTab from "../FileExplorerTab.vue";
import UrlTab from "../UrlTab.vue";
import flushPromises from "flush-promises";
import ConnectionPreventsTab from "../ConnectionPreventsTab.vue";
import { FSCategory } from "../../types/FileChooserProps";

describe("SideDrawerContent.vue", () => {
  let props: Props;

  const testSpaceName = "testSpaceName";

  beforeEach(() => {
    props = {
      disabled: false,
      id: "myId",
      initialValue: {
        fsCategory: "relative-to-current-hubspace",
        path: "myPath",
        timeout: 1000,
      },
      options: {
        mountId: testSpaceName,
      },
    };
  });

  const mountSideDrawerContent = () => {
    return shallowMount(SideDrawerContent, {
      props,
      global: {
        stubs: {
          SideDrawerContentBase,
        },
        provide: {
          addStateProviderListener: vi.fn(),
        },
      },
    });
  };

  it("renders", () => {
    const wrapper = mountSideDrawerContent();
    const tabBar = wrapper.findComponent(TabBar);
    expect(tabBar.exists()).toBeTruthy();
    expect(tabBar.props().possibleValues).toStrictEqual([
      {
        value: "relative-to-current-hubspace",
        label: testSpaceName,
        icon: expect.anything(),
      },
      {
        value: "CUSTOM_URL",
        label: "URL",
        icon: expect.anything(),
      },
    ]);
  });

  it("renders local tab", async () => {
    props.initialValue.fsCategory = "LOCAL";
    props.options!.isLocal = true;
    const wrapper = mountSideDrawerContent();
    expect(wrapper.findComponent(TabBar).props().modelValue).toBe("LOCAL");
    await flushPromises();
    const fileExplorerTab = wrapper.findComponent(FileExplorerTab);
    expect(fileExplorerTab.exists()).toBeTruthy();
    expect(fileExplorerTab.props().backendType).toBe("local");
    const updatedPath = "updatedPath";
    await fileExplorerTab.vm.$emit("chooseFile", updatedPath);
    expect(wrapper.vm.modelValue).toStrictEqual({
      ...props.initialValue,
      path: updatedPath,
    });
  });

  it("renders current hub space tab", async () => {
    const wrapper = mountSideDrawerContent();
    expect(wrapper.findComponent(TabBar).props().modelValue).toBe(
      "relative-to-current-hubspace",
    );
    await flushPromises();
    const fileExplorerTab = wrapper.findComponent(FileExplorerTab);
    expect(fileExplorerTab.exists()).toBeTruthy();
    expect(fileExplorerTab.props().backendType).toBe(
      "relativeToCurrentHubSpace",
    );
  });

  it("renders URL tab", async () => {
    const wrapper = mountSideDrawerContent();
    await wrapper
      .findComponent(TabBar)
      .vm.$emit("update:model-value", "CUSTOM_URL");
    const urlTab = wrapper.findComponent(UrlTab);
    expect(urlTab.exists()).toBeTruthy();
    const updatedPath = "updatedPath";
    await urlTab.vm.$emit("update:path", updatedPath);
    const updatedTimeout = 2000;
    await urlTab.vm.$emit("update:timeout", updatedTimeout);
    expect(wrapper.vm.modelValue).toStrictEqual({
      path: updatedPath,
      timeout: updatedTimeout,
      fsCategory: "CUSTOM_URL",
    });
  });

  describe("when a file system port exists", () => {
    let wrapper: ReturnType<typeof mountSideDrawerContent>;

    beforeEach(() => {
      props.options!.portIndex = 1;
      wrapper = mountSideDrawerContent();
    });

    it("renders CONNECTED tab", async () => {
      const fsSpecifier = "myFileSystemSpecifier";
      await wrapper.setProps({
        options: {
          ...wrapper.props().options,
          fileSystemSpecifier: fsSpecifier,
        },
      });
      await wrapper
        .findComponent(TabBar)
        .vm.$emit("update:model-value", "CONNECTED");
      const fileExplorerTab = wrapper.findComponent(FileExplorerTab);
      expect(fileExplorerTab.exists()).toBeTruthy();
      expect(fileExplorerTab.props().backendType).toBe("connected1");
      const updatedPath = "updatedPath";
      await fileExplorerTab.vm.$emit("chooseFile", updatedPath);
      expect(wrapper.vm.modelValue).toStrictEqual({
        path: updatedPath,
        timeout: props.initialValue.timeout,
        fsCategory: "CONNECTED",
        context: {
          fsSpecifier,
        },
      });
    });

    it.each(["CUSTOM_URL", "LOCAL", "relative-to-current-hubspace"] as const)(
      "renders ConnectionPreventsTab for all other tabs",
      async (otherFsCategory: keyof typeof FSCategory) => {
        const wrapper = mountSideDrawerContent();
        await wrapper
          .findComponent(TabBar)
          .vm.$emit("update:model-value", otherFsCategory);
        expect(
          wrapper.findComponent(ConnectionPreventsTab).exists(),
        ).toBeTruthy();
      },
    );
  });
});
