<script>
import { LoadingIcon } from "@knime/components";

import CodeExample from "./demo/CodeExample.vue";
// import code from "webapps-common/ui/components/LoadingIcon.vue?raw";
const code = "";

const codeExample = `
<script>
import LoadingIcon from '~/webapps-common/ui/components/LoadingIcon.vue';

export default {
    components: {
        LoadingIcon
    }
};
<\/script>

<template>
  <LoadingIcon class="loading-icon" />
</template>

<style lang="postcss" scoped>
  .loading-icon {
    width: 24px;
    height: 24px;
    stroke-width: calc(32px / 24);
    margin: auto;
    stroke: var(--knime-masala);
  }
</style>
`;
export default {
  components: {
    LoadingIcon,
    CodeExample,
  },
  data() {
    return {
      code,
      codeExample,
    };
  },
};
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <p>Animated loading icon</p>
        <LoadingIcon class="loading-icon" />
        <CodeExample summary="Show usage example">{{
          codeExample
        }}</CodeExample>
        <CodeExample summary="Show LoadingIcon.vue source code">{{
          code
        }}</CodeExample>
      </div>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
.loading-icon {
  width: 24px;
  height: 24px;
  stroke-width: calc(32px / 24);
  margin: auto;
  stroke: var(--knime-masala);
}
</style>
