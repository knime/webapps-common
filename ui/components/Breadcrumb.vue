<script>
import ArrowNext from '../assets/img/icons/arrow-next.svg?inline';

export default {
    components: {
        ArrowNext
    },
    props: {
    /**
     * items as array with a 'text' and optional properties 'href', 'icon' and 'noTrailingArrow'
     * e.g.
     * [
     *   { text: 'KNIME Hub', href: '/', icon: Icon },
     *   { text: 'John Doe', href: '/john.doe' },
     *   { text: 'Public Space', href: '/john.doe/space' },
     *   { text: 'Examples', href: '/john.doe/space/examples' },
     *   { text: 'Sentiment Prediction via REST', noTrailingArrow: true }
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
          <Component
            :is="breadcrumbItem.icon"
            v-if="breadcrumbItem.icon"
          />
          {{ breadcrumbItem.text }}
        </nuxt-link>
        <span v-else>
          <Component
            :is="breadcrumbItem.icon"
            v-if="breadcrumbItem.icon"
          />
          {{ breadcrumbItem.text }}
        </span>
        <ArrowNext v-if="!breadcrumbItem.noTrailingArrow" />
      </li>
    </ul>
  </nav>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

.breadcrumb {
  color: var(--theme-color-dove-gray);
  font-size: 13px;
  line-height: 18px;
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
  }

  & span,
  & a {
    display: inline-block;
    text-decoration: none;
    overflow: visible;
    vertical-align: top;
    padding: 11px 4px 11px 0;
  }

  & svg {
    vertical-align: top;
  }

  & a > svg,
  & li > svg {
    stroke: var(--theme-color-dove-gray);
  }


  & span,
  & li a:hover {
    color: var(--theme-color-masala);
  }

  & a > svg,
  & span > svg {
    width: 18px;
    margin-right: 2px;
    stroke-width: calc((32px / 18) * 0.8);
  }

  & li > svg {
    width: 10px;
    margin: 15px 4px;
    stroke-width: calc(32px / 10);
  }

  & span > svg,
  & li:hover a svg {
    stroke: var(--theme-color-masala);
  }

  & li:nth-child(n+2) > span,
  & li:nth-child(n+2) > a {
    padding-left: 4px;
  }
}
</style>

