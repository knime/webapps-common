<script lang="ts" setup>
import { svgWithTitle } from "@knime/components";
import ReloadIcon from "@knime/styles/img/icons/reload.svg";
// @ts-expect-error Argument of type 'FunctionalComponent<SVGAttributes>' is not assignable to parameter of type 'never'.
const ReloadIconWithTitle = svgWithTitle(ReloadIcon, "Loading…");
</script>

<template>
  <ReloadIconWithTitle />
</template>

<style type="postcss" scoped>
@keyframes spin {
  100% {
    transform: scaleY(-1) rotate(-360deg);
  }
}

svg {
  transform: scaleY(-1);
  animation: spin 2s linear infinite;
}
</style>
