import { describe, expect, it } from "vitest";
import { shallowMount } from "@vue/test-utils";

import ReloadIcon from "@knime/styles/img/icons/reload.svg";

import LoadingIcon from "../LoadingIcon.vue";

describe("LoadingIcon.vue", () => {
  it("renders", () => {
    const wrapper = shallowMount(LoadingIcon, {
      global: {
        stubs: {
          ReloadIcon,
        },
      },
    });

    expect(wrapper.html()).toBeTruthy();
    expect(wrapper.isVisible()).toBeTruthy();
    expect(wrapper.findComponent(ReloadIcon).exists()).toBeTruthy();
  });
});
