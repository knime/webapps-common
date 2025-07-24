<script lang="ts">
export type Icon = "reload";
</script>

<script setup lang="ts">
import { type Component } from "vue";

import ReloadIcon from "@knime/styles/img/icons/reload.svg";

defineProps<{ icon: Icon }>();

const components: Record<Icon, Component> = {
  reload: ReloadIcon,
};
</script>

<template>
  <component :is="components[icon]" />
</template>
