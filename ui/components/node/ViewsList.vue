<script>
import Description from '../Description';
import StandardIcon from '../../assets/img/icons/eye.svg?inline';
import InteractiveIcon from '../../assets/img/icons/interactive.svg?inline';

export default {
    components: {
        Description,
        StandardIcon,
        InteractiveIcon
    },
    props: {
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
      <h6 v-if="view.interactive">
        <InteractiveIcon class="interactive" />Interactive
      </h6>
      <h6 v-else>
        <StandardIcon />Standard
      </h6>

      <div>
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
  margin-bottom: 10px;
}

h6 {
  display: block;
  width: 180px;
  margin: 20px 30px;
}

div {
  flex: 1;
  padding: 0;
  margin-top: 22px;
  margin-right: 20px;

  & .name {
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
  margin-bottom: 25px;

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
