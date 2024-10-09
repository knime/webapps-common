<script>
import ReloadIcon from "@knime/styles/img/icons/reload.svg";

import svgWithTitle from "../SvgWithTitle/svgWithTitle";

export default {
  name: "LoadingIcon",
  components: {
    ReloadIcon: svgWithTitle(ReloadIcon, "Loading…"),
  },
};
</script>

<template>
  <ReloadIcon />
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
