<script>
export default {
  name: "ExpandTransition",
  props: {
    isExpanded: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onBeforeEnter(el) {
      el.style.height = 0;
    },
    onEnter(el) {
      el.style.height = `${el.scrollHeight}px`;
    },
    onAfterEnter(el) {
      el.style.height = "";
    },
    onBeforeLeave(el) {
      el.style.height = `${el.scrollHeight}px`;
      // force repaint to trigger animation correctly
      getComputedStyle(el).height; // eslint-disable-line no-unused-expressions
    },
    onLeave(el) {
      el.style.height = 0;
    },
  },
};
</script>

<template>
  <Transition
    name="expand"
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @before-leave="onBeforeLeave"
    @leave="onLeave"
    @after-enter="onAfterEnter"
  >
    <div v-show="isExpanded" class="panel">
      <slot />
    </div>
  </Transition>
</template>

<style lang="postcss" scoped>
.panel {
  transition: height 0.4s ease-in-out;
  overflow: hidden;
}
</style>
