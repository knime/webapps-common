import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { VueWrapper } from "@vue/test-utils";
import flushPromises from "flush-promises";

import { FunctionButton, SideDrawer } from "@knime/components";
import FolderLenseIcon from "@knime/styles/img/icons/folder-lense.svg";

import { createPersistSchema } from "../../../../../test-setup/utils/createPersistSchema";
import {
  getControlBase,
  initializesJsonFormsControl,
  mountJsonFormsComponent,
} from "../../../../../test-setup/utils/jsonFormsTestUtils";
import SettingsSubPanel from "../../../../layoutComponents/settingsSubPanel/SettingsSubPanel.vue";
import DialogLabel from "../../../label/DialogLabel.vue";
import LabeledControl from "../../../label/LabeledControl.vue";
import FSLocationTextControl from "../FSLocationTextControl.vue";
import FileChooserControl from "../FileChooserControl.vue";
import SideDrawerContent from "../SideDrawerContent.vue";

describe("FileChooserControl.vue", () => {
  let props: any, wrapper: VueWrapper<any, any>, component: any;

  beforeEach(async () => {
    props = {
      control: {
        ...getControlBase("test"),
        data: {
          path: {
            path: "myPath",
            timeout: 1000,
            fsCategory: "relative-to-current-hubspace",
          },
        },
        schema: {
          type: "object",
          title: "File path",
          properties: {
            path: {
              type: "object",
            },
          },
          default: "default value",
        },
        uischema: {
          type: "Control",
          scope: "#/properties/view/properties/filePath",
          options: {
            format: "fileChooser",
          },
        },
      },
    };

    const getPanelsContainerMock = vi.fn().mockReturnValue("body");
    component = await mountJsonFormsComponent(FileChooserControl, {
      props,
      provide: {
        getPanelsContainerMock,
      },
      stubs: {
        SideDrawerContent: true,
      },
    });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const hasFolderLenseIcon = (
    wrapper: ReturnType<VueWrapper["findComponent"]>,
  ) => wrapper.findComponent(FolderLenseIcon).exists();
  const findFolderLenseButton = (wrapper: VueWrapper) =>
    wrapper
      .findAllComponents(FunctionButton)
      .filter((fb) => hasFolderLenseIcon(fb))[0];
  const expandSideDrawer = async (wrapper: VueWrapper) => {
    await findFolderLenseButton(wrapper).vm.$emit("click");
    return wrapper.findComponent(SideDrawer);
  };

  it("renders", () => {
    expect(wrapper.findComponent(FSLocationTextControl).exists()).toBe(true);
    expect(wrapper.findComponent(SettingsSubPanel).exists()).toBe(true);
    expect(wrapper.findComponent(LabeledControl).exists()).toBe(true);
  });

  it("sets labelForId", async () => {
    const dialogLabel = wrapper.findComponent(DialogLabel) as any;
    expect(
      (await expandSideDrawer(wrapper)).findComponent(SideDrawerContent).props()
        .id,
    ).toBe(dialogLabel.vm.labelForId);
  });

  it("initializes jsonforms", () => {
    initializesJsonFormsControl(component);
  });

  it("calls handleChange when applying changes from the side panel", async () => {
    const changedValue = { ...props.control.data.path, path: "new path" };
    const sideDrawer = await expandSideDrawer(wrapper);
    sideDrawer
      .findComponent(SideDrawerContent)
      .vm.$emit("update:modelValue", changedValue);
    await wrapper.findComponent(SettingsSubPanel).vm.$emit("apply");
    expect(component.handleChange).toHaveBeenCalledWith(props.control.path, {
      path: changedValue,
    });
  });

  const createPersistSchemaMock = () =>
    createPersistSchema({
      path: props.control.path,
      leaf: {
        type: "object",
        properties: {
          path: {},
        },
      },
    });

  it("disables input when controlled by a flow variable", () => {
    const { wrapper } = mountJsonFormsComponent(FileChooserControl, {
      props,
      provide: { persistSchemaMock: createPersistSchemaMock() },
      withControllingFlowVariable: `${props.control.path}.path` as any,
    });
    expect(findFolderLenseButton(wrapper).props().disabled).toBe(true);
  });

  it.each(["LOCAL", "relative-to-current-hubspace"])(
    "sets default data when unsetting controlling flow variable",
    async (fsCategory) => {
      const stringRepresentation = "myStringRepresentation";
      props.control.data.path.fsCategory = "RELATIVE";
      props.control.data.path.context = { fsToString: stringRepresentation };
      if (fsCategory === "LOCAL") {
        props.control.uischema.options.isLocal = true;
      }
      const { flowVariablesMap, wrapper, handleChange } =
        await mountJsonFormsComponent(FileChooserControl, {
          props,
          provide: { persistSchemaMock: createPersistSchemaMock() },
          withControllingFlowVariable: `${props.control.path}.path` as any,
        });
      flowVariablesMap[
        `${props.control.path}.path` as any
      ].controllingFlowVariableName = null as any;
      // @ts-ignore
      wrapper.vm.control = { ...wrapper.vm.control };
      await flushPromises();
      expect(handleChange).toHaveBeenCalledWith(props.control.path, {
        path: {
          path: "",
          fsCategory,
          timeout: 10000,
          context: {
            fsSpecifier: undefined,
          },
        },
      });
    },
  );

  describe("switches to valid values when mounted", () => {
    it("does not switch to the first valid category if the current category is valid", async () => {
      props.control.data.path.fsCategory = "relative-to-embedded-data";
      const { handleChange } = await mountJsonFormsComponent(
        FileChooserControl,
        {
          props,
          stubs: {
            FSLocationTextControl: true,
          },
        },
      );
      expect(handleChange).not.toHaveBeenCalled();
    });

    it("switches to current hub space if non-supported fsCategory is given", async () => {
      props.control.data.path.fsCategory = "LOCAL";
      props.control.uischema.options.isLocal = false;
      const { handleChange } = await mountJsonFormsComponent(
        FileChooserControl,
        {
          props,
          stubs: {
            FSLocationTextControl: true,
          },
        },
      );
      expect(handleChange).toHaveBeenCalledWith(
        props.control.path,
        expect.objectContaining({
          path: {
            ...props.control.data.path,
            fsCategory: "relative-to-current-hubspace",
          },
        }),
      );
    });

    it("switches to LOCAL if non-supported fsCategory is given and isLocal is true", async () => {
      props.control.data.path.fsCategory = "CONNECTED";
      props.control.uischema.options.isLocal = true;
      const { handleChange } = await mountJsonFormsComponent(
        FileChooserControl,
        {
          props,
          stubs: {
            FSLocationTextControl: true,
          },
        },
      );
      expect(handleChange).toHaveBeenCalledWith(
        props.control.path,
        expect.objectContaining({
          path: {
            ...props.control.data.path,
            fsCategory: "LOCAL",
          },
        }),
      );
    });

    it("switches to CONNECTED if any other fsCategory is given and ", async () => {
      props.control.data.path.fsCategory = "relative-to-current-hubspace";
      props.control.uischema.options.portIndex = 1;
      const { handleChange } = await mountJsonFormsComponent(
        FileChooserControl,
        {
          props,
          stubs: {
            FSLocationTextControl: true,
          },
        },
      );
      expect(handleChange).toHaveBeenCalledWith(
        props.control.path,
        expect.objectContaining({
          path: {
            ...props.control.data.path,
            fsCategory: "CONNECTED",
          },
        }),
      );
    });

    it("does not switch to a valid category when overwritten by a flow variable.", async () => {
      props.control.data.path.fsCategory = "CONNECTED";
      props.control.uischema.options.portIndex = 1;
      const { handleChange } = await mountJsonFormsComponent(
        FileChooserControl,
        {
          props,
          stubs: {
            FSLocationTextControl: true,
          },
          withControllingFlowVariable: `${props.control.path}.path` as any,
        },
      );
      expect(handleChange).not.toHaveBeenCalled();
    });
  });
});
