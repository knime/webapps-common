<script setup lang="ts" generic="SettingValue">
import LabeledInput from "./label/LabeledInput.vue";
import FunctionButton from "webapps-common/ui/components/FunctionButton.vue";
import inject from "../utils/inject";
import { computed } from "vue";
import useDialogControl from "../composables/useDialogControl";
import { rendererProps } from "@jsonforms/vue";

const props = defineProps(rendererProps());
const { control } = useDialogControl({ props });

const buttonText = computed(() => control.value.uischema.options!.text);

const triggerId = computed(() => control.value.uischema.options!.triggerId);

const trigger = inject("trigger");

const onClick = () => {
  trigger(triggerId.value);
};
</script>

<template>
  <LabeledInput #default="{ labelForId }" :control="control">
    <FunctionButton
      :id="labelForId"
      class="button-input"
      primary
      @click="onClick"
    >
      <div class="button-input-text">{{ buttonText }}</div>
    </FunctionButton>
  </LabeledInput>
</template>

<style scoped>
.button-input {
  min-width: 100px;
  text-align: center;
}

.button-input-text {
  display: flex;
  justify-content: center;
  width: 100%;
}

svg {
  height: 18px;
}
</style>
