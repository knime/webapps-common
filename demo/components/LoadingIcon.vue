<script>
import CodeExample from './demo/CodeExample.vue';
import LoadingIcon from '../../ui/components/LoadingIcon.vue';
import code from '!!raw-loader!../../ui/components/loadingIcon';

const codeExample = `
<script>
import LoadingIcon from '../../ui/components/LoadingIcon.vue';

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
`
export default {
    components: {
        LoadingIcon,
        CodeExample
    },
    data() {
        return {
            code,
            codeExample
        };
    }
};
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <h2>LoadingIcon</h2>
        <p>Animated loading icon</p>
        <LoadingIcon class="loading-icon" />
        <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
        <CodeExample summary="Show LoadingIcon.vue source code">{{ code }}</CodeExample>
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
