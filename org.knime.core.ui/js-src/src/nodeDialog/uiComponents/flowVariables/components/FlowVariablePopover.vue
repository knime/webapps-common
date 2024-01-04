<script setup lang="ts">
import Label from "webapps-common/ui/components/forms/Label.vue";
import MulitpleConfigKeysNotYetSupported from "./MultipleConfigKeysNotYetSupported.vue";
import FlowVariableSelector from "./FlowVariableSelector.vue";
import { computed } from "vue";
import FlowVariableExposer from "./FlowVariableExposer.vue";

import { getFlowVariableSettingsProvidedByControl } from "../../../composables/useFlowVariables";
const { dataPaths, configPaths } = getFlowVariableSettingsProvidedByControl();

/**
 * Either the single path under which the flow variables are stored within the
 * flowVariablesMap for this setting or false if there are multiple config keys
 * present (which is not yet supported).
 */
const singleConfigPath = computed(() => {
  return configPaths.value.length === 1 ? configPaths.value[0] : false;
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
          :data-path="dataPaths[0]"
          :persist-path="singleConfigPath"
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
        />
      </Label>
    </div>
  </template>
  <MulitpleConfigKeysNotYetSupported v-else :config-paths="configPaths" />
</template>
>

<style lang="postcss" scoped>
.popover {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
