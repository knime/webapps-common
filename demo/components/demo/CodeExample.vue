<script>
export default {
    props: {
        summary: {
            type: String,
            default: 'Code example'
        }
    }
};
</script>

<template>
  <details>
    <summary>{{ summary }}</summary>
    <pre><code><slot /></code></pre>
  </details>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

summary {
  outline: none !important;
  font-weight: 500;
  cursor: pointer;
}
</style>
