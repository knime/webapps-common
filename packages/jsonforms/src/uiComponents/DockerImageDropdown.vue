<script setup lang="ts">
import { computed } from "vue";

import { Dropdown } from "@knime/components";
import FileIcon from "@knime/styles/img/icons/file-cog.svg";
import SignWarningIcon from "@knime/styles/img/icons/sign-warning.svg";

import type { VueControlProps } from "../higherOrderComponents";

interface DockerImageSlotData {
  name: string;
  description: string;
}

interface DockerImageOption {
  const: string;
  title?: string;
  slotData?: DockerImageSlotData;
}
const props = defineProps<VueControlProps<string>>();

const possibleValues = computed(() => {
  const oneOf = props.control.schema.oneOf as DockerImageOption[] | undefined;
  return (
    oneOf?.map(({ const: id, title, slotData }) => ({
      id,
      text: title ?? "",
      slotData,
    })) || []
  );
});

const modelValue = computed<string>({
  get: () => props.control.data ?? "",
  set: props.changeValue,
});
</script>

<template>
  <!-- eslint-disable vue/attribute-hyphenation typescript complains with ':aria-label' instead of ':ariaLabel'-->
  <Dropdown
    v-bind="$attrs"
    v-model="modelValue"
    class="dropdown-input"
    :possible-values="possibleValues"
    :disabled="disabled"
    ariaLabel="Docker image name"
  >
    <template #option="{ slotData, isMissing, selectedValue, expanded }">
      <div v-if="isMissing">
        <div class="dropdown-item-wrapper">
          <SignWarningIcon class="missing" />
          <div class="main-content">
            <div :class="['title', { expanded }]" :title="selectedValue">
              {{ selectedValue }}
            </div>
            <div :class="['image-description', { expanded }]">
              Executor image not currently registered with your Hub.
            </div>
          </div>
        </div>
      </div>
      <div v-else class="dropdown-item-wrapper slot-option">
        <FileIcon />
        <div class="main-content">
          <div :class="['title', { expanded }]">
            <span :title="slotData.name">{{ slotData.name }}</span>
          </div>
          <div :class="['image-description', { expanded }]">
            {{ slotData.description }}
          </div>
        </div>
      </div>
    </template>
  </Dropdown>
</template>

<style scoped lang="postcss">
.dropdown-input {
  --dropdown-max-height: calc(58px * 5); /* show 5 items per default */
}

.missing-text {
  padding: var(--kds-spacing-container-0-75x) 0 0;
}

.dropdown-item-wrapper {
  display: flex;
  flex-direction: row;
  gap: var(--kds-spacing-container-0-25x);
  width: 100%;
  padding: var(--kds-spacing-container-0-37x) var(--kds-spacing-container-0-37x)
    var(--kds-spacing-container-0-37x) 0;
  font-family: Roboto, sans-serif;

  &:has(.missing) {
    padding-top: var(--kds-spacing-container-0-5x);
    padding-left: 0;
  }

  & > svg {
    flex: 0 0 16px;
    height: var(--kds-dimension-component-height-1x);
    stroke-width: calc(32px / 24);
  }

  & .main-content {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    gap: var(--kds-spacing-container-0-25x);
    max-width: 100%;
  }

  & .image-description {
    font: var(--kds-font-base-body-small);

    &.expanded {
      white-space: wrap;
    }

    &:not(.expanded) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  & .title {
    font: var(--kds-font-base-title-medium);

    &.expanded {
      white-space: wrap;
    }

    &:not(.expanded) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
