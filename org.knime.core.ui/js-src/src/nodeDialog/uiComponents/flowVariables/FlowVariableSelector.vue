<script setup lang="ts">
import Dropdown from "webapps-common/ui/components/forms/Dropdown.vue";
import type FlowVariableSelectorProps from "./types/FlowVariableSelectorProps";
import { computed, onMounted, ref, type Ref } from "vue";
import type { PossibleFlowVariable } from "@/nodeDialog/api/types";
import { setControllingFlowVariable } from "@/nodeDialog/api/flowVariables";

import inject from "@/nodeDialog/utils/inject";

const {
  getAvailableFlowVariables,
  getFlowVariableOverrideValue,
  unsetControllingFlowVariable,
} = inject("flowVariablesApi")!;

const props = defineProps<FlowVariableSelectorProps>();

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

const selectedValue = computed(
  () => props.flowSettings?.controllingFlowVariableName ?? "",
);

const emit = defineEmits(["controllingFlowVariableSet"]);

const selectValue = async (selectedId: string | number) => {
  if (selectedId === noFlowVariableOption.id) {
    unsetControllingFlowVariable(props.persistPath);
    return;
  }
  const flowVar = nameToFlowVariable.value[selectedId];
  setControllingFlowVariable(props.flowVariablesMap, {
    path: props.persistPath,
    flowVariableName: flowVar.name,
  });
  const value = await getFlowVariableOverrideValue(
    props.persistPath,
    props.dataPath,
  );
  if (typeof value !== "undefined") {
    emit("controllingFlowVariableSet", value);
  }
};

const ariaLabel = computed(
  () => `controlling-flow-variables-${props.persistPath}`,
);
const noOptionsPresent = computed(
  () =>
    Boolean(dropdownPossibleValues.value.length === 1) && !selectedValue.value,
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
    :model-value="availableVariablesLoaded ? selectedValue : ''"
    :placeholder="placeholder"
    :disabled="!availableVariablesLoaded || noOptionsPresent"
    @update:model-value="selectValue"
  />
</template>
