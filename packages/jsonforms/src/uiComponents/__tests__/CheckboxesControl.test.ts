import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import type { VueWrapper } from "@vue/test-utils";

import { Checkboxes } from "@knime/components";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControlLabelContent,
} from "../../../testUtils/component";
import CheckboxesControl from "../CheckboxesControl.vue";

describe("CheckboxesControl.vue", () => {
  let wrapper: VueWrapper,
    props: VueControlTestProps<typeof CheckboxesControl>,
    changeValue: Mock;

  const labelForId = "myLabelForId";

  beforeEach(async () => {
    props = {
      control: {
        ...getControlBase("test"),
        data: ["ADDED"],
        schema: {
          title: "Action",
          anyOf: [
            {
              const: "ADDED",
              title: "Added",
            },
            {
              const: "UPDATED",
              title: "Modified",
            },
            {
              const: "REMOVED",
              title: "Deleted",
            },
          ],
        },
        uischema: {
          type: "Control",
          scope: "#/properties/model/considerFile",
          options: {
            format: "checkboxes",
            checkboxLayout: "vertical",
          },
        },
      },
      labelForId,
      disabled: false,
      isValid: false,
    };
    const component = await mountJsonFormsControlLabelContent(
      CheckboxesControl,
      {
        props,
      },
    );
    wrapper = component.wrapper;
    changeValue = component.changeValue;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.findComponent(Checkboxes).exists()).toBe(true);
  });

  it("sets labelForId", () => {
    expect(wrapper.getComponent(Checkboxes).attributes().id).toBe(labelForId);
  });

  it("calls changeValue when checkboxes are changed", async () => {
    await wrapper
      .findComponent(Checkboxes)
      .vm.$emit("update:modelValue", ["ADDED", "MODIFIED"]);
    expect(changeValue).toHaveBeenCalledWith(["ADDED", "MODIFIED"]);
  });

  it("sets correct initial value", () => {
    expect(wrapper.findComponent(Checkboxes).vm.modelValue).toStrictEqual(
      props.control.data,
    );
  });

  it("uses possible values if anyOf is not given", async () => {
    delete props.control.schema.anyOf;
    props.control.uischema.options!.possibleValues = [
      { id: "PVal 1", text: "PVal 1" },
      { id: "PVal 2", text: "PVal 2" },
    ];
    const { wrapper } = await mountJsonFormsControlLabelContent(
      CheckboxesControl,
      {
        props,
      },
    );
    expect(
      wrapper.findComponent(Checkboxes).props().possibleValues,
    ).toStrictEqual([
      { id: "PVal 1", text: "PVal 1" },
      { id: "PVal 2", text: "PVal 2" },
    ]);
  });

  it("favors anyOf over possible values", async () => {
    props.control.uischema.options!.possibleValues = [
      { id: "PVal 1", text: "PVal 1" },
      { id: "PVal 2", text: "PVal 2" },
    ];
    const { wrapper } = await mountJsonFormsControlLabelContent(
      CheckboxesControl,
      {
        props,
      },
    );
    expect(
      wrapper.findComponent(Checkboxes).props().possibleValues,
    ).toStrictEqual([
      { id: "ADDED", text: "Added" },
      { id: "UPDATED", text: "Modified" },
      { id: "REMOVED", text: "Deleted" },
    ]);
  });
});
