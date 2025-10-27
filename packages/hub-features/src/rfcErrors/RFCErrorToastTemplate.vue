<script setup lang="ts">
import { computed, ref } from "vue";
import { useClipboard } from "@vueuse/core";

import { Button } from "@knime/components";
import CheckIcon from "@knime/styles/img/icons/check.svg";
import CopyIcon from "@knime/styles/img/icons/copy.svg";

import type { RFCErrorData } from "./types";

type Props = {
  headline: string; // toast headline, will not be displayed here but needed when copying to clipboard
  canCopyToClipboard?: boolean;
} & RFCErrorData;

const props = withDefaults(defineProps<Props>(), {
  status: undefined,
  date: undefined,
  details: () => [],
  requestId: undefined,
  errorId: undefined,
  canCopyToClipboard: true,
});
const emits = defineEmits(["showMore"]);

const { copy, copied } = useClipboard({
  copiedDuring: 3000,
});

const showDetails = ref(false);

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

  let errorText = `${props.headline}\n\n`;
  errorText += `${props.title}\n\n`;
  errorText += details ? `Details: ${details}\n\n` : "";

  if (props.status !== undefined) {
    errorText += `Status: ${props.status}\n`;
  }

  if (props.date) {
    errorText += `Date: ${formattedDate.value}\n`;
  }

  if (props.requestId) {
    errorText += `Request Id: ${props.requestId}\n`;
  }

  if (props.errorId) {
    errorText += `Error Id: ${props.errorId}\n`;
  }

  if (props.stacktrace) {
    errorText += "------\n"; // separator
    errorText += `Stacktrace:\n\n${props.stacktrace}\n`;
  }

  return errorText;
});

const copyToClipboard = () => {
  copy(errorForClipboard.value).catch((error) => {
    consola.error("Failed to copy to clipboard", { error });
  });
};

const onShowDetailsClicked = () => {
  showDetails.value = true;
  emits("showMore");
};
</script>

<template>
  <div class="wrapper">
    <div class="title">
      {{ props.title }}
    </div>
    <button
      v-if="!showDetails"
      data-test-id="show-details"
      class="show-more"
      @click="onShowDetailsClicked"
    >
      Show details
    </button>
    <div v-if="showDetails" class="additional-info">
      <div v-if="props.details?.length" class="details">
        <strong>Details: </strong>
        <template v-if="props.details.length == 1">
          {{ props.details[0] }}
        </template>
        <template v-else>
          <ul class="details-list">
            <li v-for="(item, index) in details" :key="index">{{ item }}</li>
          </ul>
        </template>
      </div>

      <div v-if="status !== undefined">
        <strong>Status: </strong>{{ status }}
      </div>
      <div v-if="date"><strong>Date: </strong>{{ formattedDate }}</div>
      <div v-if="requestId"><strong>Request id: </strong>{{ requestId }}</div>
      <div v-if="errorId"><strong>Error id: </strong>{{ errorId }}</div>
      <div v-if="stacktrace && canCopyToClipboard">
        <strong>Stacktrace: </strong>Part of clipboard text
      </div>
      <div v-if="canCopyToClipboard" class="copy-button-wrapper">
        <Button data-test-id="copy-to-clipboard" @click="copyToClipboard">
          <template v-if="copied">
            <CheckIcon class="copy-icon" />Error was copied
          </template>
          <template v-else>
            <CopyIcon class="copy-icon" />Copy error to clipboard
          </template>
        </Button>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.details {
  margin: 12px 0;

  & .details-list {
    padding-left: 25px;
    margin-top: 6px;
    margin-bottom: 6px;
  }
}

.show-more {
  all: unset;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;

  &:active,
  &:hover {
    text-decoration: underline;
  }
}

.copy-button-wrapper {
  & .button {
    padding: 0;
    margin-top: 10px;
    font-size: 13px;
  }
}

svg.copy-icon {
  width: 12px;
}
</style>
