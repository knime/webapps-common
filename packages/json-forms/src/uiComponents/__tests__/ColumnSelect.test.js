import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { inject } from "vue";

import { Dropdown } from "@knime/components";

import { createPersistSchema } from "../../../test-setup/utils/createPersistSchema";
import {
  getControlBase,
  initializesJsonFormsControl,
  mountJsonFormsComponent,
} from "../../../test-setup/utils/jsonFormsTestUtils";
import { injectionKey as providedByComponentKey } from "../../composables/components/useFlowVariables";
import ColumnSelect from "../ColumnSelect.vue";
import DropdownControl from "../DropdownControl.vue";
import DialogLabel from "../label/DialogLabel.vue";

describe("ColumnSelect.vue", () => {
  let wrapper, props, path, component, handleChange;

  beforeEach(() => {
    path = "control path mock";
    props = {
      control: {
        ...getControlBase(path),
        data: {
          selected: "Universe_0_0",
        },
        schema: {
          type: "object",
          properties: {
            selected: {
              type: "array",
            },
          },
          title: "Y Axis Column",
        },
        uischema: {
          type: "Control",
          scope: "#/properties/view/properties/yAxisColumn",
          options: {
            format: "columnSelection",
            showRowKeys: false,
            showNoneColumn: false,
            possibleValues: [
              {
                id: "Universe_0_0",
                text: "Universe_0_0",
                compatibleTypes: ["Type_0_0", "OtherType_0_0"],
              },
              {
                id: "Universe_0_1",
                text: "Universe_0_1",
                compatibleTypes: ["Type_0_1", "OtherType_0_1"],
              },
              {
                id: "Universe_1_0",
                text: "Universe_1_0",
                compatibleTypes: ["Type_1_0", "OtherType_1_0"],
              },
              {
                id: "Universe_1_1",
                text: "Universe_1_1",
                compatibleTypes: ["Type_1_1", "OtherType_1_1"],
              },
            ],
          },
        },
      },
    };
    component = mountJsonFormsComponent(ColumnSelect, { props });
    wrapper = component.wrapper;
    handleChange = component.handleChange;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(ColumnSelect).exists()).toBe(true);
    expect(wrapper.getComponent(DropdownControl).exists()).toBe(true);
  });

  it("passes default props", () => {
    const dropdownProps = wrapper.getComponent(DropdownControl).props();
    expect(dropdownProps.optionsGenerator).toBe(wrapper.vm.optionsGenerator);
  });

  it("initializes jsonforms on pass-through component", () => {
    initializesJsonFormsControl({
      wrapper: wrapper.getComponent(DropdownControl),
      useJsonFormsControlSpy: component.useJsonFormsControlSpy,
    });
  });

  describe("compatible types", () => {
    it("updates compatible types when mounted", () => {
      expect(handleChange).toHaveBeenCalledWith(path, {
        selected: "Universe_0_0",
        compatibleTypes: ["Type_0_0", "OtherType_0_0"],
      });
    });

    it("updates compatible types on value change", () => {
      const dropdownControl = wrapper.findComponent(DropdownControl);
      const dropdown = dropdownControl.findComponent(Dropdown);
      dropdown.vm.$emit("update:modelValue", "Universe_1_1");
      expect(handleChange).toHaveBeenNthCalledWith(2, path, {
        selected: "Universe_1_1",
        compatibleTypes: ["Type_1_1", "OtherType_1_1"],
      });
    });

    it("sets empty compatible types on missing value", () => {
      const dropdownControl = wrapper.findComponent(DropdownControl);
      const dropdown = dropdownControl.findComponent(Dropdown);
      dropdown.vm.$emit("update:modelValue", "I am Missing");
      expect(handleChange).toHaveBeenNthCalledWith(2, path, {
        selected: "I am Missing",
        compatibleTypes: [],
      });
    });
  });

  describe("optionsGenerator", () => {
    it("optionsGenerator correctly transforms the data", async () => {
      expect(
        await wrapper.getComponent(ColumnSelect).vm.asyncInitialOptions,
      ).toEqual([
        expect.objectContaining({
          id: "Universe_0_0",
          text: "Universe_0_0",
        }),
        expect.objectContaining({
          id: "Universe_0_1",
          text: "Universe_0_1",
        }),
        expect.objectContaining({
          id: "Universe_1_0",
          text: "Universe_1_0",
        }),
        expect.objectContaining({
          id: "Universe_1_1",
          text: "Universe_1_1",
        }),
      ]);
    });

    it("optionsGenerator correctly transforms the data with none column and row keys", async () => {
      props.control.uischema.options.showNoneColumn = true;
      props.control.uischema.options.showRowKeys = true;
      props.control.uischema.options.showRowNumbers = true;

      const wrapper = (component = mountJsonFormsComponent(ColumnSelect, {
        props,
      }).wrapper);

      expect(
        await wrapper.getComponent(ColumnSelect).vm.asyncInitialOptions,
      ).toEqual([
        expect.objectContaining({
          id: "<none>",
          text: "None",
        }),
        expect.objectContaining({
          id: "<row-keys>",
          text: "RowID",
        }),
        expect.objectContaining({
          id: "<row-numbers>",
          text: "Row number",
        }),
        expect.objectContaining({
          id: "Universe_0_0",
          text: "Universe_0_0",
        }),
        expect.objectContaining({
          id: "Universe_0_1",
          text: "Universe_0_1",
        }),
        expect.objectContaining({
          id: "Universe_1_0",
          text: "Universe_1_0",
        }),
        expect.objectContaining({
          id: "Universe_1_1",
          text: "Universe_1_1",
        }),
      ]);
    });
  });

  it("throws an error when trying to convert settings before the options are loaded", () => {
    const wrapper = (component = mountJsonFormsComponent(ColumnSelect, {
      props,
    }).wrapper);
    expect(() => wrapper.vm.toData("Value")).toThrowError(
      "Must not convert data before column choices are fetched.",
    );
  });

  it("sets subConfigKeys for LabeledControl and computed flow settings with them", async () => {
    const subConfigKey = "selected";
    const DialogLabelStub = {
      setup() {
        return { providedByComponent: inject(providedByComponentKey) };
      },
      template: "<div/>",
    };
    const totalPath = `${path}.${subConfigKey}`;

    const persistSchemaMock = createPersistSchema({
      path,
      leaf: {
        type: "object",
        properties: {
          selected: {},
        },
      },
    });
    const { wrapper } = await mountJsonFormsComponent(ColumnSelect, {
      props,
      provide: {
        persistSchemaMock,
      },
      withControllingFlowVariable: totalPath,
      stubs: { DialogLabel: DialogLabelStub },
    });
    const provided = wrapper.getComponent(DialogLabel).vm.providedByComponent;
    expect(provided.flowSettings.value).toBeTruthy();
    expect(provided.configPaths.value[0].configPath).toEqual(totalPath);
  });

  it("uses choicesProvider if present", async () => {
    const choicesProvider = "myChoicesProvider";
    props.control.uischema.options.choicesProvider = choicesProvider;

    let provideChoices;
    const addStateProviderListenerMock = vi.fn((_id, callback) => {
      provideChoices = callback;
    });
    const { wrapper } = mountJsonFormsComponent(ColumnSelect, {
      props,
      provide: { addStateProviderListenerMock },
    });
    expect(addStateProviderListenerMock).toHaveBeenCalledWith(
      { id: choicesProvider },
      expect.anything(),
    );
    const providedChoices = [
      {
        id: "Universe_0_0",
        text: "Universe_0_0",
        compatibleTypes: ["Type_0_0", "OtherType_0_0"],
      },
    ];
    provideChoices(providedChoices);
    expect(await wrapper.vm.asyncInitialOptions).toStrictEqual(providedChoices);
  });
});
