<script lang="ts">
import { ref, inject, toRefs, computed } from "vue";
import {
  useFloating,
  type Strategy,
  type Placement,
  shift,
  flip,
  autoUpdate,
} from "@floating-ui/vue";

import FunctionButton from "./FunctionButton.vue";
import MenuItems from "./MenuItems.vue";
import useClickOutside from "../composables/useClickOutside";

import type { MenuItem } from "./MenuItems.vue";
import type { PropType } from "vue";

const orientations = ["right", "top", "left"] as const;

type Orientation = (typeof orientations)[number];

const placementMap: Record<Orientation, Placement> = {
  right: "bottom-end",
  top: "top-end",
  left: "bottom-start",
};

/**
 * SubMenu offers shows a Button with a submenu based on MenuItems.
 * It offers an orientation where the menu appears (top, left, right)
 */
export default {
  components: {
    FunctionButton,
    MenuItems,
  },
  props: {
    /**
     * Items to be listed in the menu.
     * See MenuItems for more details.
     */
    items: {
      type: Array as PropType<Array<MenuItem>>,
      required: true,
    },
    /**
     * Identifier for click handler
     */
    id: {
      type: String,
      default: "",
    },
    /**
     * Button title
     */
    buttonTitle: {
      type: String,
      default: "",
    },
    /**
     * Alignment of the submenu with the menu button left or right. Defaults to 'right'.
     */
    orientation: {
      type: String as PropType<"right" | "top" | "left">,
      default: "right",
      validator(orientation: Orientation = "right") {
        return orientations.includes(orientation);
      },
    },
    /**
     * Disable SubMenu
     */
    disabled: {
      type: Boolean,
      default: false,
    },
    /**
     * Set max-width for the menu and truncate larger text
     */
    maxMenuWidth: {
      type: Number,
      default: null,
    },
    /**
     * Allow overflow of the popover on the main axis regarding the SubMenu Button
     */
    allowOverflowMainAxis: {
      type: Boolean,
      default: false,
    },
    /**
     * Allows the popover to be displayed outside a containing block with hidden or scroll overflow
     * (see also https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block, e.g. when a parent container
     * has a translate css styling).
     * Whenever the menu is expanded, a callback which closes it again is emitted as the event 'toggle'.
     */
    teleportToBody: {
      type: Boolean,
      default: true,
    },
    /**
     * The positioning strategy for the dropdown menu (also called popover)
     */
    positioningStrategy: {
      type: String as PropType<Strategy>,
      default: "fixed",
      validator: (value: string) => ["fixed", "absolute"].includes(value),
    },
  },
  emits: ["item-click", "toggle", "open", "close"],
  setup(props) {
    const { positioningStrategy } = toRefs(props);
    const submenu = ref(null);
    const menuItems = ref(null);
    const menuWrapper = ref(null);
    const expanded = ref(false);
    const shadowRoot = inject<ShadowRoot | null>("shadowRoot", null);
    const closeMenu = () => {
      expanded.value = false;
    };

    useClickOutside(
      { targets: [submenu, menuItems], callback: closeMenu },
      expanded,
    );

    // floating menu
    const placement = computed(() => placementMap[props.orientation]);
    const middleware = computed(() => [
      shift({ mainAxis: props.allowOverflowMainAxis }),
      flip(),
    ]);
    const {
      floatingStyles: menuWrapperFloatingStyles,
      update: updateFloatingMenu,
    } = useFloating(submenu, menuWrapper, {
      placement,
      strategy: positioningStrategy,
      middleware,
      whileElementsMounted: autoUpdate,
    });

    return {
      menuItems,
      submenu,
      menuWrapper,
      expanded,
      closeMenu,
      updateFloatingMenu,
      menuWrapperFloatingStyles,
      shadowRoot,
    };
  },
  data() {
    return {
      // eslint-disable-next-line no-undefined
      activeDescendant: undefined,
    } as { activeDescendant: string | undefined };
  },
  methods: {
    toggleMenu(event: Event) {
      if (this.disabled) {
        return;
      }
      this.expanded = !this.expanded;

      const toggleCallback = this.expanded
        ? // eslint-disable-next-line brace-style
          () => {
            this.expanded = false;
          }
        : () => {};

      this.$emit("toggle", event, toggleCallback);
      const openOrCloseEvent = this.expanded ? "open" : "close";
      this.$emit(openOrCloseEvent);

      this.updateFloatingMenu();
    },
    onItemClick(event: Event, item: any) {
      this.$emit("item-click", event, item, this.id);
      if (item.checkbox) {
        item.checkbox.setBoolean(!item.checkbox.checked);
        return;
      }
      this.toggleMenu(event);
    },
    onKeydown(event: KeyboardEvent) {
      this.getMenuItems()?.onKeydown(event);
    },
    getMenuItems() {
      return this.$refs.menuItems as any;
    },
    setActiveDescendant(id: string | null) {
      if (id === null) {
        // eslint-disable-next-line no-undefined
        this.activeDescendant = undefined;
      } else {
        this.activeDescendant = id;
      }
    },
  },
};
</script>

<template>
  <div
    ref="submenu"
    :class="['submenu', { expanded }, { disabled }]"
    :aria-owns="activeDescendant"
    :aria-activedescendant="activeDescendant"
    @keydown="onKeydown"
  >
    <FunctionButton
      ref="submenu-toggle"
      aria-haspopup="true"
      type="button"
      :title="buttonTitle"
      :class="['submenu-toggle', { expanded }]"
      :aria-expanded="String(expanded)"
      :disabled="disabled"
      :active="expanded"
      @click.stop="toggleMenu"
    >
      <slot :expanded="expanded" />
    </FunctionButton>
    <Teleport :to="shadowRoot || 'body'" :disabled="!teleportToBody">
      <div
        v-show="expanded"
        ref="menuWrapper"
        :style="menuWrapperFloatingStyles"
        :class="['menu-wrapper', { disabled }]"
      >
        <MenuItems
          v-if="expanded"
          :id="id"
          ref="menuItems"
          :class="['menu-items', `orient-${orientation}`]"
          :items="items"
          :max-menu-width="maxMenuWidth"
          menu-aria-label="sub menu"
          @item-click="onItemClick"
          @close="closeMenu"
          @item-focused="setActiveDescendant"
        />
      </div>
    </Teleport>
  </div>
</template>

<style lang="postcss" scoped>
.menu-wrapper {
  z-index: var(--z-index-common-menu-items-expanded, 57);

  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}
</style>
