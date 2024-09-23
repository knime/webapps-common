<script setup lang="ts">
import { rendererProps } from "@jsonforms/vue";
import useProvidedState from "../composables/components/useProvidedState";
import { InlineMessage } from "@knime/components";
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
    :type="message.type.toLowerCase() as any"
    :title="message.title"
    :description="message.description"
  />
</template>
