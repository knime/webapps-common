<script>
import Button from './Button';

export default {
    components: {
        Button
    },
    props: {
        /**
         * Indicate loading state
         */
        loading: {
            type: Boolean,
            default: false
        },
        /**
         * Should the button be shown
         */
        showMore: {
            type: Boolean,
            default: true
        },
        /**
         * Button text
         */
        text: {
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
    v-if="loading || showMore"
    class="load-more"
  >
    <no-ssr>
      <span v-if="loading">
        Loading…
      </span>
      <Button
        v-else-if="showMore"
        compact
        with-border
        :disabled="loading"
        @click="onClick"
      >
        {{ text }}
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
