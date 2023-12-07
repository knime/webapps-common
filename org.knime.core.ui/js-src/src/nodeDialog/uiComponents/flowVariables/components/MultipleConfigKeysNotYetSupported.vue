<script setup lang="ts">
defineProps<{ configKeys?: string[]; subConfigKeys?: string[] }>();
</script>

<template>
  <p>
    This setting includes multiple config keys. Setting flow variables here is
    not yet possible.
  </p>
  <p>
    To do so, select <b>"Configure flow variables"</b> in the context menu of
    this node.
  </p>
  <template v-if="(configKeys ?? []).length > 1">
    <p>Config keys:</p>
    <ul>
      <li v-for="key in configKeys ?? []" :key="key">
        {{ key }}
      </li>
    </ul>
  </template>
</template>

<style scoped>
p {
  margin: 10px 0;
  font-size: 13px;
}
</style>
