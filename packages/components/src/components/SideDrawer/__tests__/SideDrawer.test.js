import { beforeEach, describe, expect, it } from "vitest";
import { shallowMount } from "@vue/test-utils";

import SideDrawer from "../SideDrawer.vue";

const assertExpandStatus = (wrapper, isExpanded) => {
  expect(wrapper.find(".side-drawer").exists()).toBe(isExpanded);
  expect(wrapper.find(".content").exists()).toBe(isExpanded);
};

describe("SideDrawer.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(SideDrawer);
  });

  it("renders collapsed state by default", () => {
    assertExpandStatus(wrapper, false);
  });

  it("can toggle", async () => {
    await wrapper.setProps({ isExpanded: true });
    assertExpandStatus(wrapper, true);

    await wrapper.setProps({ isExpanded: false });
    assertExpandStatus(wrapper, false);
  });
});
