<script lang="ts">
export default {
  props: {
    caption: {
      type: String,
      default: "",
    },
    id: {
      type: String,
      default: null,
    },
  },
};
</script>

<template>
  <figure v-if="caption" :id="id" class="image-view-figure">
    <slot />
    <figcaption>{{ caption }}</figcaption>
  </figure>
  <slot v-else />
</template>

<style scoped>
.image-view-figure {
  margin: 0;
}
</style>
