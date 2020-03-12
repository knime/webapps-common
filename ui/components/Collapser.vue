<script>
import DropdownIcon from '../assets/img/icons/arrow-dropdown.svg?inline';

export default {
    components: {
        DropdownIcon
    },
    props: {
        /**
         * if the initial state is expanded
         */
        initiallyExpanded: {
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
            consola.trace(`Collapser: expanding to ${el.scrollHeight}px`);
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
  <div>
    <button
      :aria-expanded="String(isExpanded)"
      @click="onTrigger"
    >
      <!-- @slot title slot -->
      <slot name="title" />
      <DropdownIcon :class="['dropdown-icon', {flip: isExpanded}]" />
    </button>
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

button {
  position: relative;
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

  & svg {
    position: relative;
    top: 18px;
    margin-right: 4px;
    float: left;
    margin-left: 4px;
  }

  & .dropdown-icon {
    width: 18px;
    height: 18px;
    stroke-width: calc(32px / 18);
    stroke: var(--theme-color-masala);
    position: absolute;
    top: 20px;
    right: 20px;
    transition: transform 0.4s ease-in-out;

    &.flip {
      transform: scaleY(-1);
    }
  }
}

>>> ul,
>>> ol {
  margin: 0;
  padding-left: 40px;
}

.panel {
  transition: height 0.4s ease-in-out;
  overflow: hidden;
}
</style>
