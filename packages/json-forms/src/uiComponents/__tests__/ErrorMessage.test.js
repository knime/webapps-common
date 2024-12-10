import { describe, expect, it } from "vitest";
import { shallowMount } from "@vue/test-utils";

import ErrorMessage from "../ErrorMessage.vue";

describe("ErrorMessage.vue", () => {
  const defaultProps = {
    errors: ["First error", "Second error"],
  };

  it("renders", () => {
    const wrapper = shallowMount(ErrorMessage, {
      props: defaultProps,
    });
    expect(wrapper.getComponent(ErrorMessage).exists()).toBe(true);
  });
});
