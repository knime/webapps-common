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
const singleConfigPath = computed(() => {
  const paths = getConfigPaths(
    props.path,
    props.configKeys,
    props.subConfigKeys,
  );
  return paths.length === 1 ? paths[0] : false;
});

const dataPath = computed(() => {
  const firstSubConfig = props.subConfigKeys?.[0];
  return firstSubConfig ? `${props.path}.${firstSubConfig}` : props.path;
});

const emit = defineEmits(["controllingFlowVariableSet"]);
</script>

<template>
  <template v-if="singleConfigPath">
    <div class="popover">
      <Label
        #default="{ labelForId }"
        text="Overwrite with flow variable"
        class="label"
      >
        <FlowVariableSelector
          :id="labelForId"
          :data-path="dataPath"
          :persist-path="singleConfigPath"
          :flow-settings="flowSettings"
          :flow-variables-map="flowVariablesMap"
          @controlling-flow-variable-set="
            emit('controllingFlowVariableSet', $event)
          "
        />
      </Label>
      <Label
        #default="{ labelForId }"
        text="Output as flow variable"
        class="label"
      >
        <FlowVariableExposer
          :id="labelForId"
          :persist-path="singleConfigPath"
          :flow-settings="flowSettings"
          :flow-variables-map="flowVariablesMap"
        />
      </Label>
    </div>
  </template>
  <MulitpleConfigKeysNotYetSupported
    v-else
    :config-keys="configKeys"
    :sub-config-keys="subConfigKeys"
  />
</template>
>

<style lang="postcss" scoped>
.popover {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
