<script lang="ts" setup>
import ReloadIcon from "@knime/styles/img/icons/reload.svg";

import svgWithTitle from "../SvgWithTitle/svgWithTitle";

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
