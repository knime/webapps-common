<script lang="ts">
export const FIXED_HEIGHT_ITEM = 60;
</script>

<script lang="ts" setup>
import Pill from "../../Pill/Pill.vue";
import ProgressBar from "../ProgressBar/ProgressBar.vue";
import { type ProgressItemProps } from "../types";

const props = defineProps<ProgressItemProps>();
</script>

<template>
  <div class="progress-wrapper" :style="{ height: `${FIXED_HEIGHT_ITEM}px` }">
    <div :class="['progress-item', { padded: !progress }]">
      <div class="item-info">
        <div class="prepend">
          <slot name="prepend" />
        </div>

        <div class="item-name">
          <div class="title" :title="props.title">
            {{ props.title }}
          </div>
          <span v-if="subtitle" class="subtitle">
            {{ subtitle }}
          </span>
        </div>
      </div>

      <div class="item-action">
        <Pill v-if="props.statusPill" :variant="props.statusPill.variant">
          <component :is="props.statusPill.icon" />
          {{ props.statusPill.text }}
        </Pill>

        <slot name="actions" />
      </div>
    </div>
    <div v-if="progress" class="progress">
      <ProgressBar :percentage="progress" :compact="true" />
    </div>
  </div>
</template>

<style scoped lang="postcss">
@import url("@knime/styles/css/mixins.css");

.progress-wrapper {
  --progress-bar-height: var(--space-6);
  --vertical-padding: var(--space-12);
  --horizontal-padding: var(--space-16);

  display: flex;
  flex-direction: column;
  padding: var(--vertical-padding) var(--horizontal-padding)
    calc(var(--vertical-padding) - var(--progress-bar-height));
}

& .progress-item {
  height: 100%;
  display: flex;
  align-items: center;
  width: 100%;
  gap: var(--space-16);

  /* add extra margin to prevent content jump when a progress bars appears/disappears */
  &.padded {
    margin-bottom: var(--progress-bar-height);
  }
}

& .progress {
  display: flex;
  align-items: flex-end;
  min-height: var(--progress-bar-height);
}

& .prepend :slotted(svg) {
  @mixin svg-icon-size 24;

  flex-shrink: 0;
}

& .item-info {
  display: flex;
  gap: var(--space-16);
  font-size: 13px;
  line-height: 14px;
  flex-grow: 1;
  overflow: hidden;

  & .item-name {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    flex-grow: 1;
    overflow: hidden;

    & .title {
      white-space: nowrap;
      font-weight: 700;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }

    & .subtitle {
      color: var(--knime-dove-gray);
      font-weight: 400;
    }
  }
}

& .item-action {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  font-weight: 500;
  font-size: 13px;
  line-height: 13px;
  flex-shrink: 0;

  & :slotted(svg) {
    stroke: var(--knime-dove-gray);
  }
}
</style>
