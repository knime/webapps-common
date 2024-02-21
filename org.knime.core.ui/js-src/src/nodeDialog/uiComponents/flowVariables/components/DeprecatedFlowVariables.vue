<script setup lang="ts">
import { getFlowVariablesMap } from "../../../composables/useFlowVariables";
import Button from "webapps-common/ui/components/Button.vue";
import useDeprecatedConfigPaths from "../composables/useDeprecatedConfigPaths";

const { deprecatedSetConfigPaths } = useDeprecatedConfigPaths();

const flowVariablesMap = getFlowVariablesMap();
const getFlowVariableName = (path: string) =>
  flowVariablesMap[path].controllingFlowVariableName ??
  flowVariablesMap[path].exposedFlowVariableName;

const unsetDeprecatedPath = (path: string) => {
  delete flowVariablesMap[path];
};
</script>

<template>
  <p>The following set flow variables are deprecated:</p>
  <div v-for="path in deprecatedSetConfigPaths" :key="path">
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
