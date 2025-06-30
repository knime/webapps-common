import { describe, expect, it } from "vitest";
import { shallowMount } from "@vue/test-utils";

import SplitButton from "../SplitButton.vue";

describe("SplitButton", () => {
  it("renders slot content", () => {
    const wrapper = shallowMount(SplitButton, {
      slots: {
        default: "<button />",
      },
    });
    expect(wrapper.find("button").exists()).toBeTruthy();
  });
});
