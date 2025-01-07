<script setup lang="ts">
import { rendererProps } from "@jsonforms/vue";

import { InlineMessage, type InlineMessageVariant } from "@knime/components";

import useProvidedState from "../composables/components/useProvidedState";

interface Message {
  title: string;
  description: string;
  type: string;
}

const props = defineProps(rendererProps());
const message = useProvidedState<Message | undefined | null>(
  props.uischema.options?.messageProvider,
  null,
);
</script>

<template>
  <InlineMessage
    v-if="message"
    :variant="message.type.toLowerCase() as InlineMessageVariant"
    :title="message.title"
    :description="message.description"
  />
</template>
