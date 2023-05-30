<script setup lang="ts">
defineProps<{
    url: string
}>();

</script>

<template>
  <img
    loading="lazy"
    :src="url"
    alt=""
  >
</template>
