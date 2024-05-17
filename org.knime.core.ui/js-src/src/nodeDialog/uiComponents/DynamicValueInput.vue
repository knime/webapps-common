<script lang="ts">
interface StringValue {
  value: string;
  cellClassName: "org.knime.core.data.def.StringCell";
}

interface IntValue {
  value: number;
  cellClassName: "org.knime.core.data.def.IntCell";
}

interface DoubleValue {
  value: number;
  cellClassName: "org.knime.core.data.def.DoubleCell";
}

export type DynamicValue =
  | StringValue
  | IntValue
  | DoubleValue
  | { value: unknown; cellClassName: string };
</script>

<script setup lang="ts">
defineProps<{ value: DynamicValue; parentScope: string }>();
</script>

<template>
  <div v-if="value.cellClassName === 'org.knime.core.data.def.StringCell'">
    I am a string
    <slot
      :schema="{
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
      }"
      :uischema="{
        type: 'Control',
        scope: `#/properties/value`,
      }"
    />
  </div>
  <div v-else-if="value.cellClassName === 'org.knime.core.data.def.DoubleCell'">
    I am a double
    <slot
      :schema="{
        type: 'object',
        properties: {
          value: {
            type: 'number',
            format: 'number',
          },
        },
      }"
      :uischema="{
        type: 'Control',
        scope: `#/properties/value`,
      }"
    />
  </div>
  <div v-else-if="value.cellClassName === 'org.knime.core.data.def.IntCell'">
    I am a int input
  </div>
  <div v-else>cell class: {{ value.cellClassName }}</div>
</template>
