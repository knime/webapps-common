import type { Meta, StoryObj } from "@storybook/vue3";
import Twinlist from "../../../../../ui/components/forms/Twinlist.vue";
import LoadingIcon from "../../../../../ui/components/LoadingIcon.vue";
import { markRaw } from "vue";

const demoValues = [
  {
    id: "foo",
    text: "Foo",
  },
  {
    id: "bar",
    text: "Bar",
  },
  {
    id: "baz",
    text: "Baz",
  },
  {
    id: "baz2",
    text: "Baz 2",
  },
  {
    id: "baz3",
    text: "Baz 3",
  },
  {
    id: "baz4",
    text: "Baz 4",
  },
  {
    id: "baz5",
    text: "Baz 5",
  },
  {
    id: "baz6",
    text: "Baz 6",
  },
  {
    id: "baz7",
    text: "Baz 7",
  },
  {
    id: "baz8",
    text: "Baz 8",
  },
  {
    id: "baz9",
    text: "Baz 9",
  },
  {
    id: "baz10",
    text: "Baz 10",
  },
  {
    id: "baz11",
    text: "Baz 11",
  },
];
const selected: Array<any> = [];
const selectedUnknown: Array<any> = [];
const selectedMissing = ["foo", "I am missing", "bar"];
const excludedMissing = [
  "baz",
  "I am missing on the left",
  "baz2",
  "baz3",
  "baz4",
  "baz5",
  "baz6",
  "baz7",
  "baz8",
  "baz9",
  "baz10",
  "baz11",
];

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
  title: "UI Components/Forms/Twinlist",
  component: Twinlist,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ["autodocs"],
  argTypes: {},
  args: {
    modelValue: selected,
    possibleValues: demoValues,
    disabled: false,
    size: 7,
    showEmptyState: true,
    isValid: true,
    showSearch: false,
    searchLabel: "Search items",
    searchPlaceholder: "Placeholder",
    initialSearchTerm: "",
    initialCaseSensitiveSearch: false,
    showUnknownValues: false,
    excludedValues: null,
    initialIncludeUnknownValues: false,
    filterChosenValuesOnPossibleValuesChange: true,
  },
} satisfies Meta<typeof Twinlist>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: (args) => ({
    components: { Twinlist },
    setup() {
      return { args };
    },
    template:
      '<Twinlist v-bind="args"/><br/><div class="grid-item-6">selected ids: {{args.modelValue}}</div>',
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Two list boxes for selecting multiple items. It acts as a form element, so it emits an input event when selection changes, and it has a value. For keyboard navigation inside of the lists see MultiselectListBox. With DoubleClick the items can also be moved between the lists.",
      },
    },
  },
};

export const Disabled: Story = {
  render: Overview.render,
  args: {
    ...Overview.args,
    disabled: true,
  },
};

export const WithSearch: Story = {
  render: Overview.render,
  args: {
    ...Overview.args,
    showSearch: true,
    searchLabel: "Search items",
    searchPlaceholder: "Placeholder",
    initialSearchTerm: "bar",
    leftLabel: "Select from the visible items",
  },
  parameters: {
    docs: {
      description: {
        story:
          "The Twinlist with a search field enabled and an initial search term defined. Case-sensitive search can be enabled through a button on the right.",
      },
    },
  },
};

export const MissingSelectedValue: Story = {
  render: Overview.render,
  args: {
    ...Overview.args,
    modelValue: selectedMissing,
    excludedValues: excludedMissing,
    initialIncludeUnknownValues: false,
    showUnknownValues: true,
    showSearch: true,
    leftLabel: "Select from the visible items",
  },
  parameters: {
    docs: {
      description: {
        story: "The Twinlist with missing selected items.",
      },
    },
  },
};

export const WithUnknownItems: Story = {
  render: Overview.render,
  args: {
    ...Overview.args,
    modelValue: selectedUnknown,
    showUnknownValues: true,
    unknownValuesText: "My unknowns",
    showSearch: true,

    leftLabel: "Select from the visible items",
  },
  parameters: {
    docs: {
      description: {
        story: "The Twinlist with unknown items.",
      },
    },
  },
};

export const CustomizableEmptyBox: Story = {
  render: Overview.render,
  args: {
    ...Overview.args,
    emptyStateComponent: markRaw(LoadingIcon),
  },
  parameters: {
    docs: {
      description: {
        story: "The content visible in empty boxes is customizable.",
      },
    },
  },
};
