<script setup lang="ts" generic="SettingValue">
import FunctionButton from "webapps-common/ui/components/FunctionButton.vue";
import inject from "../utils/inject";
import { computed, ref } from "vue";
import useDialogControl from "../composables/useDialogControl";
import { rendererProps } from "@jsonforms/vue";
import DescriptionPopover from "./description/DescriptionPopover.vue";
import DialogComponentWrapper from "./DialogComponentWrapper.vue";

const props = defineProps(rendererProps());
const { control } = useDialogControl({ props });

const triggerId = computed(() => control.value.uischema.options!.triggerId);

const trigger = inject("trigger");

const onClick = () => {
  trigger(triggerId.value);
};
const hover = ref(false);
</script>

<template>
  <DialogComponentWrapper :control="control">
    <div
      class="simple-button-input"
      @mouseover="hover = true"
      @mouseleave="hover = false"
    >
      <FunctionButton class="button-input" @click="onClick">
        <div class="button-input-text">{{ control.label }}</div>
      </FunctionButton>
      <DescriptionPopover
        v-if="control.description"
        :html="control.description"
        :hover="hover"
      />
    </div>
  </DialogComponentWrapper>
</template>

<style scoped>
.simple-button-input {
  margin-bottom: 10px;
  position: relative;
  display: flex;
  place-content: center space-between;

  & .button-input {
    min-width: 100px;
    text-align: center;
  }

  & .button-input-text {
    display: flex;
    justify-content: center;
    width: 100%;
  }
}

svg {
  height: 18px;
}
</style>
