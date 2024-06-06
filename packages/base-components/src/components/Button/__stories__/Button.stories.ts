import type { Meta, StoryObj } from "@storybook/vue3";
import { userEvent, waitFor, within, expect, fn } from "@storybook/test";

import Button from "../Button.vue";
import LightningIcon from "@knime/styles/img/icons/lightning.svg";

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
        () => {
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
    onClick: fn(),
  },
  parameters: { docs: { description: { story: "Story description" } } },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Click button", async () => {
      await userEvent.click(canvas.getByRole("button"));
    });

    await waitFor(() => expect(args.onClick).toHaveBeenCalled());
  },
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
