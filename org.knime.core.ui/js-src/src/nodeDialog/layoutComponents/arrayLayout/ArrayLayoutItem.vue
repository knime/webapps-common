<script setup lang="ts">
import { computed, onMounted, onUnmounted, provide } from "vue";
import Label from "webapps-common/ui/components/forms/Label.vue";
import { provideForAddedArrayLayoutElements } from "@/nodeDialog/composables/components/useAddedArrayLayoutItem";
import { addIndexToStateProviders, addIndexToTriggers } from "./composables";
import { composePaths } from "@jsonforms/core";
import {
  IdsRecord,
  createArrayAtPath,
  createForArrayItem,
  deleteArrayItem,
} from "@/nodeDialog/composables/nodeDialog/useArrayIds";
import inject from "@/nodeDialog/utils/inject";
import { AlertType } from "@knime/ui-extension-service";

const props = defineProps<{
  elements: [string, any][];
  arrayElementTitle: false | string;
  index: number;
  path: string;
  hasBeenAdded: boolean;
  id: string;
  idsRecord: IdsRecord;
}>();

if (props.hasBeenAdded) {
  provideForAddedArrayLayoutElements();
}

addIndexToStateProviders(props.id);
addIndexToTriggers(props.id);
const childPaths = createForArrayItem(props.idsRecord, props.id);
provide("createArrayAtPath", (path: string) =>
  createArrayAtPath(childPaths, path),
);

const showElementTitles = computed(() => props.arrayElementTitle !== false);

const elementTitle = computed(
  () => `${props.arrayElementTitle} ${props.index + 1}`,
);
const indexedPath = computed(() => composePaths(props.path, `${props.index}`));

const updateData = inject("updateData");

const sendAlert = inject("sendAlert");
onMounted(() => {
  if (!showElementTitles.value && props.elements.length > 1) {
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
  <template v-if="showElementTitles">
    <div class="item-header">
      <Label :text="elementTitle" :compact="true" />
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
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.elements {
  display: flex;
  flex-direction: column;
  gap: 15px;
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
