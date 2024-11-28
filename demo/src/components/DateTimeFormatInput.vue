<script lang="ts">
import { DateTimeFormatInput } from "@knime/components";
import type { FormatWithExample } from "@knime/components";

import CodeExample from "./demo/CodeExample.vue";

const code = "";

const exampleFormats: FormatWithExample[] = [
  // STANDARD types
  {
    temporalType: "DATE",
    category: "STANDARD",
    format: "yyyy-MM-dd",
    example: "2021-12-31",
  },
  {
    temporalType: "DATE",
    category: "STANDARD",
    format: "dd.MM.yyyy",
    example: "31.12.2021",
  },
  {
    temporalType: "DATE",
    category: "STANDARD",
    format: "dd/MM/yyyy",
    example: "31/12/2021",
  },
  {
    temporalType: "DATE",
    category: "STANDARD",
    format: "dd-MM-yyyy",
    example: "31-12-2021",
  },
  {
    temporalType: "DATE",
    category: "STANDARD",
    format: "dd MMM yyyy",
    example: "31 Dec 2021",
  },
  {
    temporalType: "TIME",
    category: "STANDARD",
    format: "HH:mm:ss",
    example: "23:59:59",
  },
  {
    temporalType: "DATE_TIME",
    category: "STANDARD",
    format: "yyyy-MM-dd HH:mm:ss",
    example: "2021-12-31 23:59:59",
  },
  {
    temporalType: "ZONED_DATE_TIME",
    category: "STANDARD",
    format:
      "yyyy-MM-dd HH:mm:ss z ' - long lines to show the wrapping of the popover'",
    example:
      "2021-12-31 23:59:59 UTC - long lines to show the wrapping of the popover",
  },
  // EUROPEAN types - one of each temporalType
  {
    temporalType: "DATE",
    category: "EUROPEAN",
    format: "dd.MM.yyyy",
    example: "31.12.2021",
  },
  {
    temporalType: "TIME",
    category: "EUROPEAN",
    format: "HH:mm:ss",
    example: "23:59:59",
  },
  {
    temporalType: "DATE_TIME",
    category: "EUROPEAN",
    format: "dd.MM.yyyy HH:mm:ss",
    example: "31.12.2021 23:59:59",
  },
  {
    temporalType: "ZONED_DATE_TIME",
    category: "EUROPEAN",
    format: "dd.MM.yyyy HH:mm:ss z",
    example: "31.12.2021 23:59:59 UTC",
  },
  // AMERICAN types - one of each temporalType
  {
    temporalType: "DATE",
    category: "AMERICAN",
    format: "MM/dd/yyyy",
    example: "12/31/2021",
  },
  {
    temporalType: "TIME",
    category: "AMERICAN",
    format: "hh:mm:ss a",
    example: "11:59:59 PM",
  },
  {
    temporalType: "DATE_TIME",
    category: "AMERICAN",
    format: "MM/dd/yyyy hh:mm:ss a",
    example: "12/31/2021 11:59:59 PM",
  },
  {
    temporalType: "ZONED_DATE_TIME",
    category: "AMERICAN",
    format: "MM/dd/yyyy hh:mm:ss a z",
    example: "12/31/2021 11:59:59 PM UTC",
  },
  // RECENT types - but we don't have any for DATE_TIME so we can show that
  {
    temporalType: "DATE",
    category: "RECENT",
    format: "yyyy",
    example: "2021",
  },
  {
    temporalType: "TIME",
    category: "RECENT",
    format: "HH",
    example: "23",
  },
  {
    temporalType: "ZONED_DATE_TIME",
    category: "RECENT",
    format: "z",
    example: "UTC",
  },
];

export default {
  components: {
    DateTimeFormatInput,
    CodeExample,
  },
  data() {
    return {
      codeExample: "TODO",
      exampleFormats,
    };
  },
  computed: {
    code() {
      return code;
    },
  },
};
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <div class="grid-container demo">
          <DateTimeFormatInput :all-default-formats="exampleFormats" />
        </div>
        <CodeExample summary="Show usage example with icon">{{
          codeExample
        }}</CodeExample>
        <CodeExample summary="Show Collapser.vue source code">{{
          code
        }}</CodeExample>
      </div>
    </div>
  </section>
</template>
