<script setup lang="ts">
import Checkbox from "webapps-common/ui/components/forms/Checkbox.vue";
import useDialogControl from "@/nodeDialog/composables/components/useDialogControl";
import { rendererProps } from "@jsonforms/vue";

const props = defineProps(rendererProps());

const { control, onChange } = useDialogControl({ props });
</script>

<template>
  <Checkbox
    :model-value="control.data"
    :title="control.label"
    class="checkbox"
    @update:model-value="onChange"
  />
</template>

<style lang="postcss" scoped>
.checkbox {
  /** These styles ensure that the checkbox fits into the array layout items header */
  transform: translate(0, 5px);
  margin-right: -15px;
}
</style>
