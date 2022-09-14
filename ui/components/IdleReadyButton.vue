<script>
import Button from './Button.vue';
import DownIcon from '../assets/img/icons/circle-arrow-down.svg';
import { resolveClientOnlyComponent } from '../util/custom-component-resolver';

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
        },
        /**
         * show button with border
         */
        withBorder: {
            type: Boolean,
            default: true
        }
    },
    emits: ['click'],
    computed: {
        // TODO: Can be made into a composition function
        clientOnlyComponent() {
            return resolveClientOnlyComponent();
        },
        text() {
            if (this.idle) {
                return this.idleText;
            } else if (this.ready) {
                return this.readyText;
            }
            return '';
        }
    }
};
</script>

<template>
  <div
    v-if="idle || ready"
    class="load-more"
  >
    <Component :is="clientOnlyComponent">
      <div :class="{ idle }">
        <Button
          v-if="ready || idle"
          compact
          :with-border="withBorder"
          :disabled="idle"
          @click="$emit('click')"
        >
          <slot
            v-if="ready"
            name="readyIcon"
          />
          {{ text }}
          <DownIcon v-if="withDownIcon && !idle" />
        </Button>
      </div>
    </Component>
  </div>
</template>

<style lang="postcss" scoped>
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
