<script>
import Button from './Button';
import DownIcon from '../assets/img/icons/circle-arrow-down.svg?inline';

export default {
    components: {
        Button,
        DownIcon
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
        },
        /**
         * `true` to render an arrow icon with the readyText. Defaults to `false`.
         */
        withDownIcon: {
            type: Boolean,
            default: false
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
    <client-only>
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
        <DownIcon v-if="withDownIcon" />
        {{ readyText }}
      </Button>
    </client-only>
  </div>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

.load-more {
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  font-family: var(--theme-text-medium-font-family);
  color: var(--theme-text-medium-color);
  min-height: 85px;
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
