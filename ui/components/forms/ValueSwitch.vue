<script>
import BaseRadioButtons from './BaseRadioButtons.vue';

export default {
    components: {
        BaseRadioButtons
    },
    props: {
        // this props are passed to BaseRadioButtons
        id: {
            type: String,
            default: null
        },
        value: {
            type: String,
            default: null
        },
        name: {
            type: String,
            default: null
        },
        disabled: {
            default: false,
            type: Boolean
        },
        /**
         * List of possible values. Each item must have an `id` and a `text` property
         * @example
         * [{
         *   id: 'pdf',
         *   text: 'PDF'
         * }, {
         *   id: 'XLS',
         *   text: 'Excel',
         * }]
         */
        possibleValues: {
            type: Array,
            default: () => []
        }
    }
};
</script>

<template>
  <BaseRadioButtons
    :id="id"
    ref="radioButton"
    :possible-values="possibleValues"
    :value="value"
    :name="name"
    :disabled="disabled"
    class="value-switch"
    :class="{disabled}"
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

.value-switch:not(.disabled) >>> span:hover {
  background-color: var(--theme-value-switch-background-color-hover);
}

.value-switch.disabled {
  opacity: 0.5;
}

</style>
