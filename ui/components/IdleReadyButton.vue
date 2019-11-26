<script>
import Button from './Button';

export default {
    components: {
        Button
    },
    props: {
        /**
         * Indicate idle state, e.g. loading
         */
        idle: {
            type: Boolean,
            default: false
        },
        /**
         * Idle text
         */
        idleText: {
            type: String,
            default: 'Loading...'
        },
        /**
         * Should the button be ready
        */
        ready: {
            type: Boolean,
            default: true
        },
        /**
         * Button ready text
         */
        readyText: {
            type: String,
            default: 'More results'
        }
    },
    methods: {
        onClick() {
            this.$emit('click');
        }
    }
};
</script>

<template>
  <div
    v-if="idle || ready"
    class="load-more"
  >
    <no-ssr>
      <span v-if="idle">
        {{ idleText }}
      </span>
      <Button
        v-else-if="ready"
        compact
        with-border
        :disabled="idle"
        @click="onClick"
      >
        {{ readyText }}
      </Button>
    </no-ssr>
  </div>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

.load-more {
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  min-height: 85px;
  color: var(--theme-color-masala);
  padding-top: 30px;

  & >>> button,
  & span {
    min-width: 200px;
    margin: auto;
    background-color: transparent;
    border: none;
    left: 0;
    right: 0;
    display: block;
    color: inherit;
  }

  & span {
    cursor: progress;
  }

  & button:hover,
  & button:focus,
  & button:active {
    color: var(--theme-color-white);
    outline: none;
  }
}
</style>
