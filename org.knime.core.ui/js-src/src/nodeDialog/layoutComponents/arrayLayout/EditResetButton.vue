<template>
  <FunctionButton v-if="!control.data" @click="setEditing">
    <EditIcon />
  </FunctionButton>
  <FunctionButton v-else @click="reset">
    <ResetIcon />
  </FunctionButton>
  <template v-else>
    <FunctionButton v-if="!control.data" title="Edit" @click="setEditing">
      <EditIcon />
    </FunctionButton>
    <FunctionButton v-else title="Reset to default" @click="reset">
      <ResetIcon />
    </FunctionButton>
  </template>
</template>

<script setup lang="ts">
import FunctionButton from "webapps-common/ui/components/FunctionButton.vue";
import EditIcon from "webapps-common/ui/assets/img/icons/pencil.svg";
import ResetIcon from "webapps-common/ui/assets/img/icons/reset-all.svg";
import { rendererProps } from "@jsonforms/vue";
import { useJsonFormsControlWithUpdate } from "@/nodeDialog/composables/components/useJsonFormsControlWithUpdate";

const props = defineProps(rendererProps());

const { control, handleChange } = useJsonFormsControlWithUpdate(props);
const emit = defineEmits(["reset"]);
const setEditing = () => handleChange(control.value.path, true);
const reset = () => [handleChange(control.value.path, false), emit("reset")];
</script>
