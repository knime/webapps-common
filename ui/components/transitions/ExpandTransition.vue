<script>

export default {
    props: {
        isExpanded: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        onBeforeEnter(el) {
            consola.error('onBeforeEnter');
            el.style.height = 0;
        },
        onEnter(el) {
            consola.error('onEnter');
            el.style.height = `${el.scrollHeight}px`;
        },
        onAfterEnter(el) {
            consola.error('onAfterEnter');
            el.style.height = '';
        },
        onBeforeLeave(el) {
            consola.error('onBeforeLeave');
            el.style.height = `${el.scrollHeight}px`;
            // force repaint to trigger animation correctly
            getComputedStyle(el).height; // eslint-disable-line no-unused-expressions
        },
        onLeave(el) {
            consola.error('onLeave');
            el.style.height = 0;
        }
    }
};
</script>

<template>
  <div>
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
        <slot />
      </div>
    </Transition>
  </div>
</template>

<style lang="postcss" scoped>
.panel {
  transition: height 0.4s ease-in-out;
  overflow: hidden;
}
</style>
