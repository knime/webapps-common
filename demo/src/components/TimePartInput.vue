<script>
import CodeExample from "./demo/CodeExample.vue";
import { TimePartInput, Label } from "@knime/components";
// import code from "webapps-common/ui/components/forms/TimePartInput.vue?raw";
const code = "";

const codeExample = `<Label text="Hours">
  <TimePartInput
    type="integer"
    :min="0"
    :max="23"
    :min-digits="2"
    :value="hours"
    @bounds="hoursBound"
  />
</Label>`;

export default {
  components: {
    TimePartInput,
    CodeExample,
    Label,
  },
  data() {
    return {
      codeExample,
      hours: 18,
      minutes: 53,
      seconds: 22,
      milliseconds: 320,
    };
  },
  computed: {
    code() {
      return code;
    },
  },
  methods: {
    hoursBound() {
      this.hours = 0;
    },
    minutesBound() {
      this.minutes = 0;
    },
    secondsBound() {
      this.seconds = 0;
    },
    millisecondsBound() {
      this.milliseconds = 0;
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
            A number input field similar to the NumberInput component but for
            time units like hours, minutes, seconds and milliseconds. It acts as
            a form element, so it emits <code>input</code> events and it has a
            <code>value</code>. It also has <code>min</code> &
            <code>max</code> property to set bounds and a
            <code>bounds</code> event to determine what should happen if a bound
            is reached.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6 inputs">
          <Label text="Hours" large>
            <TimePartInput
              v-model="hours"
              type="integer"
              :min="0"
              :max="23"
              :min-digits="2"
              @bounds="hoursBound"
            />
          </Label>
          <Label text="Minutes" large>
            <TimePartInput
              v-model="minutes"
              type="integer"
              :min="0"
              :max="59"
              :min-digits="2"
              @bounds="minutesBound"
            />
          </Label>
          <Label text="Seconds" large>
            <TimePartInput
              v-model="seconds"
              type="integer"
              :min="0"
              :max="59"
              :min-digits="2"
              @bounds="secondsBound"
            />
          </Label>
          <Label text="Milliseconds" large>
            <TimePartInput
              v-model="milliseconds"
              type="integer"
              :min="0"
              :max="999"
              :min-digits="3"
              @bounds="millisecondsBound"
            />
          </Label>
          <Label text="Disabled" large>
            <TimePartInput
              v-model="milliseconds"
              disabled
              type="integer"
              :min-digits="3"
            />
          </Label>
          <Label text="Compact">
            <TimePartInput
              v-model="milliseconds"
              compact
              type="integer"
              :min-digits="3"
            />
          </Label>
        </div>
        <div class="grid-item-4">
          Time: {{ hours }}h : {{ minutes }}m : {{ seconds }}s :
          {{ milliseconds }}ms
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
  margin-top: 15px;
}
</style>
