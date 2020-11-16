<script>
import Description from '../Description';
import StandardIcon from '../../assets/img/icons/eye.svg?inline';
import InteractiveIcon from '../../assets/img/icons/interactive.svg?inline';

/**
 * ViewsList are part of the NodeFeaureList
 * Displays a list of views a component or node can produce
 */
export default {
    components: {
        Description,
        StandardIcon,
        InteractiveIcon
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
            default: () => []
        }
    }
};
</script>

<template>
  <ul
    v-if="views.length"
    class="views-list"
  >
    <li
      v-for="(view, index) in views"
      :key="index"
    >
      <h6>
        <InteractiveIcon
          v-if="view.interactive"
          class="interactive"
        />
        <StandardIcon v-else />
        <span>{{ view.interactive ? 'Interactive' : 'Standard' }}</span>
      </h6>
      
      <div class="content">
        <span class="name">{{ view.name }}</span>
        <Description
          :text="view.description"
          :render-as-html="true"
        />
      </div>
    </li>
  </ul>
</template>

<style type="postcss" scoped>
@import "webapps-common/ui/css/variables";

ul,
li {
  margin: 0;
  padding: 0;
}

li {
  background: var(--knime-white);
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
  padding: 20px 30px;
}

h6 {
  display: block;
  flex-basis: 33%;
  flex-grow: 1;
  margin-top: 0;
  margin-bottom: 10px;
  min-width: 140px;
}

.content {
  flex-basis: 66%;
  flex-grow: 1;
  padding: 0;

  & .name {
    margin-bottom: 10px;
    display: block;
    padding: 0;
    position: relative;
    font-size: 16px;
    line-height: 20px;
  }
}

svg {
  width: 18px;
  height: 18px;
  stroke-width: calc(32px / 18);
  margin-right: 10px;
  vertical-align: middle;
  margin-top: -2px;
  stroke: var(--knime-masala);

  &.interactive {
    /* scale stroke width: ( viewbox/displayed size ) * intended stroke-width */
    stroke: var(--knime-masala);
    stroke-width: calc((32px / 18) * 1.3);
    fill: none;
  }
}

>>> .description {
  font-size: 16px;
  line-height: 28px;
  margin-top: 0;

  @media only screen and (max-width: 900px) {
    font-size: 13px;
    line-height: 24px;
  }
}

@media only screen and (max-width: 900px) {
  h6 {
    width: 110px;
  }
}
</style>
