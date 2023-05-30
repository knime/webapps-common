<script setup lang="ts">
defineProps<{
    content: string
}>();
</script>

<template>
  <span v-html="content" />
</template>
