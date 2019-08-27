<script>
import Prism from 'vue-prism-component';

export default {
    components: {
        Prism
    },
    props: {
        summary: {
            type: String,
            default: 'Code example'
        },
        language: {
            type: String,
            default: 'html'
        }
    }
};
</script>

<template>
  <details>
    <summary>{{ summary }}</summary>
    <Prism :language="language"><slot /></Prism>
  </details>
</template>

<style lang="postcss" scoped>
details {
  margin-bottom: 0.5em;
}

summary {
  outline: none !important;
  font-weight: 500;
  cursor: pointer;
}
</style>
