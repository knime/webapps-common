<script setup lang="ts">
import { computed } from "vue";
import {
  getFlowVariableSettingsProvidedByControl,
  getFlowVariablesMap,
} from "../../../composables/useFlowVariables";
import Button from "webapps-common/ui/components/Button.vue";

const flowVariablesMap = getFlowVariablesMap();

const { configPaths } = getFlowVariableSettingsProvidedByControl();

const deprecatedConfigPaths = computed(() => {
  return configPaths.value.flatMap(
    ({ deprecatedConfigPaths }) => deprecatedConfigPaths,
  );
});

const setDeprecatedConfigPaths = computed(() =>
  deprecatedConfigPaths.value.filter((key) => Boolean(flowVariablesMap[key])),
);

const getFlowVariableName = (path: string) =>
  flowVariablesMap[path].controllingFlowVariableName ??
  flowVariablesMap[path].exposedFlowVariableName;

const unsetDeprecatedPath = (path: string) => {
  delete flowVariablesMap[path];
};
</script>

<template>
  <p>The following set flow variables are deprecated:</p>
  <div v-for="path in setDeprecatedConfigPaths" :key="path">
    <ul>
      <li>
        <p>
          "{{ path }}": <input disabled :value="getFlowVariableName(path)" />
        </p>
        <Button with-border compact @click="unsetDeprecatedPath(path)">
          Unset
        </Button>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="postcss">
p {
  margin: 10px 0;
  font-size: 13px;
}

li {
  font-size: 13px;
  overflow-wrap: break-word;
}
</style>
