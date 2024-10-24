<script lang="ts" setup>
import { type Ref, computed, ref, toRef } from "vue";
import {
  type MaybeElement,
  type Placement,
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from "@floating-ui/vue";

import PopoverContent from "./PopoverContent.vue";

const arrowSize = 12; // px
const floatingOffset = 4; // px

export interface Props {
  content: InstanceType<typeof PopoverContent>["$props"];
  reference: MaybeElement<Element>;
  placement: Placement;
  isVisible: Ref<boolean>;
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
    offset(arrowSize + floatingOffset),
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
    [isLeft ? "right" : "left"]: x === null ? null : `${x}px`,
    [isBottom ? "bottom" : "top"]: y === null ? null : `${y}px`,
  };
});
</script>

<template>
  <div
    v-if="isVisible.value && reference"
    ref="floating"
    class="hint-popover"
    :style="floatingStyles"
  >
    <PopoverContent v-bind="content" />
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
  --hint-popover-arrow-size: calc(v-bind(arrowSize) * 2px);
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
    z-index: 0;
    position: absolute;

    &.left {
      left: var(--hint-popover-negative-offset);
      transform: rotate(-90deg);
    }

    &.right {
      right: var(--hint-popover-negative-offset);
      transform: rotate(90deg);
    }

    &.top {
      top: var(--hint-popover-negative-offset);
    }

    &.bottom {
      bottom: var(--hint-popover-negative-offset);
      transform: scale(-1);
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
