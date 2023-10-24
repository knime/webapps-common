<script setup lang="ts">
import Label from "webapps-common/ui/components/forms/Label.vue";
import MulitpleConfigKeysNotYetSupported from "./MultipleConfigKeysNotYetSupported.vue";
import FlowVariableSelector from "./FlowVariableSelector.vue";
import { getConfigPaths } from "@/nodeDialog/utils";
import { computed } from "vue";
import type FlowVariablePopoverProps from "./types/FlowVariablePopoverProps";
import FlowVariableExposer from "./FlowVariableExposer.vue";

const props = defineProps<FlowVariablePopoverProps>();
/**
 * Either the single path under which the flow variables are stored within the
 * flowVariablesMap for this setting or false if there are multiple config keys
 * present (which is not yet supported).
 */
const singlePath = computed(() => {
  const paths = getConfigPaths(props.path, props.configKeys);
  return paths.length === 1 ? paths[0] : false;
});

const emit = defineEmits(["controllingFlowVariableSet"]);
</script>

<template>
  <template v-if="singlePath">
    <div class="popover">
      <Label #default="{ labelForId }" text="Select variable" class="label">
        <FlowVariableSelector
          :id="labelForId"
          :data-path="path"
          :persist-path="singlePath"
          :flow-settings="flowSettings"
          :flow-variables-map="flowVariablesMap"
          @controlling-flow-variable-set="
            emit('controllingFlowVariableSet', $event)
          "
        />
      </Label>
      <Label #default="{ labelForId }" text="Expose variable" class="label">
        <FlowVariableExposer
          :id="labelForId"
          :persist-path="singlePath"
          :flow-settings="flowSettings"
          :flow-variables-map="flowVariablesMap"
        />
      </Label>
    </div>
  </template>
  <MulitpleConfigKeysNotYetSupported v-else :config-keys="configKeys!" />
</template>
>

<style lang="postcss" scoped>
.popover {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
