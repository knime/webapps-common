<script setup lang="ts">
import {
  type Component,
  computed,
  defineComponent,
  inject,
  onBeforeUnmount,
  provide,
  ref,
  useTemplateRef,
  watch,
} from "vue";
import { useElementHover } from "@vueuse/core";

import { ChildItemKey, ListDepthKey, ParentItemKey } from "./keys";
import type { NavMenuItemProps } from "./types";

const props = withDefaults(defineProps<NavMenuItemProps>(), {
  to: undefined,
  href: undefined,
  active: false,
});

const emit = defineEmits<{
  click: [event: KeyboardEvent | MouseEvent];
}>();

const linkRef = useTemplateRef("linkRef");
const isHovered = useElementHover(linkRef);

// Vue Router does not support external links (e.g just normal anchors), but we
// have to support using an external link as part of the navigation.
// However, because we're creating and binding manually the anchor element
// due to the `custom` usage of the NuxtLink/RouterLink, we can't use a `<a>` tag
// as root element for this component.
// For this reason, we create a dummy component that simply provides the same
// slot props as NuxtLink/RouterLink would and then regular links will work fine
//  when using the `href` prop
const NativeLinkFallback = defineComponent({
  name: "NativeLinkFallback",
  props: {
    href: { type: String, required: true },
  },
  setup(fallbackProps, { slots }) {
    const navigate = () => {};

    const slotProps = {
      isActive: false,
      isExactActive: false,
      href: fallbackProps.href,
      navigate,
    };

    return () => {
      return slots.default?.(slotProps) ?? null;
    };
  },
});

const LinkComponent = inject<string | Component>(
  "NavMenuItemLinkComponent",
  () => {
    consola.warn(
      "NavMenuItem::Could not resolve LinkComponent; using default value. Did you forget add NavMenu as the parent?",
    );
    return NativeLinkFallback;
  },
);

const componentInstance = computed(() => {
  if (props.href) {
    return NativeLinkFallback;
  }

  return LinkComponent;
});

// --- Recursive styling ---
const depth = inject(ListDepthKey, 0);
const isTopLevel = computed(() => depth === 1);
const hasActiveChild = ref(false);

// Provide api for possible lists that could be nested inside THIS item.
// Those nested lists will use this injection key to report back to THIS component if they
// have active children
provide(ParentItemKey, {
  setHasActiveChild(value: boolean) {
    const hasChanged = hasActiveChild.value !== value;
    if (hasChanged) {
      hasActiveChild.value = value;
    }
  },
});

// Report THIS item's active state to its parent (the list THIS component is a direct child of)
const parentList = inject(ChildItemKey, null);
const id = Symbol("Item");

watch(
  () => Boolean(props.active),
  (value) => parentList?.reportActive(id, value),
  { immediate: true },
);

onBeforeUnmount(() => parentList?.reportActive(id, false));

/**
 * Styling rules:
 * - active top-level item: prominent-text + highlighted + with-indicator
 * - active nested: prominent-text + highlighted | (no indicator)
 * - parent of active nested: prominent-text + with-indicator | (no highlighted)
 */
const prominentText = computed(() => props.active || hasActiveChild.value);
const highlighted = computed(() => props.active && !hasActiveChild.value);
const withIndicator = computed(() => {
  if (hasActiveChild.value) {
    return true;
  }

  return props.active && isTopLevel.value;
});
// --- Recursive styling ---
</script>

<template>
  <Component
    :is="componentInstance"
    #default="{ href: _href, navigate }"
    custom
    v-bind="props"
  >
    <li
      :class="[
        'menu-item',
        prominentText ? 'prominent-text' : undefined,
        highlighted ? 'highlighted' : undefined,
        withIndicator ? 'with-indicator' : undefined,
      ]"
    >
      <a
        ref="linkRef"
        v-bind="$attrs"
        :href="_href"
        :class="['menu-item-main']"
        @click="
          (event) => {
            if (props.manualNavigation && !props.href) {
              event.preventDefault();
              emit('click', event);
            } else {
              navigate(event);
            }
          }
        "
      >
        <div v-if="$slots.prepend" class="prepend">
          <slot name="prepend" :is-item-hovered="isHovered" />
        </div>

        <div class="text" :title="text">
          {{ text }}
        </div>

        <div v-if="$slots.append" class="append">
          <slot name="append" :is-item-hovered="isHovered" />
        </div>
      </a>

      <div v-if="$slots.children" class="menu-item-children">
        <slot name="children" :is-item-hovered="isHovered" />
      </div>
    </li>
  </Component>
</template>

<style lang="postcss" scoped>
@import url("@knime/styles/css/mixins");

.menu-item {
  --typography-font-family: "Roboto", sans-serif;

  /* weight, size/line-height, family  */
  --typography-button-medium-prominent: 600 15px/16px
    var(--typography-font-family);

  --inline-padding: var(--space-8);
  --text-default-color: var(--knime-dove-gray);
  --text-active-color: var(--knime-cornflower-dark);
  --text-hover-color: var(--knime-masala);
  --bg-active: var(--knime-cornflower-semi);

  position: relative;
  font: var(--typography-button-medium-prominent);
  color: var(--text-default-color);

  & .menu-item-main {
    display: flex;
    flex: 1;
    gap: var(--space-4);
    align-items: center;
    padding: 0 var(--space-8);
    margin-bottom: var(--space-8);
    text-decoration: none;

    & .prepend :slotted(svg),
    & .append :slotted(svg) {
      --size: 16;

      display: flex;
      min-width: calc(var(--size) * 1px);
      stroke: var(--text-default-color);

      @mixin svg-icon-size var(--size);
    }

    & .text {
      max-width: 225px;
      padding: var(--inline-padding) 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    & .append {
      /* flush to the right */
      margin-left: auto;
    }
  }

  & .menu-item-children {
    & .menu-item-main {
      padding-left: 28px;
    }
  }

  &.prominent-text {
    color: var(--text-active-color);

    & > .menu-item-main .prepend :slotted(svg),
    & > .menu-item-main .append :slotted(svg) {
      stroke: var(--text-active-color);
    }
  }

  & > .menu-item-main:hover {
    color: var(--text-hover-color);
    background: var(--bg-active);

    & .prepend :slotted(svg),
    & .append :slotted(svg) {
      stroke: var(--text-hover-color);
    }
  }

  &.highlighted > .menu-item-main {
    background: var(--bg-active);
  }

  &.with-indicator::after {
    position: absolute;
    top: var(--inline-padding);
    left: 0;
    display: block;
    width: var(--space-4);
    height: var(--space-16);
    content: "";
    background: var(--knime-cornflower);
    border-radius: 0 4px 4px 0;
  }
}
</style>
