<script setup lang="ts" generic="SettingValue">
import { computed, ref } from "vue";
import { rendererProps } from "@jsonforms/vue";

import { Button } from "@knime/components";

import { useJsonFormsControlWithUpdate } from "../composables/components/useJsonFormsControlWithUpdate";
import inject from "../utils/inject";

import DialogComponentWrapper from "./DialogComponentWrapper.vue";
import DynamicIcon, { type Icon } from "./DynamicIcon.vue";
import DescriptionPopover from "./description/DescriptionPopover.vue";

const props = defineProps(rendererProps());
const { control } = useJsonFormsControlWithUpdate(props);
const disabled = computed(() => !control.value.enabled);

const triggerId = computed(() => control.value.uischema.options!.triggerId);

const icon = computed<Icon | undefined>(
  () => control.value.uischema.options!.icon,
);

const trigger = inject("trigger");

const onClick = () => {
  trigger({ id: triggerId.value });
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
      <Button
        compact
        with-border
        :disabled="disabled"
        class="button-input"
        @click="onClick"
      >
        <DynamicIcon v-if="icon" :icon="icon" />{{ control.label }}
      </Button>
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
    width: 100%;
  }
}

svg {
  height: 18px;
}
</style>
