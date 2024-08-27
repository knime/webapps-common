<script setup lang="ts">
import { Button } from "@knime/components";
import CopyIcon from "@knime/styles/img/icons/copy.svg";
import { useClipboard } from "@vueuse/core";
import { computed } from "vue";

// see https://www.rfc-editor.org/rfc/rfc9457 for api error specification
interface ApiErrorTemplateProps {
  title: string;
  details?: string[];
  status: number;
  date: Date;
  requestId: string;
  errorId?: string;
}

const props = defineProps<ApiErrorTemplateProps>();

const { copy, copied } = useClipboard({
  copiedDuring: 3000,
});

const dateFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hour12: true,
} as const;

const formattedDate = computed(() => {
  // eslint-disable-next-line no-undefined
  const formatter = new Intl.DateTimeFormat(undefined, dateFormatOptions); // use default locale
  return formatter.format(props.date);
});

const errorForClipboard = computed(() => {
  let details = "";
  if (props.details?.length) {
    if (props.details.length > 1) {
      const detailLines = props.details
        .map((item) => `\u2022 ${item}`)
        .join("\n");
      details = `\n${detailLines}`;
    } else {
      details = props.details[0];
    }
  }
  let errorText = `${props.title}\n\n`;
  errorText += details ? `Details: ${details}\n\n` : "";

  errorText += `Status: ${props.status}\n`;
  errorText += `Date: ${formattedDate.value}\n`;
  errorText += `Request Id: ${props.requestId}\n`;
  errorText += props.errorId ? `Error Id: ${props.errorId}\n` : "";

  return errorText;
});

const copyButtonText = computed(() => {
  return copied.value ? "Error was copied" : "Copy error to clipboard";
});

const copyToClipboard = () => {
  copy(errorForClipboard.value);
};
</script>

<template>
  <div class="wrapper">
    <div class="title">
      {{ props.title }}
    </div>
    <div v-if="props.details?.length" class="details">
      <strong>Details:</strong>
      <template v-if="props.details.length == 1">
        {{ props.details[0] }}
      </template>
      <template v-else>
        <ul>
          <li v-for="(item, index) in details" :key="index">{{ item }}</li>
        </ul>
      </template>
    </div>
    <div><strong>Status: </strong>{{ status }}</div>
    <div><strong>Date: </strong>{{ formattedDate }}</div>
    <div><strong>Request id: </strong>{{ requestId }}</div>
    <div v-if="errorId"><strong>Error id: </strong>{{ errorId }}</div>
    <div class="copy-button-wrapper">
      <Button @click="copyToClipboard"><CopyIcon />{{ copyButtonText }}</Button>
    </div>
  </div>
</template>

<style lang="postcss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.details {
  margin: 12px 0;
}

.copy-button-wrapper {
  & .button {
    font-size: 13px;
    padding: 0;

    & svg {
      margin-top: 2px;
      width: 12px;
    }
  }
}
</style>
