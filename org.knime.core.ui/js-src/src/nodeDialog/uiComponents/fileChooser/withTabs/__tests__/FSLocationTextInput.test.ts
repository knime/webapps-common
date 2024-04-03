import FSLocationTextInput, {
  type Props as FSLocationTextInputProps,
} from "../FSLocationTextInput.vue";
import { shallowMount } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import InputField from "@@/webapps-common/ui/components/forms/InputField.vue";

describe("FSLocationTextInput.vue", () => {
  const currentSpacePrefix = "knime://knime.space/";
  let props: FSLocationTextInputProps;

  beforeEach(() => {
    props = {
      modelValue: {
        path: "myPath",
        timeout: 1000,
        fsCategory: "relative-to-current-hubspace",
      },
      disabled: false,
    };
  });

  const mountFsLocationTextInput = () => {
    return shallowMount(FSLocationTextInput, { props });
  };

  it("renders", () => {
    const inputField = mountFsLocationTextInput().findComponent(InputField);
    expect(inputField.exists()).toBeTruthy();
  });

  it("shows relative-to-current-hubspace path", () => {
    const path = "foo";
    props.modelValue = {
      path,
      timeout: 1000,
      fsCategory: "relative-to-current-hubspace",
    };
    expect(
      mountFsLocationTextInput().findComponent(InputField).props().modelValue,
    ).toBe(currentSpacePrefix + path);
  });

  it("shows CUSTOM_URL path", () => {
    const path = "foo://bar";
    props.modelValue = {
      path,
      timeout: 1000,
      fsCategory: "CUSTOM_URL",
    };
    expect(
      mountFsLocationTextInput().findComponent(InputField).props().modelValue,
    ).toBe(path);
  });

  it("shows local paths", () => {
    props.modelValue.fsCategory = "LOCAL";
    props.modelValue.path = "myLocalPath";
    expect(
      mountFsLocationTextInput().findComponent(InputField).props().modelValue,
    ).toBe("(LOCAL, myLocalPath)");
  });

  it("shows non-supported paths", () => {
    const fsToString = "myFsPathString";
    props.modelValue.fsCategory = "RELATIVE" as any;
    props.modelValue.context = {
      fsToString,
    };
    expect(
      mountFsLocationTextInput().findComponent(InputField).props().modelValue,
    ).toBe(fsToString);
  });

  it("emits relative-to-current-hubspace FS location on text input prefixed with knime://knime.space/", () => {
    const wrapper = mountFsLocationTextInput();
    const path = "foo";
    wrapper
      .findComponent(InputField)
      .vm.$emit("update:model-value", currentSpacePrefix + path);
    expect(wrapper.emitted("update:modelValue")).toStrictEqual([
      [
        {
          fsCategory: "relative-to-current-hubspace",
          path,
          timeout: wrapper.props().modelValue.timeout,
        },
      ],
    ]);
  });

  it("emits CUSTOM_URL FS location on text input prefixed with valid scheme", () => {
    const wrapper = mountFsLocationTextInput();
    const path = "foo://bar";
    wrapper.findComponent(InputField).vm.$emit("update:model-value", path);
    expect(wrapper.emitted("update:modelValue")).toStrictEqual([
      [
        {
          fsCategory: "CUSTOM_URL",
          path,
          timeout: wrapper.props().modelValue.timeout,
        },
      ],
    ]);
  });

  it("emits relative-to-current-hubspace FS location on text input prefixed without valid scheme", () => {
    const wrapper = mountFsLocationTextInput();
    const path = "foo";
    wrapper.findComponent(InputField).vm.$emit("update:model-value", path);
    expect(wrapper.emitted("update:modelValue")).toStrictEqual([
      [
        {
          fsCategory: "relative-to-current-hubspace",
          path,
          timeout: wrapper.props().modelValue.timeout,
        },
      ],
    ]);
  });
});
