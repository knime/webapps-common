import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import LayoutComponentWrapper from "../LayoutComponentWrapper.vue";

const defaultProps = {
  layout: {
    uischema: {
      options: {
        isAdvanced: false,
      },
    },
    visible: true,
  },
};

const jsonforms = {
  core: {
    schema: {
      showAdvancedSettings: false,
    },
  },
};

const mountComponent = () =>
  mount(LayoutComponentWrapper, {
    global: {
      provide: { jsonforms },
    },
    props: defaultProps,
  });

describe("LayoutComponentWrapper.vue", () => {
  it("renders", () => {
    const wrapper = mountComponent();
    expect(wrapper.getComponent(LayoutComponentWrapper).exists()).toBe(true);
  });
});
