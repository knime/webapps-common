<script setup lang="ts">
import { computed } from "vue";
import Label from "webapps-common/ui/components/forms/Label.vue";
import { provideForAddedArrayLayoutElements } from "@/nodeDialog/composables/components/useAddedArrayLayoutItem";

const props = defineProps<{
  elements: [string, any][];
  arrayElementTitle: false | string;
  index: number;
  path: string;
  hasBeenAdded: boolean;
}>();

if (props.hasBeenAdded) {
  provideForAddedArrayLayoutElements();
}

const showElementTitles = computed(() => props.arrayElementTitle !== false);

const elementTitle = computed(
  () => `${props.arrayElementTitle} ${props.index + 1}`,
);
</script>

<template>
  <template v-if="showElementTitles">
    <div class="item-header">
      <Label :text="elementTitle" :compact="true" />
      <slot name="controls" />
    </div>

    <slot
      v-for="[elemKey, element] in elements"
      :key="`${path}-${index}-${elemKey}`"
      name="renderer"
      :element="element"
    />
  </template>
  <div v-else class="element">
    <div class="form-component">
      <slot name="renderer" :element="elements[0][1]" />
    </div>
    <div class="compensate-label">
      <slot name="controls" />
    </div>
  </div>
</template>

<style scoped lang="postcss">
.item-header {
  margin-bottom: -10px;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
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
