<script setup lang="ts">
import { computed, watch } from 'vue';

const props = defineProps<{
    url: string,
    height?: number,
    width?: number,
    updateSize?: boolean
}>();


const src = computed(() => props.width && props.height
    ? `${props.url}?w=${Math.floor(props.width)}&h=${Math.floor(props.height)}`
    : props.url);

let fixedSrc: null | string = null;
watch(() => props.updateSize, (updateSize) => {
    fixedSrc = updateSize ? null : src.value;
}, { immediate: true });
</script>

<template>
  <img
    loading="lazy"
    :src="fixedSrc || src"
    alt=""
  >
</template>
