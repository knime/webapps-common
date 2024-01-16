import type { Meta, StoryObj } from "@storybook/vue3";
import Dummy from "../Dummy.vue";

const meta = {
  title: "UI Components/Dummy",
  component: Dummy,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ["autodocs"],
  argTypes: {},
  args: {},
} satisfies Meta<typeof Dummy>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sample: Story = {
  render: (args) => ({
    components: { Dummy },
    setup() {
      return { args };
    },
    template: '<Dummy v-bind="args"></Dummy>',
  }),
};
