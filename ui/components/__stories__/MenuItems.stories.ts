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
  parameters: {
    docs: {
      description: {
        component: `MenuItems component with (optional) hotkey text and icons
        Can be used to create a float-able menu or a sub menu or similar.
        Position and visibility needs to be handled by the wrapper.<br><br>
        The elements of the menu are not focusable.<br>
        Instead, the component exposes a onKeydown method, which can be taken as a listener for keydown events on a focused
        element in a parent component. When doing so, the elements in the menu are marked via keyboard navigation.
        For accessibility, the focused outside element which listens to keydown events needs to have an aria-activedescendant
        label set to the id of the visually focused element and additionally an aria-owns label with the same id if the menu items are
        not DOM-descendants of this element (see https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_focus_activedescendant)
        This id is emitted via the \`@item-focused\` event whenever the visually focused item changes. This emit also yields null whenever no element
        is visually focused.<br><br>
        For some keydown events, a \`@close\` event is emitted.<br><br>
        There is a prop called \`registerKeydown\` if its true the component is registering the onKeydown method to
        the @keydown event on its own. This is handy if you don't need to have any control over it
        (like keeping the focus anywhere).<br><br>
        A click or activation by keyboard (enter and space) emits \`@item-click\`.<br>
        If the data has a \`to\` attribute the used tag will be \`nuxt-link\` if it has a \`href\` attribute it will be a \`a\` tag
        otherwise we use the generic \`button\` and leave the handling of the action to the wrapping component that reacts
        to \`item-click\` and calls any action.<br><br>
        Hovering an item emits \`@item-hovered\`.<br><br>
        There is support for sub menus with the \`children\` key in items. The sublevel menus are recursive and create
        another MenuItems instance. The keyboard navigation is delegated to the submenu and open/close is handled.
        Use the selector \`:deep(.menu-items-sub-level)\` to style the sub menus`,
      },
    },
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
