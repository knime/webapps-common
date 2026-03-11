<script setup lang="ts">
import { computed } from "vue";

import {
  KdsInlineMessage,
  type KdsInlineMessageVariant,
} from "@knime/kds-components";

import type { VueControlProps } from "../higherOrderComponents/control/types";

import useProvidedState, {
  type UiSchemaWithProvidedOptions,
} from "./composables/useProvidedState";

interface Message {
  title: string;
  description: string;
  type: string;
}

type TextMessageOptions = {
  message: Message;
};

const props = defineProps<VueControlProps<undefined>>();

const uischema = computed(
  () =>
    props.control.uischema as UiSchemaWithProvidedOptions<TextMessageOptions>,
);

const message = useProvidedState(uischema, "message");
</script>

<template>
  <KdsInlineMessage
    v-if="message"
    :variant="message.type.toLowerCase() as KdsInlineMessageVariant"
    :title="message.title"
    :description="message.description"
  />
</template>
