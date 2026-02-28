<script setup lang="ts">
import { ref } from "vue";
import { useClipboard } from "@vueuse/core";

import { Button } from "@knime/components";
import CheckIcon from "@knime/styles/img/icons/check.svg";
import CopyIcon from "@knime/styles/img/icons/copy.svg";
import { formatDateTimeString } from "@knime/utils";

import { serializeErrorForClipboard as defaultSerializeRFCErrorData } from "./serializeRFCErrorData";
import type { RFCErrorData } from "./types";

type Props = {
  headline: string; // toast headline, will not be displayed here but needed when copying to clipboard
  canCopyToClipboard?: boolean;
  serializeErrorForClipboard?: (
    error: RFCErrorData,
    headline: string,
    formatDate: (date: Date) => string,
  ) => string;
} & RFCErrorData;

const props = withDefaults(defineProps<Props>(), {
  status: undefined,
  date: undefined,
  details: () => [],
  requestId: undefined,
  errorId: undefined,
  canCopyToClipboard: true,
  serializeErrorForClipboard: defaultSerializeRFCErrorData,
});
const emits = defineEmits(["showMore"]);

const { copy, copied } = useClipboard({
  copiedDuring: 3000,
});

const showDetails = ref(false);

const formatDate = (date: Date): string =>
  date ? formatDateTimeString(date.getTime()) : "";

const copyToClipboard = () => {
  copy(
    props.serializeErrorForClipboard(props, props.headline, formatDate),
  ).catch((error) => {
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
      <div v-if="date"><strong>Date: </strong>{{ formatDate(date) }}</div>
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
