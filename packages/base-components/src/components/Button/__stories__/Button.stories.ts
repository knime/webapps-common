import type { Meta, StoryObj } from "@storybook/vue3";
import { userEvent, waitFor, within, expect, fn } from "@storybook/test";

import Button from "../Button.vue";
import LightningIcon from "@knime/styles/img/icons/lightning.svg";
import PlayIcon from "@knime/styles/img/icons/circle-play.svg";

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
    default: "Primary button",
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
    components: { Button, PlayIcon },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args"><PlayIcon /> {{ args.default }}</Button>',
  }),
  args: {
    default: "Button with icon",
  },
};

export const Compact: Story = {
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">{{ args.default }}</Button>',
  }),
  args: {
    primary: true,
    compact: true,
    default: "Compact button",
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
    default: "Forceful action",
  },
  parameters: {
    docs: {
      description: {
        story:
          "In some cases, we want to indicate a warning. Example: Forceful action with potential damaging effects. Use with-border and with-warning.",
      },
    },
  },
};
