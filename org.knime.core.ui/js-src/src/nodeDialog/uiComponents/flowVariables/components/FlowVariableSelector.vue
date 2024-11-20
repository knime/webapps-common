<script setup lang="ts">
import { type Ref, computed, onMounted, ref } from "vue";

import { Dropdown } from "@knime/components";

import type { PossibleFlowVariable } from "@/nodeDialog/api/types";
import { injectForFlowVariables } from "../../../utils/inject";
import useControllingFlowVariable from "../composables/useControllingFlowVariable";
import type { FlowVariableSelectorProps } from "../types/FlowVariableSelectorProps";

const props = defineProps<FlowVariableSelectorProps>();
const {
  setControllingFlowVariable,
  unsetControllingFlowVariable,
  controllingFlowVariableName,
  invalidateSetFlowVariable,
} = useControllingFlowVariable(props.persistPath);
const {
  getAvailableFlowVariables,
  getFlowVariableOverrideValue,
  clearControllingFlowVariable,
} = injectForFlowVariables("flowVariablesApi")!;

const dropdownPossibleValues: Ref<
  {
    id: string | number;
    text: string;
    title: string;
  }[]
> = ref([]);
const nameToFlowVariable: Ref<Record<string, PossibleFlowVariable>> = ref({});

const noFlowVariableOption = {
  id: "",
  text: "None",
  title: "No flow variable selected",
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
  const allPossibleValues = await fetchAllPossibleValues(props.persistPath);
  nameToFlowVariable.value = allPossibleValues.reduce(
    (lookupMap, flowVar) => {
      lookupMap[flowVar.name] = flowVar;
      return lookupMap;
    },
    {} as Record<string, PossibleFlowVariable>,
  );
  dropdownPossibleValues.value = toDropdownValues(allPossibleValues);
  availableVariablesLoaded.value = true;
});

const emit = defineEmits(["controllingFlowVariableSet"]);

const selectValue = async (selectedId: string | number) => {
  if (selectedId === noFlowVariableOption.id) {
    unsetControllingFlowVariable({ path: props.persistPath });
    clearControllingFlowVariable(props.persistPath);
    return;
  }
  const flowVar = nameToFlowVariable.value[selectedId];
  const setVariableProps = {
    path: props.persistPath,
    flowVariableName: flowVar.name,
  };
  setControllingFlowVariable(setVariableProps);
  const value = await getFlowVariableOverrideValue(
    props.persistPath,
    props.dataPath,
  );
  const isFlawed = typeof value === "undefined";
  if (isFlawed) {
    invalidateSetFlowVariable(setVariableProps);
  } else {
    emit("controllingFlowVariableSet", value);
  }
};

const ariaLabel = computed(
  () => `controlling-flow-variables-${props.persistPath}`,
);
const noOptionsPresent = computed(
  () =>
    Boolean(dropdownPossibleValues.value.length === 1) &&
    !controllingFlowVariableName.value,
);
const placeholder = computed(() => {
  if (!availableVariablesLoaded.value) {
    return "Fetching available flow variables...";
  }
  return noOptionsPresent.value
    ? "No suitable flow variable present"
    : "No flow variable selected";
});
</script>

<!-- eslint-disable vue/attribute-hyphenation typescript complains with ':aria-label' instead of ':ariaLabel'-->
<template>
  <Dropdown
    :ariaLabel="ariaLabel"
    :possible-values="dropdownPossibleValues"
    :model-value="availableVariablesLoaded ? controllingFlowVariableName : ''"
    :placeholder="placeholder"
    :disabled="!availableVariablesLoaded || noOptionsPresent"
    compact
    @update:model-value="selectValue"
  />
</template>
