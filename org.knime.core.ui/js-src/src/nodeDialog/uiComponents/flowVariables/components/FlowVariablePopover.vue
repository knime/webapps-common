<script setup lang="ts">
import { Label } from "@knime/components";
import FlowVariableSelector from "./FlowVariableSelector.vue";
import { computed } from "vue";
import FlowVariableExposer from "./FlowVariableExposer.vue";
import { getLongestCommonPrefix } from "@/nodeDialog/utils/paths";

import { getFlowVariableSettingsProvidedByControl } from "../../../composables/components/useFlowVariables";
import DeprecatedFlowVariables from "./DeprecatedFlowVariables.vue";
import useDeprecatedConfigPaths from "../composables/useDeprecatedConfigPaths";
const { configPaths } = getFlowVariableSettingsProvidedByControl();

const { deprecatedSetConfigPaths } = useDeprecatedConfigPaths();

const prefixLength = computed(() => {
  return getLongestCommonPrefix(
    configPaths.value.map((configPath) => configPath.configPath),
  ).length;
});

const emit = defineEmits(["controllingFlowVariableSet"]);
</script>

<template>
  <DeprecatedFlowVariables v-if="deprecatedSetConfigPaths.length" />
  <template v-else>
    <div class="popover">
      <template
        v-for="(configPath, i) in configPaths"
        :key="configPath.configPath"
      >
        <Label
          #default="{ labelForId }"
          :text="
            configPaths.length === 1
              ? 'Overwrite with flow variable'
              : 'Overwrite '.concat(configPath.configPath.slice(prefixLength))
          "
          class="label"
          :class="{ multiple: i > 0 }"
        >
          <FlowVariableSelector
            :id="labelForId"
            :data-path="configPath.dataPath"
            :persist-path="configPath.configPath"
            @controlling-flow-variable-set="
              emit('controllingFlowVariableSet', $event)
            "
          />
        </Label>
        <Label
          #default="{ labelForId }"
          :text="
            configPaths.length === 1
              ? 'Output as flow variable'
              : 'Output '.concat(configPath.configPath.slice(prefixLength))
          "
          class="label"
        >
          <FlowVariableExposer
            :id="labelForId"
            :persist-path="configPath.configPath"
          />
        </Label>
      </template>
    </div>
  </template>
</template>

<style lang="postcss" scoped>
.popover {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.multiple {
  margin-top: 10px;
}
</style>
