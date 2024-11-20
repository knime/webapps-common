import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  initializesJsonFormsLayout,
  mountJsonFormsComponent,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import DescriptionPopover from "@/nodeDialog/uiComponents/description/DescriptionPopover.vue";
import SectionLayout from "../SectionLayout.vue";

describe("SectionLayout.vue", () => {
  let defaultProps, wrapper;

  beforeEach(async () => {
    defaultProps = {
      layout: {
        cells: [],
        data: {
          view: {
            xAxisLabel: "xAxisLabel",
          },
        },
        path: "",
        schema: {
          properties: {
            xAxisLabel: {
              type: "string",
              title: "X Axis Label",
            },
          },
        },
        uischema: {
          type: "Section",
          label: "Interactivity",
          elements: [
            {
              type: "Control",
              scope: "#/properties/view/properties/xAxisLabel",
            },
          ],
          options: {
            isAdvanced: false,
          },
        },
        visible: true,
      },
    };

    const component = await mountJsonFormsComponent(SectionLayout, {
      props: defaultProps,
    });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(SectionLayout).exists()).toBe(true);
  });

  it("initializes jsonforms", () => {
    initializesJsonFormsLayout(wrapper);
  });

  it("shows a description popover if desired", async () => {
    defaultProps.layout.uischema.description = "myDescription";
    const { wrapper } = await mountJsonFormsComponent(SectionLayout, {
      props: defaultProps,
    });

    expect(wrapper.findComponent(DescriptionPopover).exists()).toBeTruthy();
  });
});
