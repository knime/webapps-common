<script lang="ts">
import type { PropType } from "vue";
import { defineComponent } from "vue";

import ArrowIcon from "@knime/styles/img/icons/arrow-right.svg";

type LinkItem = {
  text?: string;
  url: string;
};

/**
 * Renders a list of clickable links displayed with an arrow icon and text
 *
 * Example:
 * -> Google
 * -> KNIME Hub
 */
export default defineComponent({
  name: "LinkList",
  components: {
    ArrowIcon,
  },
  props: {
    links: {
      type: Array as PropType<Array<LinkItem>>,
      default: () => [],
    },
  },
});
</script>

<template>
  <ul v-if="links && links.length" class="link-list">
    <li v-for="(link, index) of links" :key="index">
      <a v-if="link.url" :href="link.url" rel="ugc noopener">
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

  column-gap: 24px;
  padding: 0;
  font-weight: 500;
  list-style: none;
  column-count: 2;

  & li {
    position: relative;
    display: block;
    padding-left: calc(var(--icon-size) + var(--icon-spacing));
    margin-bottom: 8px;
    text-overflow: ellipsis;
  }

  & a {
    display: inline-block;
    width: 100%; /* Works together with break-word. Use instead of overflow:hidden which invokes a bug in chrome. */
    line-height: 20px;
    color: var(--knime-dove-gray);
    overflow-wrap: break-word;
    text-decoration: none;

    & svg {
      position: absolute;
      left: 0;
      width: var(--icon-size);
      height: var(--icon-size);
      stroke: var(--knime-dove-gray);
      stroke-width: calc(32px / 18);
    }

    &:hover,
    &:focus,
    &:active {
      color: var(--knime-masala);
      text-decoration: none;
      outline: none;

      & svg {
        stroke: var(--knime-masala);
      }
    }
  }
}
</style>
