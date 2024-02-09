<script>
import FunctionButton from "webapps-common/ui/components/FunctionButton.vue";
import WarningIcon from "webapps-common/ui/assets/img/icons/circle-warning.svg";

export default {
  components: {
    FunctionButton,
    WarningIcon,
  },
};
</script>

<template>
  <FunctionButton v-bind="$attrs" primary class="button" title="Show messages">
    <WarningIcon />
  </FunctionButton>
</template>

<style lang="postcss" scoped>
.button {
  position: fixed;
  top: 10px;
  right: 50px;
}
</style>
