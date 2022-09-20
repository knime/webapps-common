<script>

import CodeExample from './demo/CodeExample.vue';
import DonutChart from '../../ui/components/DonutChart.vue';
import code from '!!raw-loader!../../ui/components/DonutChart';

const codeExample = `<DonutChart
  :value="3"
  :max-value="5"
  display-values
  additional-label="some metric"
  :inner-radius="70"
  :radius="100"
/>`;

export default {
    components: {
        DonutChart,
        CodeExample
    },
    data() {
        return {
            codeExample
        };
    },
    computed: {
        code() {
            return code;
        }
    }
};

</script>

<template>
  <div>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <h2>Donut Chart</h2>
          <p>
            Displays a donut chart.

            It can display the current and max value as well as display an additional label.
          </p>
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12 demo">
          <DonutChart
            :value="1"
            :max-value="6"
            :inner-radius="70"
            :radius="100"
          />
          <DonutChart
            :value="2"
            :max-value="6"
            :inner-radius="70"
            :radius="100"
            display-values
          />
          <DonutChart
            :value="3"
            :max-value="5"
            display-values
            additional-label="some metric"
            :inner-radius="70"
            :radius="100"
          />
          <DonutChart
            :value="8"
            :max-value="5"
            display-values
            additional-label="some metric"
            :inner-radius="70"
            :radius="100"
            accept-values-larger-than-max
          />
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
          <CodeExample summary="Show DonutChart.vue source code">{{ code }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>


<style lang="postcss" scoped>
.demo {
  display: flex;
  gap: 30px;
  justify-content: center;
}
</style>
