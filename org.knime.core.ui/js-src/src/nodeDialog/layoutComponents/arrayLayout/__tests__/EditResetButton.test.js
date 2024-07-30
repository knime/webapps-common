import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  mountJsonFormsComponent,
  initializesJsonFormsControl,
  getControlBase,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import flushPromises from "flush-promises";
import EditResetButton from "../EditResetButton.vue";
import LoadingIcon from "webapps-common/ui/components/LoadingIcon.vue";
import FunctionButton from "webapps-common/ui/components/FunctionButton.vue";
import EditIcon from "webapps-common/ui/assets/img/icons/pencil.svg";
import ResetIcon from "webapps-common/ui/assets/img/icons/reset-all.svg";

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
    let resolveIsActivePromise, handleChange;

    beforeEach(() => {
      vi.useFakeTimers();
      const component = mountJsonFormsComponent(EditResetButton, {
        props: defaultProps,
        provide: {
          isTriggerActiveMock: vi.fn().mockReturnValue(
            new Promise((resolve) => {
              resolveIsActivePromise = resolve;
            }),
          ),
        },
      });

      wrapper = component.wrapper;
      handleChange = component.handleChange;
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("shows loading icon after timeout while querying whether the reset is active", async () => {
      vi.runAllTimers();
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(LoadingIcon).exists()).toBe(true);
      resolveIsActivePromise({ state: "SUCCESS", result: false });
      await flushPromises();
      expect(wrapper.findComponent(LoadingIcon).exists()).toBe(false);
    });

    it("does not show the loading icon within a timeout while querying whether the reset is active", () => {
      expect(wrapper.findComponent(LoadingIcon).exists()).toBe(false);
      resolveIsActivePromise({ state: "SUCCESS", result: false });
      vi.runAllTimers();
      expect(wrapper.findComponent(LoadingIcon).exists()).toBe(false);
    });

    it("shows reset button initially if its trigger is active", async () => {
      resolveIsActivePromise({ state: "SUCCESS", result: true });
      await flushPromises();
      expect(handleChange).toHaveBeenCalledWith(
        defaultProps.control.path,
        true,
      );
    });

    it("shows reset button initially if querying whether it is active was not successful", async () => {
      resolveIsActivePromise({ state: "FAIL" });
      await flushPromises();
      expect(handleChange).toHaveBeenCalledWith(
        defaultProps.control.path,
        true,
      );
    });

    it("shows edit button initially if its trigger is inactive", async () => {
      resolveIsActivePromise({ state: "SUCCESS", result: false });
      await flushPromises();
      expect(handleChange).not.toHaveBeenCalled();
    });
  });
});
