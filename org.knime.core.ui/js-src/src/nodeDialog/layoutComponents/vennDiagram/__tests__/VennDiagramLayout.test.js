import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  mountJsonFormsComponent,
  getControlBase,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import VennDiagramLayout from "../VennDiagramLayout.vue";
import VennDiagram from "../VennDiagram.vue";
import { DispatchRenderer } from "@jsonforms/vue";
import Left from "../Left.vue";
import Right from "../Right.vue";
import Inner from "../Inner.vue";

describe("VennDiagramLayout.vue", () => {
  let props, wrapper, component;
  const uischema = {
    type: "Control",
    scope: "#/properties/view/properties/xAxisLabel",
    elements: [
      {
        type: "Control",
        scope: "#/properties/middle",
      },
      {
        type: "Control",
        scope: "#/properties/left",
      },
      {
        type: "Control",
        scope: "#/properties/right",
      },
    ],
  };

  beforeEach(async () => {
    props = {
      control: {
        ...getControlBase("test"),
        schema: {
          properties: {
            xAxisLabel: {
              type: "string",
              title: "X Axis Label",
            },
          },
          default: "default value",
        },
        uischema,
      },
      uischema,
    };

    component = await mountJsonFormsComponent(VennDiagramLayout, {
      props,
    });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(VennDiagramLayout).exists()).toBe(true);
    expect(wrapper.getComponent(VennDiagram).exists()).toBe(true);
    expect(
      wrapper
        .findAllComponents(DispatchRenderer)
        .map((wrapper) => wrapper.props().uischema),
    ).toStrictEqual(uischema.elements);
  });

  it.each([Left, Right, Inner])(
    "triggers change on click on svg part",
    (comp) => {
      wrapper.findComponent(comp).trigger("click");
      expect(component.handleChange).toHaveBeenCalled();
    },
  );
});
