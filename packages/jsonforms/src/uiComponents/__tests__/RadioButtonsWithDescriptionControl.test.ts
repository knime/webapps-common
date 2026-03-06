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

import { KdsRadioButton } from "@knime/kds-components";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControl,
} from "../../../testUtils/component";
import RadioButtonsWithDescriptionControl from "../RadioButtonsWithDescriptionControl.vue";

describe("RadioButtonsWithDescriptionControl", () => {
  let wrapper: VueWrapper,
    props: VueControlTestProps<typeof RadioButtonsWithDescriptionControl>,
    changeValue: Mock;

  const defaultOptions = [
    {
      const: "option1",
      title: "Option 1",
      description: "Description for option 1",
      price: "$10/month",
    },
    {
      const: "option2",
      title: "Option 2",
      description: "Description for option 2",
      price: "$20/month",
    },
    {
      const: "option3",
      title: "Option 3",
      description: "Description for option 3",
      price: "$30/month",
    },
  ];

  beforeEach(async () => {
    props = {
      control: {
        ...getControlBase("test"),
        data: "option1",
        schema: {
          oneOf: defaultOptions,
        },
        uischema: {
          type: "Control",
          scope: "#/properties/subscription",
          options: {},
        },
      },
      disabled: false,
      isValid: false,
      messages: { errors: [] },
    };
    const component = await mountJsonFormsControl(
      RadioButtonsWithDescriptionControl,
      { props },
    );
    wrapper = component.wrapper;
    changeValue = component.changeValue;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    const radioButtons = wrapper.findAllComponents(KdsRadioButton);
    expect(radioButtons.length).toBe(3);
    expect(radioButtons.length).toBe(defaultOptions.length);

    defaultOptions.forEach((option, index) => {
      expect(radioButtons[index].props().text).toBe(option.title);
    });

    const descriptions = wrapper.findAll(".description");
    expect(descriptions.length).toBe(defaultOptions.length);

    defaultOptions.forEach((option, index) => {
      expect(descriptions[index].html()).toContain(option.description);
    });

    const prices = wrapper.findAll(".price");
    expect(prices.length).toBe(defaultOptions.length);

    defaultOptions.forEach((option, index) => {
      expect(prices[index].html()).toContain(option.price);
    });
  });

  it("sets correct initial value", () => {
    const radioButtons = wrapper.findAllComponents(KdsRadioButton);
    expect(radioButtons[0].props().modelValue).toBe(true);
    expect(radioButtons[1].props().modelValue).toBe(false);
    expect(radioButtons[2].props().modelValue).toBe(false);
  });

  it("applies selected class to price of selected option", () => {
    const prices = wrapper.findAll(".price");
    expect(prices[0].classes()).toContain("selected");
    expect(prices[1].classes()).not.toContain("selected");
    expect(prices[2].classes()).not.toContain("selected");
  });

  it("calls changeValue when radio button is changed", async () => {
    const radioButtons = wrapper.findAllComponents(KdsRadioButton);
    await radioButtons[1].vm.$emit("update:model-value", true);
    expect(changeValue).toHaveBeenCalledWith("option2");
  });

  it("updates selected state when different option is selected", async () => {
    props.control.data = "option2";
    const component = await mountJsonFormsControl(
      RadioButtonsWithDescriptionControl,
      { props },
    );
    const radioButtons = component.wrapper.findAllComponents(KdsRadioButton);

    expect(radioButtons[0].props().modelValue).toBe(false);
    expect(radioButtons[1].props().modelValue).toBe(true);
    expect(radioButtons[2].props().modelValue).toBe(false);

    const prices = component.wrapper.findAll(".price");
    expect(prices[0].classes()).not.toContain("selected");
    expect(prices[1].classes()).toContain("selected");
    expect(prices[2].classes()).not.toContain("selected");
  });

  describe("footnote", () => {
    it("does not render footnote when not provided", () => {
      expect(wrapper.find(".footnote").exists()).toBe(false);
    });

    it("renders footnote when provided in uischema options", async () => {
      props.control.uischema.options = {
        footnote: "This is a <strong>footnote</strong>",
      };
      const component = await mountJsonFormsControl(
        RadioButtonsWithDescriptionControl,
        { props },
      );
      const footnote = component.wrapper.find(".footnote");
      expect(footnote.exists()).toBe(true);
      expect(footnote.html()).toContain("This is a <strong>footnote</strong>");
    });
  });

  describe("empty options", () => {
    it("handles missing oneOf gracefully", async () => {
      props.control.schema = {};
      const component = await mountJsonFormsControl(
        RadioButtonsWithDescriptionControl,
        { props },
      );
      expect(component.wrapper.findAllComponents(KdsRadioButton).length).toBe(
        0,
      );
    });

    it("handles empty oneOf array", async () => {
      props.control.schema = { oneOf: [] };
      const component = await mountJsonFormsControl(
        RadioButtonsWithDescriptionControl,
        { props },
      );
      expect(component.wrapper.findAllComponents(KdsRadioButton).length).toBe(
        0,
      );
    });
  });

  describe("html content in options", () => {
    it("renders HTML in description", async () => {
      props.control.schema = {
        oneOf: [
          {
            const: "html-option",
            title: "HTML Option",
            description: "<em>Emphasized</em> description",
            // @ts-expect-error tests
            price: "$5",
          },
        ],
      };
      const component = await mountJsonFormsControl(
        RadioButtonsWithDescriptionControl,
        { props },
      );
      const description = component.wrapper.find(".description");
      expect(description.html()).toContain("<em>Emphasized</em>");
    });

    it("renders HTML in price", async () => {
      props.control.schema = {
        oneOf: [
          {
            const: "html-option",
            title: "HTML Option",
            description: "Description",
            // @ts-expect-error tests
            price: "<strong>$5</strong>/month",
          },
        ],
      };
      const component = await mountJsonFormsControl(
        RadioButtonsWithDescriptionControl,
        { props },
      );
      const price = component.wrapper.find(".price");
      expect(price.html()).toContain("<strong>$5</strong>");
    });
  });
});
