import { describe, expect, it } from "vitest";

import { Dropdown } from "@knime/components";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControl,
} from "../../../testUtils/component";
import DockerImageDropdown from "../DockerImageDropdown.vue";

describe("DockerImageDropdown", () => {
  const path = "dockerImageName";

  const mockDockerImageOptions = [
    {
      const: "image-1",
      title: "Docker Image 1",
      slotData: {
        name: "Docker Image 1",
        description: "This is Docker Image 1",
      },
    },
    {
      const: "image-2",
      title: "Docker Image 2",
      slotData: {
        name: "Docker Image 2",
        description: "This is Docker Image 2",
      },
    },
    {
      const: "image-3",
      title: "Docker Image 3",
      slotData: {
        name: "Docker Image 3",
        description: "This is Docker Image 3",
      },
    },
  ];

  const createProps = (
    overrides?: Partial<VueControlTestProps<typeof DockerImageDropdown>>,
  ): VueControlTestProps<typeof DockerImageDropdown> => ({
    control: {
      ...getControlBase(path),
      data: "image-1",
      label: "Docker Image",
      schema: {
        oneOf: mockDockerImageOptions as any,
      },
      uischema: {
        type: "Control",
        scope: "#/properties/dockerImageName",
      },
    },
    disabled: false,
    isValid: true,
    messages: { errors: [] },
    ...overrides,
  });

  it("renders Dropdown component", () => {
    const { wrapper } = mountJsonFormsControl(DockerImageDropdown, {
      props: createProps(),
    });

    expect(wrapper.findComponent(Dropdown).exists()).toBe(true);
  });

  it("computes possible values from schema oneOf", () => {
    const { wrapper } = mountJsonFormsControl(DockerImageDropdown, {
      props: createProps(),
    });

    expect(wrapper.getComponent(Dropdown).props().possibleValues).toEqual([
      {
        id: "image-1",
        text: "Docker Image 1",
        slotData: mockDockerImageOptions[0].slotData,
      },
      {
        id: "image-2",
        text: "Docker Image 2",
        slotData: mockDockerImageOptions[1].slotData,
      },
      {
        id: "image-3",
        text: "Docker Image 3",
        slotData: mockDockerImageOptions[2].slotData,
      },
    ]);
  });

  it("sets correct initial value", () => {
    const { wrapper } = mountJsonFormsControl(DockerImageDropdown, {
      props: createProps(),
    });

    expect(wrapper.findComponent(Dropdown).vm.modelValue).toBe("image-1");
  });

  it("handles value change", async () => {
    const { wrapper, changeValue } = mountJsonFormsControl(
      DockerImageDropdown,
      {
        props: createProps(),
      },
    );

    await wrapper
      .findComponent(Dropdown)
      .vm.$emit("update:modelValue", "image-2");

    expect(changeValue).toHaveBeenCalledWith("image-2");
  });

  it("handles empty oneOf array", () => {
    const props = createProps();
    props.control.schema.oneOf = [] as any;

    const { wrapper } = mountJsonFormsControl(DockerImageDropdown, {
      props,
    });

    expect(wrapper.findComponent(Dropdown).props().possibleValues).toEqual([]);
  });

  it("sets hardcoded ariaLabel", () => {
    const { wrapper } = mountJsonFormsControl(DockerImageDropdown, {
      props: createProps(),
    });

    expect(wrapper.findComponent(Dropdown).props().ariaLabel).toBe(
      "Docker image name",
    );
  });

  it("passes disabled prop to Dropdown", () => {
    const { wrapper } = mountJsonFormsControl(DockerImageDropdown, {
      props: createProps({ disabled: true }),
    });

    expect(wrapper.findComponent(Dropdown).props().disabled).toBe(true);
  });

  it("handles missing docker image value", () => {
    const props = createProps();
    props.control.data = "non-existent-image";

    const { wrapper } = mountJsonFormsControl(DockerImageDropdown, {
      props,
    });

    expect(wrapper.findComponent(Dropdown).vm.modelValue).toBe(
      "non-existent-image",
    );
  });
});
