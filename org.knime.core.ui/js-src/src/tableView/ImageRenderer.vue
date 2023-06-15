<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    url: string,
    height?: number,
    width?: number
}>();

const src = computed(() => props.width && props.height
    ? `${props.url}?w=${Math.floor(props.width)}&h=${Math.floor(props.height)}`
    : props.url);

</script>

<template>
  <img
    loading="lazy"
    :src="src"
    alt=""
  >
</template>
