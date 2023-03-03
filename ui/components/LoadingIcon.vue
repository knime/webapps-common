<script>
import ReloadIcon from '../../ui/assets/img/icons/reload.svg';
import svgWithTitle from '../util/svgWithTitle.mjs';

export default {
    components: {
        ReloadIcon: svgWithTitle(ReloadIcon, 'Loading…')
    }
};
</script>

<template>
  <ReloadIcon />
</template>

<style type="postcss" scoped>
@keyframes spin {
  100% {
    transform: rotate(-360deg);
  }
}

svg {
  animation: spin 2s linear infinite;
}
</style>
