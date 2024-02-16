import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  initializesJsonFormsControl,
  mountJsonFormsComponent,
  getControlBase,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import ColumnSelect from "../ColumnSelect.vue";
import DropdownInput from "../DropdownInput.vue";
import Dropdown from "webapps-common/ui/components/forms/Dropdown.vue";
import { providedKey as providedByComponentKey } from "@/nodeDialog/composables/useFlowVariables";
import DialogLabel from "../label/DialogLabel.vue";

describe("ColumnSelect.vue", () => {
  let wrapper, props, path, component, updateData;

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
    updateData = component.updateData;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(ColumnSelect).exists()).toBe(true);
    expect(wrapper.getComponent(DropdownInput).exists()).toBe(true);
  });

  it("passes default props", () => {
    const dropdownProps = wrapper.getComponent(DropdownInput).props();
    expect(dropdownProps.optionsGenerator).toBe(wrapper.vm.optionsGenerator);
  });

  it("initializes jsonforms on pass-through component", () => {
    initializesJsonFormsControl({
      wrapper: wrapper.getComponent(DropdownInput),
      useJsonFormsControlSpy: component.useJsonFormsControlSpy,
    });
  });

  describe("compatible types", () => {
    it("updates compatible types when mounted", () => {
      expect(updateData).toHaveBeenCalledWith(expect.anything(), path, {
        selected: "Universe_0_0",
        compatibleTypes: ["Type_0_0", "OtherType_0_0"],
      });
    });

    it("updates compatible types on value change", () => {
      const dropdownInput = wrapper.findComponent(DropdownInput);
      const dropdown = dropdownInput.findComponent(Dropdown);
      dropdown.vm.$emit("update:modelValue", "Universe_1_1");
      expect(updateData).toHaveBeenNthCalledWith(2, expect.anything(), path, {
        selected: "Universe_1_1",
        compatibleTypes: ["Type_1_1", "OtherType_1_1"],
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
          text: "RowIDs",
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

  it("sets subConfigKeys for LabeledInput and computed flow settings with them", async () => {
    const subConfigKey = "selected";
    const DialogLabelStub = {
      inject: [providedByComponentKey],
      template: "<div/>",
    };
    const totalPath = `${path}.${subConfigKey}`;
    const { wrapper } = await mountJsonFormsComponent(ColumnSelect, {
      props,
      withControllingFlowVariable: totalPath,
      stubs: { DialogLabel: DialogLabelStub },
    });
    const provided =
      wrapper.getComponent(DialogLabel).vm[providedByComponentKey];
    expect(provided.flowSettings.value).toBeTruthy();
    expect(provided.configPaths.value[0].configPath).toEqual(totalPath);
  });
});
