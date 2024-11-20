import { beforeEach, describe, expect, it } from "vitest";
import { ref } from "vue";
import { shallowMount } from "@vue/test-utils";

import { injectionKey as injectionKeyShowAdvancedSettings } from "@/nodeDialog/composables/components/useAdvancedSettings";
import isSettingsVisibleMixin from "../isSettingsVisibleMixin";

import MockComponent from "./mockComponent.vue";

describe("isSettingsVisibleMixin.js", () => {
  let props, showAdvancedSettings;

  beforeEach(() => {
    showAdvancedSettings = ref(false);
    props = {
      control: {
        visible: true,
        uischema: {
          options: {
            isAdvanced: false,
          },
        },
      },
    };
  });

  const shallowMountMockComponent = () =>
    shallowMount(MockComponent, {
      props,
      mixins: [isSettingsVisibleMixin],
      global: {
        provide: {
          [injectionKeyShowAdvancedSettings]: showAdvancedSettings,
        },
      },
    });

  it("shows settings that are not advanced", () => {
    const wrapper = shallowMountMockComponent();
    expect(wrapper.vm.isVisible).toBe(true);
  });

  it("shows settings that are advanced and advanced options are to be shown", () => {
    props.control.uischema.options.isAdvanced = true;
    showAdvancedSettings.value = true;
    const wrapper = shallowMountMockComponent();
    expect(wrapper.vm.isVisible).toBe(true);
  });

  it("does not show settings that are advanced and advanced options are not to be shown", () => {
    props.control.uischema.options.isAdvanced = true;
    showAdvancedSettings.value = false;
    const wrapper = shallowMount(MockComponent, {
      props,
      mixins: [isSettingsVisibleMixin],
    });
    expect(wrapper.vm.isVisible).toBe(false);
  });

  it("does not show advanced settings if visible is false from control element", () => {
    props.control.uischema.options.isAdvanced = true;
    props.control.visible = false;
    const wrapper = shallowMount(MockComponent, {
      props,
      mixins: [isSettingsVisibleMixin],
    });
    expect(wrapper.vm.isVisible).toBe(false);
  });
});
