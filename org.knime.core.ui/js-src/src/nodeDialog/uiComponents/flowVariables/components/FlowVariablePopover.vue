<script setup lang="ts">
import Label from "webapps-common/ui/components/forms/Label.vue";
import MultipleConfigKeysNotYetSupported from "./MultipleConfigKeysNotYetSupported.vue";
import FlowVariableSelector from "./FlowVariableSelector.vue";
import { computed } from "vue";
import FlowVariableExposer from "./FlowVariableExposer.vue";

import { getFlowVariableSettingsProvidedByControl } from "../../../composables/useFlowVariables";
import DeprecatedFlowVariables from "./DeprecatedFlowVariables.vue";
import useDeprecatedConfigPaths from "../composables/useDeprecatedConfigPaths";
const { dataPaths, configPaths } = getFlowVariableSettingsProvidedByControl();

const { deprecatedSetConfigPaths } = useDeprecatedConfigPaths();

const configPathsAndLegacyConfigPaths = computed(() => [
  ...configPaths.value.map(({ configPath }) => configPath),
  ...deprecatedSetConfigPaths.value,
]);

/**
 * Either the single path under which the flow variables are stored within the
 * flowVariablesMap for this setting or false if there are multiple config keys
 * present (which is not yet supported).
 */
const singleConfigPath = computed(() => {
  return configPathsAndLegacyConfigPaths.value.length === 1
    ? configPathsAndLegacyConfigPaths.value[0]
    : false;
});

const emit = defineEmits(["controllingFlowVariableSet"]);
</script>

<template>
  <DeprecatedFlowVariables v-if="deprecatedSetConfigPaths.length" />
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
  <MultipleConfigKeysNotYetSupported
    v-else
    :config-paths="configPaths.map(({ configPath }) => configPath)"
  />
</template>

<style lang="postcss" scoped>
.popover {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
