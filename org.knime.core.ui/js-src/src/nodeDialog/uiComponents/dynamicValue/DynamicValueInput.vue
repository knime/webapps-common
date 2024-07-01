<script lang="ts">
type CaseMatching = "CASESENSITIVE" | "CASEINSENSITIVE";

interface StringValue {
  value: string;
  cellClassName: "org.knime.core.data.def.StringCell";
  useStringCaseMatchingSettings: boolean;
  stringCaseMatching: { caseMatching: CaseMatching };
}

interface IntValue {
  value: number;
  cellClassName: "org.knime.core.data.def.IntCell";
  useStringCaseMatchingSettings: undefined;
}

interface DoubleValue {
  value: number;
  cellClassName: "org.knime.core.data.def.DoubleCell";
  useStringCaseMatchingSettings: undefined;
}

interface BooleanValue {
  value: boolean;
  cellClassName: "org.knime.core.data.def.BooleanCell";
  useStringCaseMatchingSettings: undefined;
}

export type DynamicValueType =
  | StringValue
  | DoubleValue
  | IntValue
  | BooleanValue
  | {
      value: unknown;
      cellClassName: string;
      useStringCaseMatchingSettings: undefined;
    };
</script>

<script setup lang="ts">
import { computed, watch } from "vue";

const props = defineProps<{ value: DynamicValueType }>();

const valueSchema = computed(() => {
  switch (props.value.cellClassName) {
    case "org.knime.core.data.def.DoubleCell":
      return {
        type: "number",
        format: "number",
      };
    case "org.knime.core.data.def.IntCell":
    case "org.knime.core.data.def.LongCell":
      return {
        type: "integer",
        format: "int32",
      };
    case "org.knime.core.data.def.BooleanCell":
      return {
        type: "boolean",
      };
    case "org.knime.core.data.def.StringCell":
    default:
      return { type: "string" };
  }
});

const valueUiSchema = {
  type: "Control",
  scope: "#/properties/value",
};

const initialValue = computed(() => {
  switch (props.value.cellClassName) {
    case "org.knime.core.data.def.DoubleCell":
    case "org.knime.core.data.def.IntCell":
    case "org.knime.core.data.def.LongCell":
      return 0;
    case "org.knime.core.data.def.BooleanCell":
      return true;
    case "org.knime.core.data.def.StringCell":
    default:
      return "";
  }
});

const stringCaseMatchingDef = computed(() => {
  if (props.value.useStringCaseMatchingSettings) {
    return {
      schemaProperties: {
        caseMatching: {
          oneOf: [
            {
              const: "CASESENSITIVE",
              title: "Case sensitive",
            },
            {
              const: "CASEINSENSITIVE",
              title: "Case insensitive",
            },
          ],
          title: "Case matching",
          description:
            "Whether RowIDs and strings should be matched case-sensitive or case-insensitive.",
        },
      },
      uischemaElements: [
        {
          scope: "#/properties/stringCaseMatching/properties/caseMatching",
          type: "Control",
          options: {
            format: "valueSwitch",
          },
        },
      ],
    };
  }
  return null;
});

const emit = defineEmits<{
  updateValue: [unknown];
}>();

watch(
  () => props.value,
  (newValue) => {
    if (newValue === null) {
      emit("updateValue", initialValue);
    }
  },
  { immediate: true },
);
</script>

<template>
  <slot
    :schema="{
      type: 'object',
      properties: {
        value: valueSchema,
        ...(stringCaseMatchingDef === null
          ? {}
          : {
              stringCaseMatching: {
                type: 'object',
                properties: stringCaseMatchingDef.schemaProperties,
              },
            }),
      },
    }"
    :uischema="
      stringCaseMatchingDef === null
        ? valueUiSchema
        : {
            type: 'VerticalLayout',
            elements: [
              ...stringCaseMatchingDef.uischemaElements,
              valueUiSchema,
            ],
          }
    "
  />
</template>
