<script lang="ts">
import {
  DateTimeFormatInput,
  type FormatWithExample,
  Label,
} from "@knime/components";

import CodeExample from "./demo/CodeExample.vue";

const code = "";

const codeExample = `<DateTimeFormatInput :all-default-formats="[
  {
    format: 'yyyy-MM-dd',
    example: '2021-12-31',
    temporalType: 'DATE',
    category: 'STANDARD',
  },
  {
    format: 'dd.MM.yyyy',
    example: '31.12.2021',
    temporalType: 'DATE',
    category: 'EUROPEAN',
  },
  {
    format: 'HH:mm:ss',
    example: '23:59:59',
    temporalType: 'TIME',
    category: 'STANDARD',
  }
]" :allowed-types="['DATE', 'TIME']" />`;

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
    Label,
    CodeExample,
  },
  data() {
    return {
      exampleFormats,
      codeExample,
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
        <p>
          Component for input of a date-time format, including a free text-field
          for the user to type in their own format, as well as a popup that
          displays recent and standard formats.
        </p>
      </div>
    </div>

    <div class="grid-container">
      <div class="grid-item-6">
        <Label text="Normal usage" large>
          <DateTimeFormatInput :all-default-formats="exampleFormats" />
        </Label>
        <Label text="Only allow certain types" large>
          <DateTimeFormatInput
            :all-default-formats="exampleFormats"
            :allowed-types="['DATE', 'TIME']"
          />
        </Label>
        <Label text="Compact mode" large>
          <DateTimeFormatInput :all-default-formats="exampleFormats" compact />
        </Label>
        <Label text="Disabled" large>
          <DateTimeFormatInput :all-default-formats="exampleFormats" disabled />
        </Label>
        <Label text="Invalid" large>
          <DateTimeFormatInput
            :all-default-formats="exampleFormats"
            :is-valid="false"
          />
        </Label>
      </div>
    </div>
  </section>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <CodeExample summary="Show usage example">{{
          codeExample
        }}</CodeExample>
        <CodeExample summary="Show DateTimeFormatInput.vue source code">{{
          code
        }}</CodeExample>
      </div>
    </div>
  </section>
</template>

<style scoped lang="postcss">
:deep(.label-wrapper):not(:first-child) {
  margin-top: 1em;
}
</style>
