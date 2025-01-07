import { beforeEach, describe, expect, it } from "vitest";
import { ref } from "vue";
import { mount } from "@vue/test-utils";

import { injectionKey as injectionKeyShowAdvancedSettings } from "../../composables/components/useAdvancedSettings";
import DialogComponentWrapper from "../DialogComponentWrapper.vue";

let props, showAdvancedSettings;

beforeEach(() => {
  props = {
    control: {
      uischema: {
        options: {
          isAdvanced: false,
        },
      },
      visible: true,
    },
  };
  showAdvancedSettings = ref(true);
});

const mountComponent = () =>
  mount(DialogComponentWrapper, {
    props,
    global: {
      provide: {
        [injectionKeyShowAdvancedSettings]: showAdvancedSettings,
      },
    },
  });

describe("DialogComponentWrapper.vue", () => {
  it("renders", () => {
    const wrapper = mountComponent();
    expect(wrapper.getComponent(DialogComponentWrapper).exists()).toBe(true);
  });

  it("is invisible if it is an advanced setting and advanced settings are not to be shown", () => {
    props.control.uischema.options.isAdvanced = true;
    showAdvancedSettings.value = false;
    const wrapper = mountComponent();
    expect(wrapper.getComponent(DialogComponentWrapper).isVisible()).toBe(
      false,
    );
  });

  it("checks that it is rendered if it is an advanced setting and advanced settings are shown", () => {
    props.control.uischema.options.isAdvanced = true;
    showAdvancedSettings.value = true;
    const wrapper = mountComponent();
    expect(wrapper.getComponent(DialogComponentWrapper).isVisible()).toBe(true);
  });
});
