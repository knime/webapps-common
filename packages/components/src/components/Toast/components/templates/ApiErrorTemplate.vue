<script setup lang="ts">
import { computed, ref } from "vue";
import { useClipboard } from "@vueuse/core";

import { Button } from "@knime/components";
import CheckIcon from "@knime/styles/img/icons/check.svg";
import CopyIcon from "@knime/styles/img/icons/copy.svg";

// see https://www.rfc-editor.org/rfc/rfc9457 for api error specification
interface ApiErrorTemplateProps {
  headline: string; // toast headline, will not be displayed here but needed when copying to clipboard
  title: string;
  details?: string[];
  status: number;
  date: Date;
  requestId: string;
  errorId?: string;
}

const props = defineProps<ApiErrorTemplateProps>();
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
  let errorText = `${props.headline}\n\n`;
  errorText += `${props.title}\n\n`;
  errorText += details ? `Details: ${details}\n\n` : "";

  errorText += `Status: ${props.status}\n`;
  errorText += `Date: ${formattedDate.value}\n`;
  errorText += `Request Id: ${props.requestId}\n`;
  errorText += props.errorId ? `Error Id: ${props.errorId}\n` : "";

  return errorText;
});

const copyToClipboard = () => {
  copy(errorForClipboard.value);
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
    <button v-if="!showDetails" class="show-more" @click="onShowDetailsClicked">
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
      <div><strong>Status: </strong>{{ status }}</div>
      <div><strong>Date: </strong>{{ formattedDate }}</div>
      <div><strong>Request id: </strong>{{ requestId }}</div>
      <div v-if="errorId"><strong>Error id: </strong>{{ errorId }}</div>
      <div class="copy-button-wrapper">
        <Button @click="copyToClipboard">
          <template v-if="copied"
            ><CheckIcon class="copy-icon" />Error was copied</template
          >
          <template v-else
            ><CopyIcon class="copy-icon" />Copy error to clipboard
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
  cursor: pointer;
  font-weight: 500;
  white-space: nowrap;

  &:active,
  &:hover {
    text-decoration: underline;
  }
}

.copy-button-wrapper {
  & .button {
    font-size: 13px;
    padding: 0;
    margin-top: 10px;
  }
}

.copy-icon {
  &svg {
    width: 12px;
  }
}
</style>
