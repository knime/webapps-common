<script>
import { IntervalInput, Label } from "@knime/components";

import CodeExample from "./demo/CodeExample.vue";
// import code from "webapps-common/ui/components/forms/IntervalInput.vue?raw";
const code = "";

const codeExample = `<IntervalInput
  v-model="somePartialIsoDuration"
  format="DATE"
/>`;

export default {
  components: {
    IntervalInput,
    Label,
    CodeExample,
  },
  data() {
    return {
      codeExample,
      intervalDate: "P1Y2M3W4D",
      intervalDateTime: "P1Y2M3W4D",
      intervalPeriod: "PT5H6M7.089S",
      positiveIntervalDateTime: "P1Y2M3W4D",
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
          <p>Component that can be used to input a time interval.</p>

          <p>
            It has a <code>format</code> prop which can be set to
            <code>DATE</code>, <code>TIME</code> or <code>DATE_OR_TIME</code>,
            which respectively permit only date inputs such as
            <code>P1Y2M3W4D</code>, time inputs such as
            <code>PT5H6M7.089S</code>, or allow the user to switch between them.
            We don't currently allow the user to input a mix of date and time
            values, because intermingling of fixed and variable-size units is
            hard to handle, and results in a lot of edge cases.
          </p>

          <p>
            There is a popover opened by the button to the right of the input
            field, which allows the user to put in a intervals of the accepted
            type, and, if the <code>format</code> prop is
            <code>DATE_OR_TIME</code>, to switch the accepted type between date
            and time.
          </p>

          <p>
            Alternatively, the user can type in the input field directly.
            Accepted formats are partial ISO 8601 intervals like those listed
            above, but also human readable intervals like <code>1y2m3w4d</code>,
            or <code>1 hour 2 mins 3 secs</code>. However, the
            <code>v-model</code> of the component will always be a valid partial
            ISO 8601 interval.
          </p>

          <p>
            Note that negative intervals can be specified in the input field,
            such as
            <code>-P1Y2M3W4D</code>, <code>-(1h 5m)</code>, or
            <code>-6 weeks</code>. The prop <code>allow-descending</code> can be
            set to <code>false</code> to prevent the user from entering negative
            intervals. The ascending/descending state of the interval can also
            be toggled by the user in the popover.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6">
          <Label text="Show only Date" large>
            <IntervalInput v-model="intervalDate" format="DATE" />
          </Label>
          <Label text="Show only Time" large>
            <IntervalInput v-model="intervalPeriod" format="TIME" />
          </Label>
          <Label text="Show Date or Time" large>
            <IntervalInput v-model="intervalDateTime" format="DATE_OR_TIME" />
          </Label>
          <Label text="Compact mode" large>
            <IntervalInput
              v-model="intervalDateTime"
              format="DATE_OR_TIME"
              compact
            />
          </Label>
          <Label text="Disabled" large>
            <IntervalInput
              v-model="intervalDateTime"
              format="DATE_OR_TIME"
              disabled
            />
          </Label>
          <Label text="Only positive intervals allowed" large>
            <IntervalInput
              v-model="positiveIntervalDateTime"
              :allow-descending="false"
              format="DATE_OR_TIME"
            />
          </Label>
        </div>
        <div class="grid-item-6">
          <p>Date only: {{ intervalDate }}</p>
          <p>Time only: {{ intervalPeriod }}</p>
          <p>Date or Time: {{ intervalDateTime }}</p>
          <p>Positive Date or Time: {{ positiveIntervalDateTime }}</p>
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{
            codeExample
          }}</CodeExample>
          <CodeExample summary="Show IntervalInput.vue source code">{{
            code
          }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="postcss">
:deep(.label-wrapper):not(:first-child) {
  margin-top: 1em;
}
</style>
