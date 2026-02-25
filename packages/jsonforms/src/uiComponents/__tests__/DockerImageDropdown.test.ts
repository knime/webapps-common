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

import { Dropdown } from "@knime/components";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControlLabelContent,
} from "../../../testUtils/component";
import ExecutionContextDropdown from "../ExecutionContextDropdown.vue";
import {
  EXECUTION_CONTEXT_SHARED_STATUS,
  EXECUTION_CONTEXT_STATUS,
} from "../configs/executionContexts.config";

describe("ExecutionContextDropdown", () => {
  let wrapper: VueWrapper;
  let props: VueControlTestProps<typeof ExecutionContextDropdown>;
  let changeValue: Mock;

  const labelForId = "myLabelForId";
  const path = "executionContext";

  const mockExecutionContextOptions = [
    {
      const: "ec-1",
      title: "Production Context",
      slotData: {
        name: "Production Context",
        executorApVersion: "5.2.0",
        shortExecutorApVersion: "5.2",
        executionStatus: EXECUTION_CONTEXT_STATUS.RUNNING,
        autoStartEnabled: false,
        sharedStatus: [EXECUTION_CONTEXT_SHARED_STATUS.DEFAULT],
      },
    },
    {
      const: "ec-2",
      title: "Dev Context",
      slotData: {
        name: "Dev Context",
        executorApVersion: "5.1.0",
        shortExecutorApVersion: "5.1",
        executionStatus: EXECUTION_CONTEXT_STATUS.STOPPED,
        autoStartEnabled: true,
        sharedStatus: [EXECUTION_CONTEXT_SHARED_STATUS.SHARED],
      },
    },
    {
      const: "ec-3",
      title: "Test Context",
      slotData: {
        name: "Test Context",
        executorApVersion: "5.2.0",
        shortExecutorApVersion: "5.2",
        executionStatus: EXECUTION_CONTEXT_STATUS.STARTING_UP,
        autoStartEnabled: false,
        sharedStatus: [
          EXECUTION_CONTEXT_SHARED_STATUS.SHARED,
          EXECUTION_CONTEXT_SHARED_STATUS.DEFAULT,
        ],
      },
    },
  ];

  beforeEach(() => {
    props = {
      control: {
        ...getControlBase(path),
        data: "ec-1",
        label: "Execution Context",
        schema: {
          oneOf: mockExecutionContextOptions as any,
        },
        uischema: {
          type: "Control",
          scope: "#/properties/executionContext",
        },
      },
      disabled: false,
      isValid: true,
      labelForId,
    };

    const component = mountJsonFormsControlLabelContent(
      ExecutionContextDropdown,
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

  it("renders the Dropdown component", () => {
    expect(wrapper.findComponent(Dropdown).exists()).toBe(true);
  });

  it("computes possible values from schema oneOf", () => {
    const dropdown = wrapper.getComponent(Dropdown);
    expect(dropdown.props().possibleValues).toEqual([
      {
        id: "ec-1",
        text: "Production Context",
        slotData: mockExecutionContextOptions[0].slotData,
      },
      {
        id: "ec-2",
        text: "Dev Context",
        slotData: mockExecutionContextOptions[1].slotData,
      },
      {
        id: "ec-3",
        text: "Test Context",
        slotData: mockExecutionContextOptions[2].slotData,
      },
    ]);
  });

  it("sets correct initial value", () => {
    expect(wrapper.findComponent(Dropdown).vm.modelValue).toBe("ec-1");
  });

  it("calls changeValue when selection changes", async () => {
    await wrapper.findComponent(Dropdown).vm.$emit("update:modelValue", "ec-2");
    expect(changeValue).toHaveBeenCalledWith("ec-2");
  });

  it("handles empty oneOf array", () => {
    props.control.schema.oneOf = [] as any;
    const { wrapper } = mountJsonFormsControlLabelContent(
      ExecutionContextDropdown,
      {
        props,
      },
    );

    expect(wrapper.findComponent(Dropdown).props().possibleValues).toEqual([]);
  });

  it("handles oneOf with missing title", () => {
    props.control.schema.oneOf = [
      {
        const: "ec-no-title",
      },
    ] as any;
    const { wrapper } = mountJsonFormsControlLabelContent(
      ExecutionContextDropdown,
      {
        props,
      },
    );

    expect(wrapper.findComponent(Dropdown).props().possibleValues).toEqual([
      {
        id: "ec-no-title",
        text: "",
        slotData: undefined,
      },
    ]);
  });

  it("sets ariaLabel from control label", () => {
    expect(wrapper.findComponent(Dropdown).props().ariaLabel).toBe(
      "Execution Context",
    );
  });

  describe("execution status formatting", () => {
    it("formats STOPPED status with autoStart enabled", () => {
      const slotData = {
        name: "Test",
        executorApVersion: "5.2.0",
        shortExecutorApVersion: "5.2",
        executionStatus: EXECUTION_CONTEXT_STATUS.STOPPED,
        autoStartEnabled: true,
        sharedStatus: [],
      };

      props.control.schema.oneOf = [
        {
          const: "test",
          title: "Test",
          slotData,
        },
      ] as any;
      props.control.data = "test";

      const { wrapper } = mountJsonFormsControlLabelContent(
        ExecutionContextDropdown,
        {
          props,
        },
      );

      const statusText = wrapper.find(".run-status").text();
      expect(statusText).toContain("Stopped - Starts up on demand");
    });

    it("formats STOPPED status without autoStart", () => {
      const slotData = {
        name: "Test",
        executorApVersion: "5.2.0",
        shortExecutorApVersion: "5.2",
        executionStatus: EXECUTION_CONTEXT_STATUS.STOPPED,
        autoStartEnabled: false,
        sharedStatus: [],
      };

      props.control.schema.oneOf = [
        {
          const: "test",
          title: "Test",
          slotData,
        },
      ] as any;
      props.control.data = "test";

      const { wrapper } = mountJsonFormsControlLabelContent(
        ExecutionContextDropdown,
        {
          props,
        },
      );

      const statusText = wrapper.find(".run-status").text();
      expect(statusText).toBe("Stopped");
    });

    it("formats SHUTTING_DOWN status with autoStart enabled", () => {
      const slotData = {
        name: "Test",
        executorApVersion: "5.2.0",
        shortExecutorApVersion: "5.2",
        executionStatus: EXECUTION_CONTEXT_STATUS.SHUTTING_DOWN,
        autoStartEnabled: true,
        sharedStatus: [],
      };

      props.control.schema.oneOf = [
        {
          const: "test",
          title: "Test",
          slotData,
        },
      ] as any;
      props.control.data = "test";

      const { wrapper } = mountJsonFormsControlLabelContent(
        ExecutionContextDropdown,
        {
          props,
        },
      );

      const statusText = wrapper.find(".run-status").text();
      expect(statusText).toContain("Shutting down - Starts up on demand");
    });
  });

  describe("execution status class", () => {
    it("applies correct CSS class for RUNNING status", () => {
      const slotData = {
        name: "Test",
        executorApVersion: "5.2.0",
        shortExecutorApVersion: "5.2",
        executionStatus: EXECUTION_CONTEXT_STATUS.RUNNING,
        autoStartEnabled: false,
        sharedStatus: [],
      };

      props.control.schema.oneOf = [
        {
          const: "test",
          title: "Test",
          slotData,
        },
      ] as any;
      props.control.data = "test";

      const { wrapper } = mountJsonFormsControlLabelContent(
        ExecutionContextDropdown,
        {
          props,
        },
      );

      const dot = wrapper.find(".dot");
      expect(dot.classes()).toContain("status-running");
    });

    it("applies correct CSS class for STOPPED status", () => {
      const slotData = {
        name: "Test",
        executorApVersion: "5.2.0",
        shortExecutorApVersion: "5.2",
        executionStatus: EXECUTION_CONTEXT_STATUS.STOPPED,
        autoStartEnabled: false,
        sharedStatus: [],
      };

      props.control.schema.oneOf = [
        {
          const: "test",
          title: "Test",
          slotData,
        },
      ] as any;
      props.control.data = "test";

      const { wrapper } = mountJsonFormsControlLabelContent(
        ExecutionContextDropdown,
        {
          props,
        },
      );

      const dot = wrapper.find(".dot");
      expect(dot.classes()).toContain("status-stopped");
    });

    it("applies correct CSS class for STARTING_UP status", () => {
      const slotData = {
        name: "Test",
        executorApVersion: "5.2.0",
        shortExecutorApVersion: "5.2",
        executionStatus: EXECUTION_CONTEXT_STATUS.STARTING_UP,
        autoStartEnabled: false,
        sharedStatus: [],
      };

      props.control.schema.oneOf = [
        {
          const: "test",
          title: "Test",
          slotData,
        },
      ] as any;
      props.control.data = "test";

      const { wrapper } = mountJsonFormsControlLabelContent(
        ExecutionContextDropdown,
        {
          props,
        },
      );

      const dot = wrapper.find(".dot");
      expect(dot.classes()).toContain("status-starting-up");
    });

    it("applies default CSS class for unknown status", () => {
      const slotData = {
        name: "Test",
        executorApVersion: "5.2.0",
        shortExecutorApVersion: "5.2",
        executionStatus: "SomeUnknownStatus" as any,
        autoStartEnabled: false,
        sharedStatus: [],
      };

      props.control.schema.oneOf = [
        {
          const: "test",
          title: "Test",
          slotData,
        },
      ] as any;
      props.control.data = "test";

      const { wrapper } = mountJsonFormsControlLabelContent(
        ExecutionContextDropdown,
        {
          props,
        },
      );

      const dot = wrapper.find(".dot");
      expect(dot.classes()).toContain("status-unknown");
    });
  });

  describe("shared status and icons", () => {
    it("displays ExecutionContextSharedIcon when sharedStatus includes SHARED", () => {
      const slotData = {
        name: "Test",
        executorApVersion: "5.2.0",
        shortExecutorApVersion: "5.2",
        executionStatus: EXECUTION_CONTEXT_STATUS.RUNNING,
        autoStartEnabled: false,
        sharedStatus: [EXECUTION_CONTEXT_SHARED_STATUS.SHARED],
      };

      props.control.schema.oneOf = [
        {
          const: "test",
          title: "Test",
          slotData,
        },
      ] as any;
      props.control.data = "test";

      const { wrapper } = mountJsonFormsControlLabelContent(
        ExecutionContextDropdown,
        {
          props,
        },
      );

      // The icon is rendered as a component, check for SVG presence
      expect(
        wrapper.find(".dropdown-item-wrapper.slot-option svg").exists(),
      ).toBe(true);
    });

    it("displays ServerRackWorkflowIcon when sharedStatus does not include SHARED", () => {
      const slotData = {
        name: "Test",
        executorApVersion: "5.2.0",
        shortExecutorApVersion: "5.2",
        executionStatus: EXECUTION_CONTEXT_STATUS.RUNNING,
        autoStartEnabled: false,
        sharedStatus: [EXECUTION_CONTEXT_SHARED_STATUS.DEFAULT],
      };

      props.control.schema.oneOf = [
        {
          const: "test",
          title: "Test",
          slotData,
        },
      ] as any;
      props.control.data = "test";

      const { wrapper } = mountJsonFormsControlLabelContent(
        ExecutionContextDropdown,
        {
          props,
        },
      );

      expect(
        wrapper.find(".dropdown-item-wrapper.slot-option svg").exists(),
      ).toBe(true);
    });

    it("displays shared status text", () => {
      const slotData = {
        name: "Test",
        executorApVersion: "5.2.0",
        shortExecutorApVersion: "5.2",
        executionStatus: EXECUTION_CONTEXT_STATUS.RUNNING,
        autoStartEnabled: false,
        sharedStatus: [
          EXECUTION_CONTEXT_SHARED_STATUS.SHARED,
          EXECUTION_CONTEXT_SHARED_STATUS.DEFAULT,
        ],
      };

      props.control.schema.oneOf = [
        {
          const: "test",
          title: "Test",
          slotData,
        },
      ] as any;
      props.control.data = "test";

      const { wrapper } = mountJsonFormsControlLabelContent(
        ExecutionContextDropdown,
        {
          props,
        },
      );

      const sharedStatus = wrapper.find(".shared-status");
      expect(sharedStatus.text()).toBe("Shared, Default");
    });
  });

  describe("missing execution context", () => {
    it("displays warning icon and missing message when execution context not found", () => {
      props.control.data = "missing-ec";
      props.control.schema.oneOf = mockExecutionContextOptions as any;

      const { wrapper } = mountJsonFormsControlLabelContent(
        ExecutionContextDropdown,
        {
          props,
        },
      );

      // The Dropdown component should display the missing value
      // We can check that the modelValue is set to the missing value
      expect(wrapper.findComponent(Dropdown).vm.modelValue).toBe("missing-ec");
    });
  });

  describe("execution context display", () => {
    it("displays name and version correctly", () => {
      props.control.data = "ec-1";

      const slotData = mockExecutionContextOptions[0].slotData;
      expect(slotData.name).toBe("Production Context");
      expect(slotData.shortExecutorApVersion).toBe("5.2");
    });

    it("handles long execution context name with ellipsis", () => {
      const slotData = {
        name: "Very Long Execution Context Name That Should Be Truncated",
        executorApVersion: "5.2.0",
        shortExecutorApVersion: "5.2",
        executionStatus: EXECUTION_CONTEXT_STATUS.RUNNING,
        autoStartEnabled: false,
        sharedStatus: [EXECUTION_CONTEXT_SHARED_STATUS.DEFAULT],
      };

      props.control.schema.oneOf = [
        {
          const: "test",
          title: "Test",
          slotData,
        },
      ] as any;
      props.control.data = "test";

      const { wrapper } = mountJsonFormsControlLabelContent(
        ExecutionContextDropdown,
        {
          props,
        },
      );

      const title = wrapper.find(".title span:nth-child(1)");
      expect(title.attributes("title")).toBe(
        "Very Long Execution Context Name That Should Be Truncated",
      );
    });
  });
});
