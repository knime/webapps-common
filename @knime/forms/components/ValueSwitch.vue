<script>
import BaseRadioButtons from './BaseRadioButtons';

export default {
    components: {
        BaseRadioButtons
    }
};
</script>

<template>
  <BaseRadioButtons
    ref="radioButton"
    class="value-switch"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<style lang="postcss" scoped>
.value-switch >>> {
  display: flex;
  align-items: center;
  height: 30px;
  width: max-content;
  padding: 3px;
  border-radius: 50px;
  border: 1px solid var(--knime-stone-gray);

  & span {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 24px;
    min-width: 41px;
    padding: 0 10px;
    font-weight: 300;
    font-size: 13px;
    line-height: 18px;
    cursor: pointer;
    border-radius: 50px;
    transition: background-color 0.1s ease-in 0.05s;

    &:hover {
      background-color: var(--theme-value-switch-background-color-hover);
    }
  }

  & input {
    user-select: none;
    display: none;

    &:checked + span {
      background-color: var(--theme-value-switch-background-color-checked);
      color: var(--theme-value-switch-background-color);
    }
  }
}
</style>
