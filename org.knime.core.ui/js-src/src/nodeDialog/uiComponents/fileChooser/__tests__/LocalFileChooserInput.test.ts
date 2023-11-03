import { shallowMount, VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import LocalFileChooserInput from "../LocalFileChooserInput.vue";
import FileChooser from "../FileChooser.vue";
import InputField from "webapps-common/ui/components/forms/InputField.vue";
import FunctionButton from "webapps-common/ui/components/FunctionButton.vue";
import type LocalFileChooserProps from "../types/LocalFileChooserProps";

describe("LocalFileChooserInput.vue", () => {
  let props: LocalFileChooserProps;

  beforeEach(() => {
    props = {
      id: "id",
      modelValue: "",
      disabled: false,
      placeholder: "",
    };
  });

  const shallowMountLocalFileChooser = () => {
    return shallowMount(LocalFileChooserInput, {
      props,
      global: { stubs: { InputField } },
    });
  };

  it("renders", () => {
    const wrapper = shallowMountLocalFileChooser();
    const inputField = wrapper.findComponent(InputField);
    expect(inputField.exists()).toBeTruthy();
    expect(inputField.findComponent(FunctionButton).exists()).toBeTruthy();
    expect(wrapper.findComponent(FileChooser).exists()).toBeFalsy();
  });

  it("sets props", () => {
    props = {
      placeholder: "myPlaceholder",
      id: "myId",
      disabled: true,
      modelValue: "initialValue",
    };
    const wrapper = shallowMountLocalFileChooser();
    const inputField = wrapper.findComponent(InputField);
    expect(inputField.props()).toMatchObject(props);
    expect(inputField.findComponent(FunctionButton).props().disabled).toBe(
      props.disabled,
    );
  });

  const activateFileChooser = (wrapper: VueWrapper) => {
    wrapper
      .findComponent(InputField)
      .findComponent(FunctionButton)
      .vm.$emit("click");
  };

  it("opens file browser on button click", async () => {
    const wrapper = shallowMountLocalFileChooser();
    await activateFileChooser(wrapper);
    expect(wrapper.findComponent(FileChooser).exists()).toBeTruthy();
  });

  it("closes file browser on cancel", async () => {
    const wrapper = shallowMountLocalFileChooser();
    await activateFileChooser(wrapper);
    await wrapper.findComponent(FileChooser).vm.$emit("cancel");
    expect(wrapper.findComponent(FileChooser).exists()).toBeFalsy();
  });

  it("closes file browser and emits update:modelValue on file select", async () => {
    const wrapper = shallowMountLocalFileChooser();
    await activateFileChooser(wrapper);
    const chosenFile = "/home/myFile.txt";
    await wrapper.findComponent(FileChooser).vm.$emit("chooseFile", chosenFile);
    expect(wrapper.findComponent(FileChooser).exists()).toBeFalsy();
    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[chosenFile]]);
  });

  it("emits update:modelValue on text input", async () => {
    const wrapper = shallowMountLocalFileChooser();
    const chosenFile = "/home/myFile.txt";
    await wrapper
      .findComponent(InputField)
      .vm.$emit("update:modelValue", chosenFile);
    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[chosenFile]]);
  });
});
