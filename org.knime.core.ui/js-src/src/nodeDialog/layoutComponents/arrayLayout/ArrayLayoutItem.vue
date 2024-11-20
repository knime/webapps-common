<script setup lang="ts">
import { computed, onMounted, onUnmounted, provide } from "vue";
import { composePaths } from "@jsonforms/core";

import { AlertType } from "@knime/ui-extension-service";

import { provideForAddedArrayLayoutElements } from "@/nodeDialog/composables/components/useAddedArrayLayoutItem";
import {
  type IdsRecord,
  createArrayAtPath,
  createForArrayItem,
  deleteArrayItem,
} from "@/nodeDialog/composables/nodeDialog/useArrayIds";
import { elementCheckboxFormat } from "@/nodeDialog/renderers/elementCheckboxRenderer";
import inject from "@/nodeDialog/utils/inject";

import ArrayLayoutItemLabel, {
  type TitleConfig,
} from "./ArrayLayoutItemLabel.vue";
import { addIndexToStateProviders, addIndexToTriggers } from "./composables";

const props = defineProps<{
  elements: [string, any][];
  elementCheckboxScope: string | undefined;
  arrayElementTitle: false | TitleConfig;
  subTitleProvider: string | undefined;
  index: number;
  path: string;
  hasBeenAdded: boolean;
  id: string;
  idsRecord: IdsRecord;
}>();

if (props.hasBeenAdded) {
  provideForAddedArrayLayoutElements();
}

addIndexToStateProviders(props.id, props.index);
addIndexToTriggers(props.id);
const childPaths = createForArrayItem(props.idsRecord, props.id);
provide("createArrayAtPath", (path: string) =>
  createArrayAtPath(childPaths, path),
);
const indexedPath = computed(() => composePaths(props.path, `${props.index}`));

const updateData = inject("updateData");

const sendAlert = inject("sendAlert");
onMounted(() => {
  if (!props.arrayElementTitle && props.elements.length > 1) {
    sendAlert({
      message:
        "For displaying more than one row of widgets within an array layout element, " +
        "the configuration must provide a title for an element.",
      type: AlertType.ERROR,
    });
  }
  updateData(indexedPath.value);
});

onUnmounted(() => {
  deleteArrayItem(props.idsRecord, props.id);
});
</script>

<template>
  <template v-if="arrayElementTitle">
    <div class="item-header">
      <div
        class="left"
        :style="{ alignItems: subTitleProvider ? 'normal' : 'baseline' }"
      >
        <slot
          v-if="elementCheckboxScope"
          name="renderer"
          :path="indexedPath"
          :element="{
            type: 'Control',
            scope: elementCheckboxScope,
            options: {
              format: elementCheckboxFormat,
            },
          }"
        />
        <ArrayLayoutItemLabel
          :title-config="arrayElementTitle"
          :sub-title-provider="subTitleProvider"
          :index="index"
        />
      </div>
      <slot name="controls" />
    </div>
    <div class="elements">
      <slot
        v-for="[elemKey, element] in elements"
        :key="`${indexedPath}-${elemKey}`"
        name="renderer"
        :path="indexedPath"
        :element="element"
      />
    </div>
  </template>
  <div v-else class="element">
    <div class="form-component">
      <slot name="renderer" :element="elements[0][1]" :path="indexedPath" />
    </div>
    <div class="compensate-label">
      <slot name="controls" />
    </div>
  </div>
</template>

<style scoped lang="postcss">
.item-header {
  display: flex;
  justify-content: space-between;
  align-items: end;

  & .left {
    display: flex;
    align-items: end;
  }
}

.elements {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  margin-top: var(--space-16);

  &:empty {
    margin-top: 0;
  }
}

.element {
  display: flex;
  align-items: center;
  gap: 5px;

  /* Needed to align buttons centered with controls that have a label */
  & .compensate-label {
    margin-top: 25px;
  }

  & .form-component {
    flex-grow: 1;
    min-width: 0;
  }
}
</style>
