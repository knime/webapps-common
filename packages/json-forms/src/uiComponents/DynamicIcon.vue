<script lang="ts">
export type Icon = "reload";
</script>

<script setup lang="ts">
import { FunctionalComponent } from "vue";
import ReloadIcon from "@knime/styles/img/icons/reload.svg";
defineProps<{ icon: Icon }>();

const components: Record<Icon, FunctionalComponent> = {
  reload: ReloadIcon,
};
</script>

<template>
  <component :is="components[icon]" />
</template>
