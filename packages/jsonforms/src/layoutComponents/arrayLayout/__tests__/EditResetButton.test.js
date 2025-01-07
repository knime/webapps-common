import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import flushPromises from "flush-promises";

import { FunctionButton, LoadingIcon } from "@knime/components";
import EditIcon from "@knime/styles/img/icons/pencil.svg";
import ResetIcon from "@knime/styles/img/icons/reset-all.svg";

import {
  getControlBase,
  initializesJsonFormsControl,
  mountJsonFormsComponent,
} from "../../../../test-setup/utils/jsonFormsTestUtils";
import EditResetButton from "../EditResetButton.vue";

describe("EditResetButton.vue", () => {
  let defaultProps, wrapper, component;

  beforeEach(() => {
    defaultProps = {
      control: {
        ...getControlBase("_edit"),
        data: false,
        schema: {
          properties: {
            xAxisLabel: {
              type: "string",
              title: "X Axis Label",
            },
          },
          default: "default value",
        },
        uischema: {
          type: "Control",
          scope: "#/properties/view/properties/xAxisLabel",
          options: {
            isAdvanced: false,
          },
        },
      },
    };

    component = mountJsonFormsComponent(EditResetButton, {
      props: defaultProps,
    });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders edit button initially", () => {
    expect(wrapper.findComponent(EditIcon).exists()).toBe(true);
    expect(wrapper.findComponent(LoadingIcon).exists()).toBe(false);
    expect(wrapper.findComponent(ResetIcon).exists()).toBe(false);
  });

  it("initializes jsonforms", () => {
    initializesJsonFormsControl(component);
  });

  it("calls handleChange when edit button is clicked", () => {
    const { wrapper, handleChange } = mountJsonFormsComponent(EditResetButton, {
      props: defaultProps,
    });
    wrapper.findComponent(FunctionButton).vm.$emit("click");
    expect(handleChange).toHaveBeenCalledWith(defaultProps.control.path, true);
  });

  describe("initially active reset button", () => {
    it("shows loading icon while loading", async () => {
      expect(wrapper.findComponent(LoadingIcon).exists()).toBe(false);
      await wrapper.setProps({ isLoading: true });
      expect(wrapper.findComponent(LoadingIcon).exists()).toBe(true);
    });

    it("shows reset button initially if desired", async () => {
      await wrapper.setProps({ initialIsEdited: true });
      await flushPromises();
      expect(component.handleChange).toHaveBeenCalledWith(
        defaultProps.control.path,
        true,
      );
    });
  });
});
