<script setup lang="ts">
defineProps<{
  text: string;
  hotkeyText?: string;
  useMaxMenuWidth: boolean;
}>();
</script>

<template>
  <span :class="['text', { truncate: useMaxMenuWidth }]">
    {{ text }}
  </span>
  <span v-if="hotkeyText" class="hotkey">{{ hotkeyText }}</span>
</template>

<style lang="postcss" scoped>
.text,
.hotkey {
  font-weight: 400;
}

.text {
  flex-shrink: 1;
  flex-basis: 100%;

  &.truncate {
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.hotkey {
  margin-left: 40px;
}
</style>
