<script>
import { Label } from "@knime/components";
import { DateTimeInput } from "@knime/components/date-time-input";

import CodeExample from "./demo/CodeExample.vue";
// import code from "webapps-common/ui/components/forms/DateTimeInput.vue?raw";
const code = "";

const codeExample = `<DateTimeInput
  :value="new Date()"
  :showTime=false
  :showSeconds=false
  :showMilliseconds=false
  :max="Tue Nov 10 2020 12:18:30 GMT+0100 (Central European Standard Time)"
  :min="Thu Nov 05 2020 12:19:24 GMT+0100 (Central European Standard Time)"
/>`;

export default {
  components: {
    DateTimeInput,
    Label,
    CodeExample,
  },
  data() {
    return {
      codeExample,
      dateDefault: new Date(),
      dateOnlyDate: new Date(),
      dateMilliseconds: new Date(),
      dateBounds: new Date(),
      dateTwoLines: new Date(),
      dateWithTimezone: new Date(),
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
  <div>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <p>
            DateTime component shows input field with a button and a popover
            calendar to choose the date. Time is represented with multiple
            TimePartInputs for hour, minute etc which can be toggled via the
            corresponding
            <code>show{**Unit**}</code> properties. It acts as a form element,
            so it emits <code>input</code> events, and it has a
            <code>value</code>. It also has <code>min</code> &
            <code>max</code> properties to set bounds to the date. It detects
            the timezone based on the browser value, but the timezone can also
            be set separately with the <code>timezone</code> property.
          </p>
          <p>
            It uses the DatePicker from v-calendar. See: https://vcalendar.io/
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6 inputs">
          <Label text="Default" large>
            <DateTimeInput v-model="dateDefault" />
          </Label>
          <Label text="Show only Date" large>
            <DateTimeInput
              v-model="dateOnlyDate"
              :show-time="false"
              :show-seconds="false"
              :show-milliseconds="false"
            />
          </Label>
          <Label text="Show Milliseconds" large>
            <DateTimeInput
              v-model="dateMilliseconds"
              :show-seconds="true"
              :show-milliseconds="true"
            />
          </Label>
          <Label text="Show Timezone" large>
            <DateTimeInput v-model="dateWithTimezone" :show-timezone="true" />
          </Label>
          <Label text="With bounds on date" large>
            <DateTimeInput
              v-model="dateBounds"
              :show-seconds="false"
              :show-milliseconds="false"
              :min="new Date(new Date().setDate(new Date().getDate() - 6))"
              :max="new Date()"
            />
          </Label>
          <Label text="Two lines" large>
            <DateTimeInput
              v-model="dateTwoLines"
              two-lines
              :show-seconds="true"
            />
          </Label>
          <Label text="With disabled state" large>
            <DateTimeInput
              v-model="dateDefault"
              :show-seconds="true"
              :show-milliseconds="true"
              disabled
            />
          </Label>
          <Label text="With compact mode">
            <DateTimeInput
              v-model="dateDefault"
              :show-seconds="true"
              :show-milliseconds="true"
              compact
            />
          </Label>
        </div>
        <div class="grid-item-4">
          <p>Default (and disabled): {{ dateDefault }}</p>
          <p>Date only: {{ dateOnlyDate }}</p>
          <p>Date with milliseconds: {{ dateMilliseconds }}</p>
          <p>Date with timezone: {{ dateWithTimezone }}</p>
          <p>Date with bounds: {{ dateBounds }}</p>
          <p>Date on two lines: {{ dateTwoLines }}</p>
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{
            codeExample
          }}</CodeExample>
          <CodeExample summary="Show TimeInputPart.vue source code">{{
            code
          }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="postcss" scoped>
.inputs :deep(label) {
  margin-bottom: 0;
  margin-top: 15px;
}

:deep(.label-text.big) {
  margin-bottom: 0;
}
</style>
