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

interface BooleanValue {
  value: boolean;
  cellClassName: "org.knime.core.data.def.BooleanCell";
}

export type DynamicValue =
  | StringValue
  | DoubleValue
  | IntValue
  | BooleanValue
  | { value: unknown; cellClassName: string };
</script>

<script setup lang="ts">
defineProps<{ value: DynamicValue }>();
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
    I am an int
    <slot
      :schema="{
        type: 'object',
        properties: {
          value: {
            type: 'integer',
            format: 'int32',
          },
        },
      }"
      :uischema="{
        type: 'Control',
        scope: `#/properties/value`,
      }"
    />
  </div>
  <div
    v-else-if="value.cellClassName === 'org.knime.core.data.def.BooleanCell'"
  >
    I am a boolean
    <slot
      :schema="{
        type: 'object',
        properties: {
          value: {
            type: 'boolean',
          },
        },
      }"
      :uischema="{
        type: 'Control',
        scope: `#/properties/value`,
      }"
    />
  </div>
  <div v-else>
    cell class: {{ value.cellClassName }} not supported -> use text input
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
</template>
