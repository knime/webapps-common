<script setup lang="ts">
defineProps<{ configPaths: string[]; subConfigKeys?: string[] }>();
</script>

<template>
  <p>
    This setting includes different numbers of config and data keys. A mapping
    of one to the other is not possible. Setting flow variables here is not
    possible either.
  </p>
  <p>
    To do so, select <b>"Configure flow variables"</b> in the context menu of
    this node.
  </p>
  <template v-if="(configPaths ?? []).length > 1">
    <p>Config paths:</p>
    <ul>
      <li v-for="key in configPaths ?? []" :key="key">
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

li {
  font-size: 13px;
  overflow-wrap: break-word;
}
</style>
