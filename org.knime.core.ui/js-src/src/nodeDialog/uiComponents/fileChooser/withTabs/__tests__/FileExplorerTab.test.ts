import { beforeEach, describe, expect, it, vi } from "vitest";
import DialogFileExplorer from "../../DialogFileExplorer.vue";
import { type Ref, ref } from "vue";
import { shallowMount } from "@vue/test-utils";
import FileExplorerTab, { type Props } from "../FileExplorerTab.vue";
import { applyButtonInjectionKey } from "@/nodeDialog/layoutComponents/settingsSubPanel";

describe("FileExplorerTab.vue", () => {
  let props: Props,
    applyDisabled: Ref<boolean>,
    onApply: Ref<undefined | (() => Promise<void>)>;

  beforeEach(() => {
    applyDisabled = ref(false);
    onApply = ref(undefined);
    props = {
      backendType: "relativeToCurrentHubSpace",
    };
  });

  const mountFileExplorerTab = () => {
    return shallowMount(FileExplorerTab, {
      props,
      global: {
        provide: {
          [applyButtonInjectionKey as symbol]: {
            element: ref(null),
            disabled: applyDisabled,
            text: ref("initialText"),
            onApply,
          },
        },
      },
    });
  };

  it("renders", () => {
    const wrapper = mountFileExplorerTab();

    const dialogFileExplorer = wrapper.findComponent(DialogFileExplorer);
    expect(dialogFileExplorer.exists()).toBeTruthy();
    expect(dialogFileExplorer.props()).toMatchObject({
      ...props,
      initialFilePath: "",
      isWriter: false,
      filteredExtensions: [],
      appendedExtension: null,
    });
  });

  it("enables applying if file is selected", () => {
    const wrapper = mountFileExplorerTab();
    expect(applyDisabled.value).toBeTruthy();

    wrapper.findComponent(DialogFileExplorer).vm.$emit("fileIsSelected", true);

    expect(applyDisabled.value).toBeFalsy();
  });

  it("disables applying if no file is selected", () => {
    const wrapper = mountFileExplorerTab();
    expect(applyDisabled.value).toBeTruthy();

    wrapper.findComponent(DialogFileExplorer).vm.$emit("fileIsSelected", true);
    wrapper.findComponent(DialogFileExplorer).vm.$emit("fileIsSelected", false);

    expect(applyDisabled.value).toBeTruthy();
  });

  it("opens file on apply", async () => {
    const wrapper = mountFileExplorerTab();
    const file = "myFile";
    const openFile = vi.fn().mockResolvedValue(file);
    wrapper.findComponent(DialogFileExplorer).vm.openFile = openFile;
    await onApply.value!();
    expect(openFile).toHaveBeenCalled();
  });

  it("passes through emitted chooseFile events", () => {
    const wrapper = mountFileExplorerTab();
    const dialogFileExplorer = wrapper.findComponent(DialogFileExplorer);
    const path = "myPath";

    dialogFileExplorer.vm.$emit("chooseFile", path);

    expect(wrapper.emitted("chooseFile")).toStrictEqual([[path]]);
  });
});
