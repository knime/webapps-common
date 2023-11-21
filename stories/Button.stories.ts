import type { Meta, StoryObj } from "@storybook/vue3";
import "../ui/css/index.css";

import Button from "../ui/components/Button.vue";

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
  title: "Components/Button",
  component: Button,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ["autodocs"],
  argTypes: {},
  args: { primary: false, compact: false, onDark: false, withBorder: false }, // default value
  parameters: {
    slots: { default: "Click me!" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
/* export const Primary: Story = {
  args: {
    primary: true,
  },
}; */

export const Primary: Story = {
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args"><slot /></Button>',
  }),
  args: {
    primary: true,
  },
};

/* export const Compact: Story = {
  args: {
    compact: true,
  },
};

export const Large: Story = {
  args: {
    size: "large",
  },
};

export const Small: Story = {
  args: {
    size: "small",
  },
}; */
