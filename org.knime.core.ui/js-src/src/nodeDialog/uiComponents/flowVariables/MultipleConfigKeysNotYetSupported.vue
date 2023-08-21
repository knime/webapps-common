<script setup lang="ts">
defineProps<{ configKeys: string[] }>();
</script>

<template>
  <p>
    There are multiple config keys present for this setting. Selecting
    controlling variables here is not yet supported in this case.
  </p>
  <p>Config keys:</p>
  <ul>
    <li v-for="key in configKeys" :key="key">
      {{ key }}
    </li>
  </ul>
</template>
