import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  mountJsonFormsComponent,
  initializesJsonFormsLayout,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import HorizontalLayout from "../HorizontalLayout.vue";

describe("HorizontalLayout.vue", () => {
  const defaultProps = {
    layout: {
      cells: [],
      path: "view.referenceLines",
      schema: {
        properties: {
          size: {
            type: "integer",
            title: "Size",
          },
        },
      },
      uischema: {
        type: "HorizontalLayout",
        elements: [
          {
            type: "Control",
            scope: "#/properties/size",
          },
        ],
      },
      visible: true,
    },
  };

  let wrapper;

  beforeEach(() => {
    const component = mountJsonFormsComponent(HorizontalLayout, {
      props: defaultProps,
    });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(HorizontalLayout).exists()).toBe(true);
  });

  it("initializes jsonforms", () => {
    initializesJsonFormsLayout(wrapper);
  });
});
