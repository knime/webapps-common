<!-- eslint-disable no-undefined -->
<script lang="ts" setup>
/**
 * Popover component for hints with automatic positioning and an arrow. floating ui based.
 * For the content you should use the PopoverContent component in the default slot.
 */
import { computed, ref, toRef } from "vue";
import {
  type Placement,
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from "@floating-ui/vue";

import type { MaybeElement } from "../types";

const ARROW_SIZE_PX = 12;
const FLOATING_OFFSET_PX = 4;

export interface Props {
  reference: MaybeElement;
  placement: Placement;
}

const props = defineProps<Props>();
const placement = toRef(props, "placement");

const floating = ref<HTMLElement>();
const floatingArrow = ref<HTMLElement>();

const referenceElement = toRef(props, "reference");

const {
  floatingStyles,
  middlewareData,
  placement: finalPlacement,
} = useFloating(referenceElement, floating, {
  whileElementsMounted: autoUpdate,
  placement,
  // eslint-disable-next-line no-magic-numbers
  middleware: [
    offset(ARROW_SIZE_PX + FLOATING_OFFSET_PX),
    flip(),
    shift(),
    arrow({ element: floatingArrow, padding: 40 }),
  ],
});

const arrowSide = computed(() => {
  const [side] = finalPlacement.value.split("-");

  switch (side) {
    case "top":
      return "bottom";
    case "bottom":
      return "top";
    case "left":
      return "right";
    case "right":
      return "left";
  }
  return null;
});

const arrowDynamicPositionStyle = computed(() => {
  const isBottom = finalPlacement.value.startsWith("bottom");
  const isLeft = finalPlacement.value.startsWith("left");
  const x = middlewareData.value.arrow?.x;
  const y = middlewareData.value.arrow?.y;
  return {
    [isLeft ? "right" : "left"]: x === null ? undefined : `${x}px`,
    [isBottom ? "bottom" : "top"]: y === null ? undefined : `${y}px`,
  };
});
</script>

<template>
  <div
    v-if="reference"
    ref="floating"
    class="hint-popover"
    :style="floatingStyles"
  >
    <slot />
    <div
      ref="floatingArrow"
      class="arrow"
      :class="arrowSide"
      :style="arrowDynamicPositionStyle"
    >
      <div class="arrow-inner" />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.hint-popover {
  --hint-popover-background: var(--knime-white);

  /** its doubled as we clip half of it see clip-path */
  --hint-popover-arrow-size: calc(v-bind(ARROW_SIZE_PX) * 2px);
  --hint-popover-negative-offset: calc(
    calc(var(--hint-popover-arrow-size) * -1)
  );

  position: relative;
  display: flex;
  max-width: 350px;
  background: var(--hint-popover-background);

  /* the wrapper is needed to have this proper shadow with two elements */
  filter: drop-shadow(0 2px 10px var(--shadow-base-color));

  & .arrow {
    position: absolute;

    &.left {
      left: var(--hint-popover-negative-offset);
      transform: rotate(-90deg);
      margin-left: 1px;
    }

    &.right {
      right: var(--hint-popover-negative-offset);
      transform: rotate(90deg);
      margin-right: 1px;
    }

    &.top {
      top: var(--hint-popover-negative-offset);
      margin-top: 1px;
    }

    &.bottom {
      bottom: var(--hint-popover-negative-offset);
      transform: scale(-1);
      margin-bottom: -1px;
    }

    & .arrow-inner {
      background: var(--hint-popover-background);
      width: var(--hint-popover-arrow-size);
      height: var(--hint-popover-arrow-size);
      clip-path: polygon(50% 50%, 0% 100%, 100% 100%);
    }
  }
}
</style>
