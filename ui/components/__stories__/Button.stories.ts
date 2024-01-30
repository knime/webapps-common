import type { Meta, StoryObj } from "@storybook/vue3";

import Button from "../Button.vue";
import LightningIcon from "../../assets/img/icons/lightning.svg";

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
  title: "UI Components/Button",
  component: Button,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ["autodocs"],
  argTypes: {},
  args: {
    primary: true,
    compact: false,
    onDark: false,
    withBorder: false,
  },
  parameters: {
    docs: {
      /* description: { component: "Hello Helian" } */ extractComponentDescription:
        (component) => {
          console.warn(component);
          return "some string";
        },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">{{ args.default }}</Button>',
  }),
  args: {
    // @ts-expect-error
    default: "Click me!",
  },
  parameters: { docs: { description: { story: "Story description" } } },
};

export const WithIcon: Story = {
  render: (args) => ({
    components: { Button, LightningIcon },
    setup() {
      return { args };
    },
    template:
      '<Button v-bind="args"><LightningIcon /> {{ args.default }}</Button>',
  }),
  args: {
    // @ts-expect-error
    default: "Click me too!",
  },
};

export const WithWarning: Story = {
  render: (args) => ({
    components: { Button, LightningIcon },
    setup() {
      return { args };
    },
    template:
      '<Button v-bind="args"><LightningIcon /> {{ args.default }}</Button>',
  }),
  args: {
    primary: false,
    withBorder: true,
    withWarning: true,
    // @ts-expect-error
    default: "I have a warning",
  },
};
