<script>
import DownIcon from '../assets/img/icons/circle-arrow-down.svg?inline';

export default {
    components: {
        DownIcon
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
      <button
        v-else-if="showMore"
        :disabled="loading"
        @click="onClick"
      >
        {{ text }}
        <DownIcon />
      </button>
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
  color: var(--theme-color-dove-gray);

  & button,
  & span {
    min-width: 200px;
    margin: auto;
    background: transparent;
    border: none;
    left: 0;
    right: 0;
    padding: 1em 1em 3em;
    display: block;
    position: relative;
    color: inherit;
  }

  & button {
    cursor: pointer;
  }

  & span {
    cursor: progress;
  }

  & button > svg {
    width: 20px;
    height: 20px;
    stroke-width: calc(32px / 20);
    stroke: var(--theme-color-dove-gray);
    position: absolute;
    left: calc((100% - 20px) / 2);
    top: 32px;
  }

  & button:hover,
  & button:focus,
  & button:active {
    color: var(--theme-color-masala);
    outline: none;

    & > svg {
      stroke: var(--theme-color-masala);
    }
  }
}
</style>
