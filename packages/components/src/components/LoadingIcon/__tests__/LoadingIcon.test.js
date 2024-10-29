import { describe, expect, it } from "vitest";
import { shallowMount } from "@vue/test-utils";

import LoadingIcon from "../LoadingIcon.vue";

describe("LoadingIcon.vue", () => {
  it("renders", () => {
    const wrapper = shallowMount(LoadingIcon);

    expect(wrapper.html()).toBeTruthy();
    expect(wrapper.isVisible()).toBeTruthy();
  });
});
