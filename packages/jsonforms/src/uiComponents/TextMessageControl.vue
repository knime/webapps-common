<script setup lang="ts">
import { InlineMessage, type InlineMessageVariant } from "@knime/components";

import type { VueControlProps } from "../higherOrderComponents/control/types";

import useProvidedState from "./composables/useProvidedState";

interface Message {
  title: string;
  description: string;
  type: string;
}

const props = defineProps<VueControlProps<undefined>>();
const message = useProvidedState<Message | undefined | null>(
  props.control.uischema.options?.messageProvider,
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
