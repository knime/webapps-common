<script>
import { Collapser } from "@knime/components";
import BulbIcon from "@knime/styles/img/icons/bulb.svg";

import CodeExample from "./demo/CodeExample.vue";
// import code from "webapps-common/ui/components/Collapser.vue?raw";
const code = "";

export default {
  components: {
    Collapser,
    BulbIcon,
    CodeExample,
  },
  data() {
    return {
      codeExample: `<Collapser title="Collapser with icon">
  <template v-slot:title>
    <BulbIcon style="width: 20px; height: 20px;" />
    <h5>Collapser with icon</h5> /* Has to be h5 */
  </template>
  <p>Lorem ipsum…</p>
</Collapser>`,
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
          <Collapser class="grid-item-3 collapser">
            <template #title>
              <h5>Collapser</h5>
            </template>
            <p>Lorem ipsum…</p>
          </Collapser>
          <Collapser class="grid-item-3 collapser">
            <template #title>
              <BulbIcon style="width: 20px; height: 20px" />
              <h5>Collapser with icon</h5>
            </template>
            <p>Lorem ipsum…</p>
          </Collapser>
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

<style lang="postcss" scoped>
.demo {
  margin-bottom: 10px;
  align-items: flex-start;
}

.collapser {
  background-color: var(--knime-porcelain);

  & :deep(h5) {
    padding: 15px 30px;
    margin: 0;
    position: relative;
  }

  & :deep(.panel) {
    padding: 0 30px;
  }
}
</style>
