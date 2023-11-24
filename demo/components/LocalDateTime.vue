<script>
import LocalDateTime from '../../ui/components/LocalDateTime.vue';
import CodeExample from './demo/CodeExample.vue';
import code from '!!raw-loader!../../ui/components/LocalDateTime';

const codeExample = `<LocalDateTime date="2023-10-27T11:17:42.460Z" :show-time="true"/>`;

export default {
    components: {
        LocalDateTime,
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
          <h2>LocalDateTime</h2>

          <h5>UTC date format</h5>
          <p>Original Date: 2023-10-27T11:17:42.460Z </p>
          <p>Converted to local time: <LocalDateTime date="2023-10-27T11:17:42.460Z" /></p>

          <h5>Timezone date format</h5>
          <p>Original Date: 2023-01-23T09:15:28+00:00 </p>
          <p>Converted to local time: <LocalDateTime date="2023-01-23T09:15:28+00:00" /></p>
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
          <CodeExample summary="Show LocalDateTime.vue source code">{{ code }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="postcss" scoped>
</style>
