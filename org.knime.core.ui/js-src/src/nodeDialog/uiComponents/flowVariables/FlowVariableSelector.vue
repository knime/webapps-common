<script setup lang="ts">
import Dropdown from "webapps-common/ui/components/forms/Dropdown.vue";
import MulitpleConfigKeysNotYetSupported from "./MultipleConfigKeysNotYetSupported.vue";
import type FlowVariableSelectorProps from "./types/FlowVariableSelectorProps";
import { computed, onMounted, ref, type Ref } from "vue";
import type { PossibleFlowVariable } from "@/nodeDialog/api/types";
import {
  setControllingFlowVariable,
  unsetControllingFlowVariable,
} from "@/nodeDialog/api/flowVariables";
import { getConfigPaths } from "@/nodeDialog/utils";
import inject from "@/nodeDialog/utils/inject";

const { getAvailableFlowVariables, getFlowVariableOverrideValue } =
  inject("flowVariablesApi")!;

const props = defineProps<FlowVariableSelectorProps>();

/**
 * Either the single path under which the flow variables are stored within the
 * flowVariablesMap for this setting or false if there are multiple config keys
 * present (which is not yet supported).
 */
const singlePath = computed(() => {
  const paths = getConfigPaths(props.path, props.configKeys);
  return paths.length === 1 ? paths[0] : false;
});

const dropdownPossibleValues: Ref<
  {
    id: string | number;
    text: string;
    title: string;
  }[]
> = ref([]);
const nameToFlowVariable: Ref<Record<string, PossibleFlowVariable>> = ref({});

const noFlowVariableOption = {
  id: 0,
  text: " ",
  title: "No controlling variable",
};

const toDropdownValues = (allPossibleValues: PossibleFlowVariable[]) => [
  noFlowVariableOption,
  ...allPossibleValues.map((flowVar) => ({
    id: flowVar.name,
    text: flowVar.name,
    title: `${flowVar.name} (currently "${flowVar.value}")`,
  })),
];

const fetchAllPossibleValues = async (path: string) => {
  const possibleValuesByType = await getAvailableFlowVariables(path);
  return Object.values(possibleValuesByType).flat();
};

let availableVariablesLoaded = ref(false);

onMounted(async () => {
  if (singlePath.value) {
    const allPossibleValues = await fetchAllPossibleValues(singlePath.value);
    nameToFlowVariable.value = allPossibleValues.reduce(
      (lookupMap, flowVar) => {
        lookupMap[flowVar.name] = flowVar;
        return lookupMap;
      },
      {} as Record<string, PossibleFlowVariable>,
    );
    dropdownPossibleValues.value = toDropdownValues(allPossibleValues);
    availableVariablesLoaded.value = true;
  }
});

const selectedValue = computed(
  () => props.flowSettings?.controllingFlowVariableName ?? "",
);

const emit = defineEmits(["controllingFlowVariableSet"]);

const selectValue = async (selectedId: string | number) => {
  if (!singlePath.value) {
    return;
  }
  if (selectedId === noFlowVariableOption.id) {
    unsetControllingFlowVariable(props.flowVariablesMap, {
      path: singlePath.value,
    });
    return;
  }
  const flowVar = nameToFlowVariable.value[selectedId];
  setControllingFlowVariable(props.flowVariablesMap, {
    path: singlePath.value,
    flowVariableName: flowVar.name,
  });
  const value = await getFlowVariableOverrideValue(props.path);
  emit("controllingFlowVariableSet", value);
};

const ariaLabel = computed(() => `controlling-flow-variables-${props.path}`);
const noOptionsPresent = computed(() =>
  Boolean(dropdownPossibleValues.value.length === 1),
);
const placeholder = computed(() => {
  if (!availableVariablesLoaded.value) {
    return "Fetching available flow variables...";
  }
  return noOptionsPresent.value
    ? "No suitable variable present"
    : "No flow variable selected";
});
</script>

<!-- eslint-disable vue/attribute-hyphenation typescript complains with ':aria-label' instead of ':ariaLabel'-->
<template>
  <Dropdown
    v-if="singlePath"
    :ariaLabel="ariaLabel"
    :possible-values="dropdownPossibleValues"
    :model-value="availableVariablesLoaded ? selectedValue : ''"
    :placeholder="placeholder"
    :disabled="!availableVariablesLoaded || noOptionsPresent"
    @update:model-value="selectValue"
  />
  <MulitpleConfigKeysNotYetSupported v-else :config-keys="configKeys!" />
</template>
