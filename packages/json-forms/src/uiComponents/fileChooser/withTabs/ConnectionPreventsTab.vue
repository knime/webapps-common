<script setup lang="ts">
defineProps<{
  browseAction: string;
}>();

import PluginIcon from "@knime/styles/img/icons/plugin.svg";
</script>

<template>
  <div class="vertical">
    <PluginIcon class="icon" />
    <span
      >Remove the file system input port in order to {{ browseAction }}.</span
    >
  </div>
</template>

<style lang="postcss" scoped>
.vertical {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 50px 30px;

  & .icon {
    width: 70px;
    height: 70px;
    stroke-width: 0.5px;
  }

  & span {
    text-align: center;
    line-height: 1.5;
  }
}
</style>
