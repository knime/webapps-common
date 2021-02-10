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
    computed: {
        text() {
            if (this.idle) {
                return this.idleText;
            } else if (this.ready) {
                return this.readyText;
            }
            return '';
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
      <div :class="{ idle }">
        <Button
          v-if="ready || idle"
          compact
          with-border
          :disabled="idle"
          @click="onClick"
        >
          {{ text }}
          <DownIcon v-if="withDownIcon && !idle" />
        </Button>
      </div>
    </client-only>
  </div>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

.load-more {
  min-height: 85px;
  padding-top: 30px;
  display: flex;
  justify-content: center;

  & .idle {
    cursor: progress;
  }

  & button:hover,
  & button:focus,
  & button:active {
    color: var(--knime-white);
    outline: none;
  }
}
</style>
