<script lang="ts">
type CaseMatching = "CASESENSITIVE" | "CASEINSENSITIVE";

interface StringValue {
  value: string;
  cellClassName: "org.knime.core.data.def.StringCell";
  modifiersClassName: "org.knime.core.webui.node.dialog.defaultdialog.widget.dynamic.DynamicValuesInput$DynamicValue$StringValueModifiers";
  modifiers: { caseMatching: CaseMatching };
}

interface IntValue {
  value: number;
  cellClassName: "org.knime.core.data.def.IntCell";
  modifiersClassName: undefined;
}

interface DoubleValue {
  value: number;
  cellClassName: "org.knime.core.data.def.DoubleCell";
  modifiersClassName: undefined;
}

interface BooleanValue {
  value: boolean;
  cellClassName: "org.knime.core.data.def.BooleanCell";
  modifiersClassName: undefined;
}

export type DynamicValueType =
  | StringValue
  | DoubleValue
  | IntValue
  | BooleanValue
  | { value: unknown; cellClassName: string; modifiersClassName: undefined };
</script>

<script setup lang="ts">
import { computed } from "vue";

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

const modifiersDef = computed(() => {
  if (
    props.value.modifiersClassName ===
    "org.knime.core.webui.node.dialog.defaultdialog.widget.dynamic.DynamicValuesInput$DynamicValue$StringValueModifiers"
  ) {
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
          scope: "#/properties/modifiers/properties/caseMatching",
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
</script>

<template>
  <slot
    :schema="{
      type: 'object',
      properties: {
        value: valueSchema,
        ...(modifiersDef === null
          ? {}
          : {
              modifiers: {
                type: 'object',
                properties: modifiersDef.schemaProperties,
              },
            }),
      },
    }"
    :uischema="
      modifiersDef === null
        ? valueUiSchema
        : {
            type: 'VerticalLayout',
            elements: [...modifiersDef.uischemaElements, valueUiSchema],
          }
    "
    :initial-value="initialValue"
  />
</template>
