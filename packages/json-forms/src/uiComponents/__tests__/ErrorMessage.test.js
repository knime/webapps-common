import { describe, expect, it } from "vitest";

import ErrorMessage from "../ErrorMessage.vue";
import { shallowMount } from "@vue/test-utils";

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
