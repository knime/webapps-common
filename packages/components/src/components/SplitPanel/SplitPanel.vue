<script setup lang="ts">
// Offers a primary and a secondary slot that are split horizontal or vertical. Percent or pixel based sizes
// which can be limited. Click to the splitter will hide the secondary panel.
import { computed, ref, watch } from "vue";

import SwitchIcon from "@knime/styles/img/icons/arrow-prev.svg";

import Splitter from "./Splitter.vue";

type SplitPanelProps = {
  direction?: "left" | "right" | "down" | "up";
  secondaryMinSize?: number;
  secondarySnapSize?: number;
  secondaryMaxSize?: number;
  usePixel?: boolean;
  keepElementOnClose?: boolean;
  splitterId?: string;
  /**
   * When true, completely hides the secondary pane and splitter controls,
   * making only the primary pane visible. The secondary content is either
   * kept in the DOM (if keepElementOnClose=true) or removed entirely.
   */
  hideSecondaryPane?: boolean;
};

const props = withDefaults(defineProps<SplitPanelProps>(), {
  secondarySnapSize: 0,
  secondaryMinSize: 0,
  secondaryMaxSize: 1200,
  usePixel: false,
  direction: "left",
  keepElementOnClose: false,
  splitterId: "",
  hideSecondaryPane: false,
});

const expanded = defineModel<boolean>("expanded", { default: true });
const secondarySize = defineModel<number>("secondarySize", { default: 40 });

const emit = defineEmits<{
  "update:secondarySize": [size: number];
  "update:expanded": [value: boolean];
}>();

// min max to bounds given by props, but allow 0 (hide)
const minMax = (value: number) =>
  value === 0
    ? value
    : Math.max(props.secondaryMinSize, Math.min(props.secondaryMaxSize, value));

// current size live updated while resize
const percentSize = ref(secondarySize.value);
const pixelSize = ref(secondarySize.value);

// mapping of direction
const isHorizontal = computed(() => ["down", "up"].includes(props.direction));
const directionSizePaneMap = {
  left: "left",
  right: "right",
  down: "bottom",
  up: "top",
} as const;
const sizePane = computed(() => directionSizePaneMap[props.direction]);
const isSecondaryReverse = computed(() =>
  ["left", "up"].includes(props.direction),
);

// When hideSecondaryPane is true, we need to hide the secondary pane
// The secondary pane corresponds to the sizePane
const hiddenPane = computed(() =>
  props.hideSecondaryPane ? sizePane.value : undefined,
);

// the last really defined size (which is never 0 for hidden)
// start with secondary size to ensure that we open closed ones to a nice size
const previousSecondarySize = ref(secondarySize.value);

const willSnap = computed(() => {
  if (props.usePixel) {
    return props.secondarySnapSize > pixelSize.value;
  }
  return props.secondarySnapSize > percentSize.value;
});

const modelPercentSize = computed({
  get() {
    return percentSize.value;
  },
  set(size) {
    const adjustedSize = minMax(size);
    percentSize.value = adjustedSize;
    if (!props.usePixel) {
      emit("update:secondarySize", adjustedSize);
    }
  },
});

const modelPixelSize = computed({
  get() {
    return pixelSize.value;
  },
  set(size) {
    const adjustedSize = minMax(size);
    pixelSize.value = adjustedSize;
    if (props.usePixel) {
      emit("update:secondarySize", adjustedSize);
    }
  },
});

const currentSecondarySize = computed({
  get() {
    return props.usePixel ? modelPixelSize.value : modelPercentSize.value;
  },
  set(size) {
    if (props.usePixel) {
      modelPixelSize.value = size;
    } else {
      modelPercentSize.value = size;
    }
  },
});

const showPanel = () => {
  currentSecondarySize.value = Math.max(
    props.secondaryMinSize,
    previousSecondarySize.value,
    props.secondarySnapSize,
  );
};

const closePanel = () => {
  // remember current size on a regular close
  previousSecondarySize.value = currentSecondarySize.value;
  currentSecondarySize.value = 0;
};

const onDragEnd = () => {
  if (willSnap.value) {
    pixelSize.value = 0;
    percentSize.value = 0;
    emit("update:expanded", false);
  } else {
    // remember last size if we did not snap
    previousSecondarySize.value = currentSecondarySize.value;
    emit("update:expanded", true);
  }
};

// hide or show on click
const onSplitterClick = () => {
  emit("update:expanded", !expanded.value);
};

watch(
  expanded,
  () => {
    if (expanded.value) {
      showPanel();
    } else {
      closePanel();
    }
  },
  { immediate: true },
);
</script>

<template>
  <Splitter
    v-model:percent="modelPercentSize"
    v-model:pixel="modelPixelSize"
    :splitter-id="splitterId"
    :use-pixel="usePixel"
    :size-pane="sizePane"
    :is-horizontal="isHorizontal"
    :splitter-size="1"
    :hidden-pane="hiddenPane"
    :class="[
      'splitter-root',
      `direction-${direction}`,
      { 'will-snap': willSnap, closed: !expanded },
    ]"
    :splitter-title="`Click to ${expanded ? 'close' : 'open'}`"
    @splitter-click="onSplitterClick"
    @drag-end="onDragEnd"
  >
    <template v-if="isSecondaryReverse" #left-pane>
      <div
        class="secondary-wrapper"
        :class="{ 'will-snap': willSnap, 'is-horizontal': isHorizontal }"
      >
        <slot
          v-if="(expanded && !hideSecondaryPane) || keepElementOnClose"
          name="secondary"
        />
      </div>
    </template>
    <template v-else #left-pane>
      <slot />
    </template>
    <template #splitter>
      <SwitchIcon
        class="switch-icon"
        :class="[`direction-${direction}`, { closed: !expanded }]"
      />
    </template>
    <template v-if="isSecondaryReverse" #right-pane>
      <slot />
    </template>
    <template v-else #right-pane>
      <div
        class="secondary-wrapper"
        :class="{ 'will-snap': willSnap, 'is-horizontal': isHorizontal }"
      >
        <slot
          v-if="(expanded && !hideSecondaryPane) || keepElementOnClose"
          name="secondary"
        />
      </div>
    </template>
  </Splitter>
</template>

<style lang="postcss" scoped>
@import url("@knime/styles/css/mixins.css");

.switch-icon {
  @mixin svg-icon-size 10;

  stroke: var(--knime-masala);
  position: relative;

  &:not(.closed) {
    visibility: hidden;
  }

  &.direction-left {
    &.closed {
      transform: scaleX(-1);
    }
  }

  &.direction-right {
    &:not(.closed) {
      transform: scaleX(-1);
    }
  }

  &.direction-up {
    transform: rotate(90deg);

    &.closed {
      transform: rotate(-90deg);
    }
  }

  &.direction-down {
    transform: rotate(-90deg);

    &.closed {
      transform: rotate(90deg);
    }
  }
}

.splitter-root {
  --splitter-background-color: transparent;
  --splitter-border: 1px solid var(--knime-silver-sand);
  --splitter-touch-zone: -8px;
  --splitter-closed-size: 10px;

  /** different size for closed splitters */
  &.closed {
    &.vertical :deep(> .splitter) {
      width: var(--splitter-closed-size);
    }

    &.horizontal :deep(> .splitter) {
      height: var(--splitter-closed-size);
    }
  }

  /** touch zone / hover area */
  & :deep(> .splitter) {
    position: relative;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      z-index: var(--z-index-common-splitter, 20);
    }
  }

  &.direction-up {
    & :deep(> .splitter) {
      border-bottom: var(--splitter-border);

      &::before {
        top: var(--splitter-touch-zone);
        width: 100%;
      }
    }
  }

  &.direction-down {
    & :deep(> .splitter) {
      border-top: var(--splitter-border);

      &::before {
        bottom: var(--splitter-touch-zone);
        width: 100%;
      }
    }
  }

  &.direction-left {
    & :deep(> .splitter) {
      border-right: var(--splitter-border);

      &::before {
        left: var(--splitter-touch-zone);
        height: 100%;
      }
    }
  }

  &.direction-right {
    & :deep(> .splitter) {
      border-left: var(--splitter-border);

      &::before {
        right: var(--splitter-touch-zone);
        height: 100%;
      }
    }
  }

  & :deep(> .splitter.active),
  :deep(.splitter:hover) {
    border-color: var(--knime-masala);
  }

  & :deep(.splitter:hover) {
    transition: border-color 500ms 300ms ease-in;
    border-color: var(--knime-masala);
  }
}

.secondary-wrapper {
  width: 100%;
  height: 100%;
}

/* snap overlay and message */
.will-snap {
  --will-snap-background-color: var(--knime-porcelain);
  --splitter-background-color: var(--will-snap-background-color) !important;
}

.secondary-wrapper.will-snap {
  position: relative;

  &::after {
    position: absolute;
    content: "";
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--will-snap-background-color);
    z-index: var(--z-index-common-splitter, 20);
  }

  &.is-horizontal::after {
    content: "Release to hide panel.";
    display: flex;
    font-style: italic;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>
