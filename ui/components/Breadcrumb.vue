<script>
export default {
    props: {
        /**
         * items as array with a 'text' and optional 'href' property
         * e.g.
         * [
         *   { text: 'KNIME Hub', href: '/' },
         *   { text: 'John Doe', href: '/john.doe' },
         *   { text: 'Public Space', href: '/john.doe/space' },
         *   { text: 'Examples', href: '/john.doe/space/examples' },
         *   { text: 'Sentiment Prediction via REST' }
         * ]
         */
        items: {
            type: Array,
            default: () => []
        }
    }
};
</script>

<template>
  <nav
    v-if="items && items.length"
    class="breadcrumb"
  >
    <ul>
      <li
        v-for="(breadcrumbItem, i) in items"
        :key="i"
      >
        <nuxt-link
          v-if="breadcrumbItem.href"
          :to="breadcrumbItem.href"
        >
          {{ breadcrumbItem.text }}
        </nuxt-link>
        <span v-else>
          {{ breadcrumbItem.text }}
        </span>
      </li>
    </ul>
  </nav>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

.breadcrumb {
  padding-top: 15px;
  padding-bottom: 15px;
  color: var(--theme-color-7);
  font-size: 13px;
  line-height: 22px;
  font-weight: 500;
  margin: 0;
  list-style-type: none;

  & ul,
  & li {
    display: inline-block;
    margin: 0;
    padding: 0;
  }

  & li {
    position: relative;
    margin-right: 15px;

    &:not(:last-child)::after {
      display: inline-block;
      content: '›';
      position: absolute;
      top: 0;
      right: -15px;
      width: 15px;
      font-weight: 300;
      color: var(--theme-color-7);
      text-align: center;
      pointer-events: none;
    }
  }

  & span,
  & a {
    display: inline-block;
    text-decoration: none;
    overflow: visible;
  }

  & span,
  & a:hover {
    color: var(--theme-color-4);
  }
}
</style>
