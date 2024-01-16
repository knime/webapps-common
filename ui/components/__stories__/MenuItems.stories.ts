import type { Meta, StoryObj } from "@storybook/vue3";
import { markRaw } from "vue";
import MenuItems, { type MenuItem } from "../MenuItems.vue";
import HelpIcon from "../../assets/img/icons/circle-help.svg";
import DownloadIcon from "../../assets/img/icons/cloud-download.svg";
import StarIcon from "../../assets/img/icons/star.svg";
import LeaveIcon from "../../assets/img/icons/leave.svg";
import HeartIcon from "../../assets/img/icons/heart.svg";

const menuItemsData: MenuItem[] = [
  {
    href: "https://apple.com",
    text: "Apples",
    icon: markRaw(HelpIcon),
    hotkeyText: "Ctrl + 1",
  },
  {
    href: "https://en.wikipedia.org/wiki/Orange_(colour)",
    text: "Oranges",
    icon: markRaw(StarIcon),
    hotkeyText: "Ctrl + 2",
  },
  {
    href: "about:blank",
    text: "Disabled Item",
    disabled: true,
    icon: markRaw(StarIcon),
    hotkeyText: "Ctrl + 3",
  },
  {
    to: "/testing-nuxt-link",
    text: "Ananas",
    icon: markRaw(HeartIcon),
  },
  {
    href: "https://www.urbandictionary.com/define.php?term=go%20bananas",
    text: "Bananas",
    icon: markRaw(LeaveIcon),
  },
  {
    text: "Item without href/to",
    icon: markRaw(HelpIcon),
  },
  {
    href: "https://www.knime.com/images/knime-logo.svg",
    text: "Item with download attribute",
    download: true,
    icon: markRaw(DownloadIcon),
  },
  {
    text: "Item with checkbox",
    checkbox: {
      checked: true,
      setBoolean: (checked: boolean) =>
        window.alert(
          `You clicked on a checkbox item calling its callback method with the value: ${checked}`,
        ),
    },
  },
];

const meta = {
  title: "UI Components/MenuItems",
  component: MenuItems,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ["autodocs"],
  argTypes: {},
  args: {
    items: menuItemsData,
    menuAriaLabel: "label",
  },
} satisfies Meta<typeof MenuItems>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sample: Story = {
  render: (args) => ({
    components: { MenuItems },
    setup() {
      return { args };
    },
    template: '<MenuItems v-bind="args"></MenuItems>',
  }),
};
