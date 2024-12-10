import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import flushPromises from "flush-promises";

import { IntervalInput } from "@knime/components";

import {
  getControlBase,
  initializesJsonFormsControl,
  mountJsonFormsComponent,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import IntervalControl from "../IntervalControl.vue";
import DialogLabel from "../label/DialogLabel.vue";

describe("IntervalControl.vue", () => {
  let defaultProps, wrapper, component;

  beforeEach(async () => {
    defaultProps = {
      control: {
        ...getControlBase("path"),
        data: "P1Y",
        schema: {
          properties: {
            maxRows: {
              type: "integer",
              title: "Show tooltip",
            },
          },
        },
        uischema: {
          type: "Control",
          scope: "#/properties/view/properties/maxRows",
          options: {
            format: "integer",
          },
        },
      },
    };
    component = await mountJsonFormsComponent(IntervalControl, {
      props: defaultProps,
    });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(IntervalInput).props()).toMatchObject({
      compact: true,
      disabled: false,
      modelValue: defaultProps.control.data,
      format: "DATE_OR_TIME",
    });
  });

  it("initializes jsonforms", () => {
    initializesJsonFormsControl(component);
  });

  it("sets labelForId", async () => {
    await wrapper.vm.$nextTick();
    const dialogLabel = wrapper.findComponent(DialogLabel);
    expect(wrapper.getComponent(IntervalInput).attributes().id).toBe(
      dialogLabel.vm.labelForId,
    );
    expect(dialogLabel.vm.labeledElement).toBeDefined();
    expect(dialogLabel.vm.labeledElement).not.toBeNull();
  });

  it("calls handleChange when interval input is changed", () => {
    const { wrapper, handleChange } = mountJsonFormsComponent(IntervalControl, {
      props: defaultProps,
    });
    const changedInterval = "P2Y";
    wrapper
      .findComponent(IntervalInput)
      .vm.$emit("update:modelValue", changedInterval);
    expect(handleChange).toHaveBeenCalledWith(
      defaultProps.control.path,
      changedInterval,
    );
  });

  it("sets correct label", () => {
    expect(wrapper.find("label").text()).toBe(defaultProps.control.label);
  });

  it("disables input when controlled by a flow variable", () => {
    const { wrapper } = mountJsonFormsComponent(IntervalControl, {
      props: defaultProps,
      withControllingFlowVariable: true,
    });
    expect(wrapper.vm.disabled).toBeTruthy();
  });

  it("uses format from options", () => {
    defaultProps.control.uischema.options.intervalType = "DATE";
    component = mountJsonFormsComponent(IntervalControl, {
      props: defaultProps,
    });
    wrapper = component.wrapper;
    expect(wrapper.getComponent(IntervalInput).props()).toMatchObject({
      format: "DATE",
    });
  });

  it("uses format from provider in options", async () => {
    const intervalTypeProvider = "myProvider";
    defaultProps.control.uischema.options.intervalTypeProvider =
      intervalTypeProvider;
    let provideIntervalType;
    const addStateProviderListenerMock = vi.fn((_id, callback) => {
      provideIntervalType = callback;
    });
    component = mountJsonFormsComponent(IntervalControl, {
      props: defaultProps,
      provide: { addStateProviderListenerMock },
    });
    wrapper = component.wrapper;
    expect(addStateProviderListenerMock).toHaveBeenCalledWith(
      { id: intervalTypeProvider },
      expect.anything(),
    );
    expect(wrapper.getComponent(IntervalInput).props()).toMatchObject({
      format: "DATE_OR_TIME",
    });
    const providedIntervalType = "DATE";

    provideIntervalType(providedIntervalType);
    await flushPromises();
    expect(wrapper.getComponent(IntervalInput).props()).toMatchObject({
      format: "DATE",
    });
  });
});
