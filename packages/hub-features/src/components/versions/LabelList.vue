<script setup lang="ts">
import { type Ref, computed, onMounted, ref } from "vue";
import { useEventBus } from "@vueuse/core";
import { autoUpdate, offset, useFloating } from "@floating-ui/vue";
import { isEqual } from "lodash-es";

import { FunctionButton } from "@knime/components";
import { truncateString } from "@knime/utils";

import Popover from "../Popover.vue";

import type { AssignedLabel } from "./types";

interface PopoverElement extends HTMLElement {
  closeMenu: () => void;
  openMenu: () => void;
}

const LABEL_LENGTH = 25;

const props = withDefaults(
  defineProps<{
    labels: Array<AssignedLabel>;
    defaultLabelCount?: number;
  }>(),
  { defaultLabelCount: 3 },
);
const emit = defineEmits(["labelOver", "labelLeave"]);

const eventBus = useEventBus("versionLabels");
const eventBusKey = "versionLabelShowPopover";

const showAll = ref(false);
const activeLabel: Ref<AssignedLabel | null> = ref(null);

const popover: Ref<PopoverElement | null> = ref(null);
const floatingPanel: Ref<HTMLElement | null> = ref(null);
const floatingAnchor: Ref<HTMLElement | null> = ref(null);
// 40px is the offset of the arrow on the popover plus the top padding
// this is necessary to compensate for the offset calculation
const defaultCrossAxisOffset = -46;
const defaultMainAxisOffset = 75;

const createMiddleware = () => [
  offset({
    crossAxis: defaultCrossAxisOffset,
    mainAxis: defaultMainAxisOffset,
  }),
];

const { floatingStyles } = useFloating(floatingAnchor, floatingPanel, {
  whileElementsMounted: autoUpdate,
  placement: "left-start",
  strategy: "fixed",
  middleware: createMiddleware(),
});

const popoverTopOffset = ref(0);
const popoverFloatingStyles = computed(() => {
  const parsedTop = parseInt(floatingStyles.value.top.replace("px", ""), 10);
  const compensatedTop = `${parsedTop + popoverTopOffset.value}px`;

  return {
    ...floatingStyles.value,
    top: compensatedTop,
  };
});

const isShowMoreVisible = computed(
  () => props.labels.length > props.defaultLabelCount && !showAll.value,
);

const showMoreButtonText = computed(
  () => `+${props.labels.length - props.defaultLabelCount}`,
);

const filteredLabels = computed(() =>
  showAll.value ? props.labels : props.labels.slice(0, props.defaultLabelCount),
);

const calculateDistanceToUpperBorder = (labelElement: HTMLElement) => {
  const labelRect = labelElement.getBoundingClientRect();
  const floatingAnchorRect = floatingAnchor.value!.getBoundingClientRect();

  return Math.round(labelRect.top - floatingAnchorRect.top);
};

const isActiveLabel = (label: AssignedLabel) =>
  isEqual(activeLabel.value, label);

const togglePopover = (label: AssignedLabel, labelElement: HTMLElement) => {
  if (isActiveLabel(label)) {
    activeLabel.value = null;
    popover.value?.closeMenu();
  } else {
    eventBus.emit(eventBusKey);
    popoverTopOffset.value = calculateDistanceToUpperBorder(labelElement);

    activeLabel.value = label;
    popover.value?.openMenu();
  }
};

const showMore = () => {
  showAll.value = !showAll.value;
};

const mouseOver = () => emit("labelOver");
const mouseLeave = () => emit("labelLeave");

onMounted(() => {
  eventBus.on((event: unknown) => {
    if (event === eventBusKey) {
      popover.value?.closeMenu();
      activeLabel.value = null;
    }
  });
});
</script>

<template>
  <template v-if="labels.length > 0">
    <div class="label-list-with-popover">
      <div ref="floatingAnchor" class="label-list">
        <FunctionButton
          v-for="label in filteredLabels"
          :key="label.labelId"
          compact
          class="with-border"
          :active="isActiveLabel(label)"
          @mouseover="mouseOver"
          @mouseleave="mouseLeave"
          @click.stop="togglePopover(label, $event.currentTarget)"
          @keydown.esc.stop="popover?.closeMenu()"
        >
          {{ truncateString(label.label.name, LABEL_LENGTH) }}
        </FunctionButton>

        <FunctionButton
          v-if="isShowMoreVisible"
          compact
          class="with-border"
          @mouseover="mouseOver"
          @mouseleave="mouseLeave"
          @click.stop="showMore"
          >{{ showMoreButtonText }}</FunctionButton
        >
      </div>

      <div
        ref="floatingPanel"
        class="floating-panel"
        :style="popoverFloatingStyles"
        @click.stop
        @mouseover="mouseOver"
        @mouseleave="mouseLeave"
      >
        <Popover
          ref="popover"
          :use-button="false"
          :button-with-border="false"
          arrow-position="right"
          @close="activeLabel = null"
        >
          <template #content>
            <h6 class="headline">
              {{ activeLabel?.label.name }}
            </h6>
            <div class="panel">
              <div class="description">
                {{ activeLabel?.label.description }}
              </div>
              <div class="message">{{ activeLabel?.message }}</div>
            </div>
          </template>
        </Popover>
      </div>
    </div>
  </template>
</template>

<style lang="postcss" scoped>
.label-list-with-popover {
  position: relative;

  & .label-list {
    position: relative;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    gap: var(--space-4);
    padding: var(--space-6) 0;

    & .function-button {
      &.with-border {
        padding: 2px var(--space-8);
        border: 1px solid var(--knime-silver-sand);

        &.active {
          border-color: var(--theme-button-function-background-color-active);
        }
      }
    }

    &:empty {
      display: none;
    }
  }

  & .floating-panel {
    z-index: 3;
  }
}

/* the position is set back because it interferes with the position calculation of floating UI */
.popover.expanded :deep(.content) {
  position: initial;
}

& .headline,
& .panel {
  line-height: 1.5;
}

& .headline {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  margin: 0 0 var(--space-8);
  padding-right: 18px;
}

& .panel {
  & .description {
    margin-bottom: var(--space-6);
  }

  & .message,
  & .description {
    font-weight: 300;
    font-size: 13px;

    &:empty {
      display: none;
    }
  }
}

@media only screen and (width <= 900px) {
  .label-list-with-popover {
    display: none;
  }
}
</style>
