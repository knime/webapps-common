<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import ArrowIcon from '../assets/img/icons/arrow-right.svg';

interface LinkItem {
  text: string;
  url: string;
}

/**
 * Renders a list of clickable links displayed with an arrow icon and text
 *
 * Example:
 * -> Google
 * -> KNIME Hub
*/
export default defineComponent({
    components: {
        ArrowIcon
    },
    props: {
        links: {
            type: Array as PropType<Array<LinkItem>>,
            default: () => []
        }
    }
});
</script>

<template>
  <ul
    v-if="links && links.length"
    class="link-list"
  >
    <li
      v-for="(link, index) of links"
      :key="index"
    >
      <a
        v-if="link.url"
        :href="link.url"
        rel="ugc noopener"
      >
        <ArrowIcon />
        {{ link.text || link.url }}
      </a>
    </li>
  </ul>
</template>

<style lang="postcss" scoped>
ul {
  --icon-size: 18px;
  --icon-spacing: 6px;

  list-style: none;
  padding: 0;
  column-count: 2;
  column-gap: 24px;
  font-weight: 500;

  & li {
    padding-left: calc(var(--icon-size) + var(--icon-spacing));
    margin-bottom: 8px;
    position: relative;
    display: block;
    text-overflow: ellipsis;
  }

  & a {
    color: var(--knime-dove-gray);
    line-height: 20px;
    text-decoration: none;
    overflow-wrap: break-word;
    display: inline-block;
    width: 100%; /* Works together with break-word. Use instead of overflow:hidden which invokes a bug in chrome. */

    & svg {
      position: absolute;
      stroke: var(--knime-dove-gray);
      width: var(--icon-size);
      height: var(--icon-size);
      stroke-width: calc(32px / 18);
      left: 0;
    }

    &:hover,
    &:focus,
    &:active {
      outline: none;
      color: var(--knime-masala);
      text-decoration: none;

      & svg {
        stroke: var(--knime-masala);
      }
    }
  }
}
</style>
