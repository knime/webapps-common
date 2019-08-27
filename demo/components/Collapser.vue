<script>
import CodeExample from './demo/CodeExample';
import Collapser from 'webapps-common/ui/components/Collapser.vue';
import BulbIcon from 'webapps-common/ui/assets/img/icons/bulb.svg?inline';
import code from '!!raw-loader!webapps-common/ui/components/Collapser.vue';

export default {
    components: {
        Collapser,
        BulbIcon,
        CodeExample
    },
    data() {
        return {
            codeExample: `<Collapser title="Collapser with icon">
  <template v-slot:icon>
    <BulbIcon />
  </template>
  <p>Lorem ipsum…</p>
</Collapser>`
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
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <h2>Collapser</h2>
        <div class="grid-container demo">
          <Collapser
            class="grid-item-3 collapser"
            title="Collapser"
          >
            <p>Lorem ipsum…</p>
          </Collapser>
          <Collapser
            class="grid-item-3 collapser"
            title="Collapser with icon"
          >
            <template v-slot:icon>
              <BulbIcon style="width: 20px; height: 20px;" />
            </template>
            <p>Lorem ipsum…</p>
          </Collapser>
          <Collapser
            class="grid-item-3 collapser"
            title="Compact collapser"
            compact
          >
            <p>Lorem ipsum…</p>
          </Collapser>
        </div>
        <CodeExample summary="Show usage example with icon">{{ codeExample }}</CodeExample>
        <CodeExample summary="Show Collapser.vue source code">{{ code }}</CodeExample>
      </div>
    </div>
  </section>
</template>


<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

.demo {
  margin-bottom: 10px;
  align-items: flex-start;
}

.collapser {
  background-color: var(--knime-porcelain);

  & .panel {
    margin: 0;
    padding: 0 30px 10px 60px;
  }

  &.with-section {
    padding-top: 0;
  }
}

</style>
