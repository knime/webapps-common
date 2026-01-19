<script setup lang="ts">
import { type Component, computed, inject, provide, ref, watch } from "vue";

import { ChildItemKey, ListDepthKey, ParentItemKey } from "./keys";

type Props = {
  linkComponent: string | Component;
};

const props = defineProps<Props>();
provide("NavMenuItemLinkComponent", props.linkComponent);

// --- Recursive styling ---
// Use an incrementing counter to determine the depth of a recursive usage
const parentDepth = inject(ListDepthKey, 0);
const depth = computed(() => parentDepth + 1);
provide(ListDepthKey, depth.value);

// Try to inject context from a possible parent. If none is gotten, then this is a top-level
// NavMenu. Otherwise, it's nested and we can use the injected key as a way to communicate
// to the parent
const parentItem = inject(ParentItemKey, null);

// Track active *direct* NavItem children THIS list
const activeCount = ref(0);

// Only report to parentItem if this list is nested (depth > 1) and parentItem exists.
// Otherwise, it's a top-level list and we don't have to report anything
watch(
  () => activeCount.value > 0,
  (hasAny) => {
    if (parentItem && depth.value > 1) {
      parentItem.setHasActiveChild(hasAny);
    }
  },
  { immediate: true },
);

// Provide THIS list's children, a way to report if they have _other_ nested items that
// could be active
const states = new Map<symbol, boolean>();
function reportActive(id: symbol, active: boolean) {
  const prev = states.get(id) ?? false;
  if (prev === active) {
    return;
  }

  states.set(id, active);
  if (active) {
    activeCount.value += 1;
  } else {
    activeCount.value -= 1;
  }
}

provide(ChildItemKey, { reportActive });
// --- Recursive styling ---
</script>

<template>
  <ul v-bind="$attrs" class="nav-menu">
    <slot />
  </ul>
</template>

<style lang="postcss" scoped>
/* list style reset */
.nav-menu,
.nav-menu :deep(ul) {
  padding: 0;
  margin: 0;
  list-style-type: none;
}
</style>
