<script>
import StandardIcon from "@knime/styles/img/icons/eye.svg";
import InteractiveIcon from "@knime/styles/img/icons/interactive.svg";

import Description from "../Description/Description.vue";

/**
 * ViewsList are part of the NodeFeaureList
 * Displays a list of views a component or node can produce
 */
export default {
  name: "ViewsList",
  components: {
    Description,
    StandardIcon,
    InteractiveIcon,
  },
  props: {
    /**
     * Array of views
     * View {
     *    interactive: Boolean,
     *    name: String,
     *    description: String
     * }
     */
    views: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<template>
  <ul v-if="views.length" class="views-list">
    <li v-for="(view, index) in views" :key="index">
      <h6>
        <InteractiveIcon v-if="view.interactive" class="interactive" />
        <StandardIcon v-else />
        <span>{{ view.interactive ? "Interactive" : "Standard" }}</span>
      </h6>

      <div class="content">
        <span class="name">{{ view.name }}</span>
        <Description :text="view.description" render-as-html />
      </div>
    </li>
  </ul>
</template>

<style type="postcss" scoped>
ul,
li {
  padding: 0;
  margin: 0;
}

li {
  display: flex;
  flex-wrap: wrap;
  padding: 20px 30px;
  margin-bottom: 10px;
  background: var(--knime-white);
}

h6 {
  display: block;
  flex-grow: 1;
  flex-basis: 33%;
  min-width: 140px;
  margin-top: 0;
  margin-bottom: 10px;
}

.content {
  flex-grow: 1;
  flex-basis: 66%;
  padding: 0;

  & .name {
    position: relative;
    display: block;
    padding: 0;
    margin-bottom: 10px;
    font-size: 16px;
    line-height: 20px;
  }
}

svg {
  width: 18px;
  height: 18px;
  margin-top: -2px;
  margin-right: 10px;
  vertical-align: middle;
  stroke: var(--knime-masala);
  stroke-width: calc(32px / 18);

  &.interactive {
    fill: none;

    /* scale stroke width: ( viewbox/displayed size ) * intended stroke-width */
    stroke: var(--knime-masala);
    stroke-width: calc((32px / 18) * 1.3);
  }
}

:deep(.description) {
  margin-top: 0;
  font-size: 16px;
  line-height: 28px;
}
</style>
