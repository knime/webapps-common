import { shallowMount } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import UrlTab, { type Props as UrlTabProps } from "../UrlTab.vue";
import CustomUrlFileChooser from "../CustomUrlFileChooser.vue";
import { applyButtonInjectionKey } from "@/nodeDialog/layoutComponents/settingsSubPanel";
import { type Ref, ref } from "vue";
import ErrorMessage from "@/nodeDialog/uiComponents/ErrorMessage.vue";

describe("UrlTab.vue", () => {
  let props: UrlTabProps, applyDisabled: Ref<boolean>;

  beforeEach(() => {
    applyDisabled = ref(false);
    props = {
      modelValue: {
        path: "myPath",
        timeout: 1000,
      },
      id: "myId",
    };
  });

  const mountUrlTab = () => {
    return shallowMount(UrlTab, {
      props,
      global: {
        provide: {
          [applyButtonInjectionKey as symbol]: {
            element: ref(null),
            disabled: applyDisabled,
            text: ref("initialText"),
            onApply: ref(undefined),
          },
        },
        stubs: {
          CustomUrlFileChooser,
        },
      },
    });
  };

  it("renders", () => {
    const wrapper = mountUrlTab();

    const customUrlFileChooser = wrapper.findComponent(CustomUrlFileChooser);
    expect(customUrlFileChooser.exists()).toBeTruthy();
    expect(customUrlFileChooser.props()).toMatchObject(props);
  });

  it("shows error message on invalid URL", () => {
    props.modelValue.path = "iHaveNoSchema";
    const wrapper = mountUrlTab();

    const errorMessage = wrapper
      .findComponent(CustomUrlFileChooser)
      .findComponent(ErrorMessage);
    expect(errorMessage.exists()).toBeTruthy();
    expect(errorMessage.props()).toStrictEqual({
      errors: [
        {
          message: 'The url needs to start with a scheme (e.g. "https://")',
        },
      ],
    });
    expect(applyDisabled.value).toBeTruthy();
  });

  it("does not show an error message on valid URL", () => {
    props.modelValue.path = "myScheme://iAmValid";
    const wrapper = mountUrlTab();

    const errorMessage = wrapper
      .findComponent(CustomUrlFileChooser)
      .findComponent(ErrorMessage);
    expect(errorMessage.exists()).toBeFalsy();
    expect(applyDisabled.value).toBeFalsy();
  });

  it("passes through emitted events", () => {
    const wrapper = mountUrlTab();
    const customUrlFileChooser = wrapper.findComponent(CustomUrlFileChooser);

    const path = "myPath";
    customUrlFileChooser.vm.$emit("update:path", path);
    expect(wrapper.emitted("update:path")).toStrictEqual([[path]]);

    const timeout = 1000;
    customUrlFileChooser.vm.$emit("update:timeout", timeout);
    expect(wrapper.emitted("update:timeout")).toStrictEqual([[timeout]]);
  });
});
