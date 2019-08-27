<script>
import DropdownIcon from '../assets/img/icons/arrow-dropdown.svg?inline';

export default {
    components: {
        DropdownIcon
    },
    props: {
        /**
         * the title/headline
         */
        title: {
            type: String,
            default: ''
        },
        /**
         * if the initial state is expanded
         */
        initiallyExpanded: {
            type: Boolean,
            default: false
        },
        /**
         * version with smaller font
         */
        compact: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isExpanded: this.initiallyExpanded
        };
    },
    methods: {
        onBeforeEnter(el) {
            consola.trace(`Collapser: setting height to 0px before expanding`);
            el.style.height = 0;
        },
        onEnter(el) {
            consola.trace(`Collapser: expaning to ${el.scrollHeight}px`);
            el.style.height = `${el.scrollHeight}px`;
        },
        onAfterEnter(el) {
            consola.trace(`Collapser: fully expanded, removing fixed height`);
            el.style.height = '';
        },
        onBeforeLeave(el) {
            consola.trace(`Collapser: setting height to ${el.scrollHeight}px before collapsing`);
            el.style.height = `${el.scrollHeight}px`;
            // force repaint to trigger animation correctly
            getComputedStyle(el).height; // eslint-disable-line no-unused-expressions
        },
        onLeave(el) {
            consola.trace(`Collapser: setting height to 0px to trigger collapsing`);
            el.style.height = 0;
        },
        onTrigger(e) {
            this.isExpanded = !this.isExpanded;
        }
    }
};
</script>

<template>
  <div :class="[{compact}]">
    <h3
      :aria-expanded="String(isExpanded)"
      @click="onTrigger"
    >
      <button>
        <span
          v-if="!!$slots.icon"
          class="icon"
        >
          <!-- @slot icon slot -->
          <slot
            name="icon"
          />
        </span>
        {{ title }}
        <DropdownIcon :class="['dropdown-icon', {flip: isExpanded}]" />
      </button>
    </h3>
    <Transition
      name="expand"
      @before-enter="onBeforeEnter"
      @enter="onEnter"
      @before-leave="onBeforeLeave"
      @leave="onLeave"
      @after-enter="onAfterEnter"
    >
      <div
        v-show="isExpanded"
        class="panel"
      >
        <!-- @slot Panel content goes into default slot -->
        <slot />
      </div>
    </Transition>
  </div>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

h3 {
  padding: 15px 30px;
  margin: 0;
  position: relative;

  & button {
    padding: 0;
    font-size: 18px;
    line-height: 26px;
    font-weight: bold;
    background-color: transparent;
    border: 0;
    outline: none;
    -webkit-appearance: none;
    color: inherit; /* Safari needs this */
    width: 100%;
    text-align: left;

    & .dropdown-icon {
      width: 18px;
      height: 18px;
      stroke-width: calc(32px / 18);
      stroke: var(--theme-color-4);
      position: absolute;
      top: 20px;
      right: 20px;
      transition: transform 0.4s ease-in-out;

      &.flip {
        transform: scaleY(-1);
      }
    }

    /* optional icon via slot */
    & .icon svg {
      position: relative;
      top: 4px;
      margin-right: 4px;
    }
  }
}

.compact h3 {
  padding: 2px 0;

  & button {
    font-size: 13px;

    & .dropdown-icon {
      width: 16px;
      height: 16px;
      top: 8px;
      right: 0;
    }
  }
}

>>> ul,
>>> ol {
  margin: 0;
  padding-left: 40px;
}

.expand-enter-active,
.expand-leave-active {
  transition: height 0.4s ease-in-out;
  overflow: hidden;
}
</style>
