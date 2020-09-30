<script>
import ArrowIcon from '../assets/img/icons/arrow-right.svg?inline';

export default {
    components: { ArrowIcon },
    props: {
        links: {
            type: Array,
            default() { return []; }
        }
    }
};
</script>

<template>
  <ul v-if="links && links.length">
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
@import "webapps-common/ui/css/variables";

@media only screen and (max-width: 900px) {
  ul {
    font-size: 13px;
    line-height: 19px;
    column-count: 1;
    --icon-size: 13px;
    --icon-spacing: 5px;
  }
}

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
    color: var(--theme-color-dove-gray);
    line-height: 20px;
    text-decoration: none;
    overflow-wrap: break-word;
    display: inline-block;
    width: 100%; /* Works together with break-word. Use instead of overflow:hidden which invokes a bug in chrome. */

    & svg {
      position: absolute;
      stroke: var(--theme-color-dove-gray);
      width: var(--icon-size);
      height: var(--icon-size);
      stroke-width: calc(32px / 18);
      left: 0;
    }

    &:hover,
    &:focus,
    &:active {
      outline: none;
      color: var(--theme-color-masala);
      text-decoration: none;

      & svg {
        stroke: var(--theme-color-masala);
      }
    }
  }
}
</style>
