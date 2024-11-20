/* eslint-disable max-lines */
/* eslint-disable no-undefined */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { DispatchRenderer } from "@jsonforms/vue";
import flushPromises from "flush-promises";

import { FunctionButton } from "@knime/components";
import ArrowDownIcon from "@knime/styles/img/icons/arrow-down.svg";
import ArrowUpIcon from "@knime/styles/img/icons/arrow-up.svg";
import TrashIcon from "@knime/styles/img/icons/trash.svg";

import {
  initializesJsonFormsArrayControl,
  mountJsonFormsComponent,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import { editResetButtonFormat } from "@/nodeDialog/renderers/editResetButtonRenderer";
import { elementCheckboxFormat } from "@/nodeDialog/renderers/elementCheckboxRenderer";
import ArrayLayout from "../ArrayLayout.vue";
import ArrayLayoutItem from "../ArrayLayoutItem.vue";
import ArrayLayoutItemControls from "../ArrayLayoutItemControls.vue";

const control = {
  visible: true,
  cells: [],
  data: [
    {
      borderStyle: "DASHED",
      color: "blue",
      label: undefined,
      size: 1,
      value: "0",
    },
    {
      borderStyle: "DOTTED",
      color: "red",
      label: undefined,
      size: 1,
      value: "1",
    },
    {
      borderStyle: "SOLID",
      color: "green",
      label: undefined,
      size: 1,
      value: "2",
    },
  ],
  path: "view/referenceLines",
  schema: {
    type: "object",
    properties: {
      borderStyle: {
        oneOf: [
          {
            const: "DASHED",
            title: "Dashed",
          },
          {
            const: "DOTTED",
            title: "Dotted",
          },
          {
            const: "SOLID",
            title: "Solid",
          },
        ],
        title: "Borderstyle",
        default: "DASHED",
      },
      color: {
        type: "string",
        title: "Color",
        default: "blue",
      },
      label: {
        type: "string",
        title: "Label",
      },
      size: {
        type: "integer",
        format: "int32",
        title: "Size",
        default: 1,
        minimum: 0,
        maximum: 10,
      },
      value: {
        type: "string",
        title: "Value",
        default: "0",
      },
    },
  },
  uischema: {
    type: "Control",
    scope: "#/properties/view/properties/referenceLines",
    options: {
      arrayElementTitle: "ElementTitle",
      detail: {
        value: {
          type: "Control",
          scope: "#/properties/value",
        },
        label: {
          type: "Control",
          scope: "#/properties/label",
        },
        borderStyle: {
          type: "Control",
          scope: "#/properties/borderStyle",
          options: {
            format: "radio",
            radioLayout: "horizontal",
          },
        },
        horizontalLayout: {
          type: "HorizontalLayout",
          elements: [
            { type: "Control", scope: "#/properties/size" },
            { type: "Control", scope: "#/properties/color" },
          ],
        },
      },
    },
  },
};

const useJsonFormsControlMock = {
  handleChange: vi.fn(),
  control: ref(control),
};

vi.mock(
  "@/nodeDialog/composables/components/useJsonFormsControlWithUpdate",
  () => ({
    useJsonFormsControlWithUpdate: () => useJsonFormsControlMock,
  }),
);

describe("ArrayLayout.vue", () => {
  let wrapper;

  beforeEach(async () => {
    const component = await mountJsonFormsComponent(ArrayLayout, {
      props: { control },
    });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(ArrayLayout).exists()).toBe(true);
  });

  it("initializes jsonforms", () => {
    initializesJsonFormsArrayControl(wrapper);
  });

  const schemaDefaultValue = {
    borderStyle: "DASHED",
    color: "blue",
    label: undefined,
    size: 1,
    value: "0",
  };

  it("renders an add button", () => {
    const { wrapper } = mountJsonFormsComponent(ArrayLayout, {
      props: { control },
    });
    const addButton = wrapper.find(".array > button");
    expect(addButton.text()).toBe("New");
    addButton.element.click();

    expect(wrapper.vm.addItem).toHaveBeenCalledWith(
      control.path,
      schemaDefaultValue,
    );
  });

  it("uses provided default value if present", () => {
    const elementDefaultValueProvider = "myElementDefaultValueProvider";
    control.uischema.options.elementDefaultValueProvider =
      elementDefaultValueProvider;

    let provideDefault;
    const addStateProviderListenerMock = vi.fn((_id, callback) => {
      provideDefault = callback;
    });
    const { wrapper } = mountJsonFormsComponent(ArrayLayout, {
      props: { control },
      provide: { addStateProviderListenerMock },
    });
    expect(addStateProviderListenerMock).toHaveBeenCalledWith(
      { id: elementDefaultValueProvider },
      expect.anything(),
    );
    const providedDefault = {
      borderStyle: "DASHED",
      color: "red",
      label: "My default Label",
      size: 1,
      value: "0",
    };
    const button = wrapper.find(".array > button").element;

    button.click();
    provideDefault(providedDefault);
    button.click();
    expect(wrapper.vm.addItem).toHaveBeenNthCalledWith(
      1,
      control.path,
      schemaDefaultValue,
    );

    expect(wrapper.vm.addItem).toHaveBeenNthCalledWith(
      2,
      control.path,
      providedDefault,
    );
  });

  it("sets add button text", () => {
    const customAddButtonText = "My add button text";
    control.uischema.options.addButtonText = customAddButtonText;
    const { wrapper } = mountJsonFormsComponent(ArrayLayout, {
      props: { control },
    });
    const addButton = wrapper.find(".array > button");
    expect(addButton.text()).toBe(customAddButtonText);
  });

  it("adds default item", () => {
    const { wrapper } = mountJsonFormsComponent(ArrayLayout, {
      props: { control },
    });
    wrapper.vm.addDefaultItem();
    expect(wrapper.vm.addItem).toHaveBeenCalledWith(control.path, {
      borderStyle: "DASHED",
      color: "blue",
      size: 1,
      value: "0",
    });
    expect(useJsonFormsControlMock.handleChange).toHaveBeenCalledWith(
      control.path,
      control.data.map((d) => expect.objectContaining(d)),
    );
  });

  it("deletes item", () => {
    const { wrapper } = mountJsonFormsComponent(ArrayLayout, {
      props: { control },
    });
    const index = 1;
    wrapper.vm.deleteItem(index);
    expect(wrapper.vm.removeItems).toHaveBeenCalledWith(expect.anything(), [
      index,
    ]);
    expect(useJsonFormsControlMock.handleChange).toHaveBeenCalledWith(
      control.path,
      control.data.map((d) => expect.objectContaining(d)),
    );
  });

  it("moves item up", async () => {
    const { wrapper } = mountJsonFormsComponent(ArrayLayout, {
      props: { control },
    });
    const index = 1;
    await wrapper
      .findAllComponents(ArrayLayoutItemControls)
      .at(index)
      .vm.$emit("moveUp");
    expect(wrapper.vm.moveUp).toHaveBeenCalledWith(control.path, index);
    expect(useJsonFormsControlMock.handleChange).toHaveBeenCalledWith(
      control.path,
      control.data.map((d) => expect.objectContaining(d)),
    );
  });

  it("moves item down", async () => {
    const { wrapper } = mountJsonFormsComponent(ArrayLayout, {
      props: { control },
    });
    const index = 1;
    await wrapper
      .findAllComponents(ArrayLayoutItemControls)
      .at(index)
      .vm.$emit("moveDown");
    expect(wrapper.vm.moveDown).toHaveBeenCalledWith(control.path, index);
    expect(useJsonFormsControlMock.handleChange).toHaveBeenCalledWith(
      control.path,
      control.data.map((d) => expect.objectContaining(d)),
    );
  });

  it("renders an edit/reset button if configured to do so", () => {
    control.uischema.options.withEditAndReset = true;
    const { wrapper } = mountJsonFormsComponent(ArrayLayout, {
      props: { control },
    });
    const itemControls = wrapper.findAllComponents(ArrayLayoutItemControls);
    const firstDispatchedProps = itemControls
      .at(0)
      .findComponent(DispatchRenderer)
      .props();
    expect(firstDispatchedProps.uischema.options.format).toBe(
      editResetButtonFormat,
    );
    expect(firstDispatchedProps.uischema.scope).toBe("#/properties/_edit");
    expect(firstDispatchedProps.path).toBe("view/referenceLines.0");
    expect(firstDispatchedProps.schema.properties._edit.type).toBe("boolean");
  });

  it("renders a checkbox next to the header when given an elementCheckboxScope", () => {
    const elementCheckboxScope = "#/properties/booleanInput";
    control.uischema.options.elementCheckboxScope = elementCheckboxScope;
    const { wrapper } = mountJsonFormsComponent(ArrayLayout, {
      props: { control },
    });
    const firstDispatchedProps = wrapper
      .findAllComponents(ArrayLayoutItem)
      .at(0)
      .findComponent(DispatchRenderer)
      .props();
    expect(firstDispatchedProps.uischema.options.format).toBe(
      elementCheckboxFormat,
    );
    expect(firstDispatchedProps.uischema.scope).toBe(elementCheckboxScope);
  });

  it("does not render sort buttons when showSortButtons is not present or false", () => {
    const { wrapper } = mountJsonFormsComponent(ArrayLayout, {
      props: { control },
    });
    const numberDataItems = control.data.length;
    const itemControls = wrapper.findAllComponents(ArrayLayoutItemControls);

    expect(itemControls).toHaveLength(numberDataItems);
    const itemControlsWithArrowUp = itemControls.filter((wrapper) =>
      wrapper.findComponent(ArrowUpIcon).exists(),
    );
    const itemControlsWithArrowDown = itemControls.filter((wrapper) =>
      wrapper.findComponent(ArrowDownIcon).exists(),
    );

    expect(itemControlsWithArrowUp).toHaveLength(0);
    expect(itemControlsWithArrowDown).toHaveLength(0);
  });

  it("renders headers and uses card styled items", () => {
    const { wrapper } = mountJsonFormsComponent(ArrayLayout, {
      props: { control },
    });
    expect(wrapper.find(".item-header").exists()).toBeTruthy();
    expect(wrapper.find(".item-header").text()).toBe("ElementTitle 1");
    expect(wrapper.vm.useCardLayout).toBeTruthy();
  });

  it("does not render headers and items as card but renders controls if arrayElementTitle is missing", () => {
    delete control.uischema.options.arrayElementTitle;
    const { wrapper } = mountJsonFormsComponent(ArrayLayout, {
      props: { control },
    });
    expect(wrapper.find(".item-header").exists()).toBeFalsy();
    const numberDataItems = control.data.length;
    const itemControls = wrapper.findAllComponents(ArrayLayoutItemControls);
    expect(itemControls).toHaveLength(numberDataItems);
    expect(wrapper.vm.useCardLayout).toBeFalsy();
  });

  it.each([
    {
      button: "move up button",
      position: "the first",
      itemNum: 0,
      moveUpDisabled: true,
      moveDownDisabled: false,
    },
    {
      button: "none of the sort buttons",
      position: "any non-boundary",
      itemNum: 1,
      moveUpDisabled: false,
      moveDownDisabled: false,
    },
    {
      button: "move down button",
      position: "the last",
      itemNum: 2,
      moveUpDisabled: false,
      moveDownDisabled: true,
    },
  ])(
    "disables $button for $position item when showSortButtons is true",
    ({ itemNum, moveUpDisabled, moveDownDisabled }) => {
      control.uischema.options.showSortButtons = true;
      const { wrapper } = mountJsonFormsComponent(ArrayLayout, {
        props: { control },
      });
      const itemControls = wrapper.findAll(".item-controls");
      const itemControlsButtons = itemControls
        .at(itemNum)
        .findAllComponents(FunctionButton);
      expect(itemControlsButtons.at(0).vm.disabled).toBe(moveUpDisabled);
      expect(itemControlsButtons.at(1).vm.disabled).toBe(moveDownDisabled);
    },
  );

  it.each([
    {
      render: "not render",
      condition: "present and true",
      value: true,
      numberIcons: 0,
    },
    {
      render: "render",
      condition: "false",
      value: false,
      numberIcons: control.data.length,
    },
    {
      render: "render",
      condition: "not present",
      value: null,
      numberIcons: control.data.length,
    },
  ])(
    "does $render add and delete buttons when hasFixedSize is $condition",
    ({ value, numberIcons }) => {
      if (value === null) {
        delete control.uischema.options.hasFixedSize;
      } else {
        control.uischema.options.hasFixedSize = value;
      }

      const { wrapper } = mountJsonFormsComponent(ArrayLayout, {
        props: { control },
      });

      const itemControls = wrapper.findAllComponents(ArrayLayoutItemControls);
      const itemControlsWithTrash = itemControls.filter((wrapper) =>
        wrapper.findComponent(TrashIcon).exists(),
      );

      expect(itemControlsWithTrash).toHaveLength(numberIcons);
    },
  );

  it("displays provided title and subtitle", async () => {
    const titleProvider = "myTitleProvider";
    const subTitleProvider = "mySubTitleProvider";
    control.uischema.options.elementTitleProvider = titleProvider;
    control.uischema.options.elementSubTitleProvider = subTitleProvider;

    const provideState = [];
    const addStateProviderListenerMock = vi.fn((_id, callback) => {
      provideState.push(callback);
    });
    const { wrapper } = mountJsonFormsComponent(ArrayLayout, {
      props: { control },
      provide: { addStateProviderListenerMock },
    });
    expect(addStateProviderListenerMock).toHaveBeenCalledWith(
      { id: titleProvider, indexIds: expect.anything(), indices: [0] },
      expect.anything(),
    );
    expect(addStateProviderListenerMock).toHaveBeenCalledWith(
      { id: subTitleProvider, indexIds: expect.anything(), indices: [0] },
      expect.anything(),
    );
    const providedState = "provided";
    provideState.forEach((callback) => callback(providedState));
    await flushPromises();
    expect(wrapper.find(".item-header").text()).toBe(
      providedState + providedState,
    );
  });

  describe("edit/reset buttons initial state", () => {
    let resolveIsActivePromise = () => {};

    beforeEach(() => {
      vi.useFakeTimers();
      const newControl = {
        ...control,
        uischema: {
          ...control.uischema,
          options: {
            ...control.uischema.options,
            withEditAndReset: true,
          },
        },
      };
      const component = mountJsonFormsComponent(ArrayLayout, {
        props: { control: newControl },
        provide: {
          isTriggerActiveMock: vi.fn().mockReturnValue(
            new Promise((resolve) => {
              resolveIsActivePromise = resolve;
            }),
          ),
        },
      });

      wrapper = component.wrapper;
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("shows loading icon while loading", async () => {
      const ids = wrapper.vm.signedData.map(({ _id }) => _id);
      const editResetButtons = wrapper
        .findAllComponents(DispatchRenderer)
        .filter((c) => c.props("schema").properties?._edit?.type === "boolean");
      expect(editResetButtons.length).toBe(3);
      expect(editResetButtons[0].attributes("is-loading")).toBeUndefined();
      vi.runAllTimers();
      await wrapper.vm.$nextTick();
      expect(editResetButtons[0].attributes("is-loading")).toBe("");
      resolveIsActivePromise({
        state: "SUCCESS",
        result: ids.map((id, index) => ({
          indices: [id],
          isActive: index === 0,
        })),
      });
      await flushPromises();
      await wrapper.vm.$nextTick();
      expect(editResetButtons[0].attributes("is-loading")).toBeUndefined();
      expect(editResetButtons[0].attributes("initial-is-edited")).toBe("");
      expect(
        editResetButtons[1].attributes("initial-is-edited"),
      ).toBeUndefined();
    });
  });
});
