<script>
import ArrowNext from '../assets/img/icons/arrow-next.svg?inline';

export default {
    components: {
        ArrowNext
    },
    props: {
        /**
         * items as array with a 'text' and optional properties 'href', 'icon'
         * e.g.
         * [
         *   { text: 'KNIME Hub', href: '/', icon: Icon },
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
          <Component
            :is="breadcrumbItem.icon"
            v-if="breadcrumbItem.icon"
            class="breadcrumb-icon"
          />
          {{ breadcrumbItem.text }}
        </nuxt-link>
        <span v-else>
          <Component
            :is="breadcrumbItem.icon"
            v-if="breadcrumbItem.icon"
            class="breadcrumb-icon"
          />
          {{ breadcrumbItem.text }}
        </span><!-- no whitespace
        --><ArrowNext
          v-if="i !== items.length - 1"
          class="arrow"
        />
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
  }

  & ul {
    padding: 10px 0;
  }

  & li {
    position: relative;
    margin: 5px 0;

    &:not(:last-child) {
      margin-right: 4px;
    }
  }

  & span,
  & a {
    display: inline-block;
    text-decoration: none;
    overflow: visible;
    vertical-align: top;
    padding-right: 4px;
  }

  & svg {
    vertical-align: top;
    stroke: var(--theme-color-dove-gray);
  }

  & .breadcrumb-icon {
    width: 18px;
    height: 18px;
    margin-right: 2px;
    stroke-width: calc((32px / 18) * 0.8);
  }

  & .arrow {
    width: 10px;
    height: 10px;
    margin: 0 4px;
    stroke-width: calc(32px / 10);
    vertical-align: middle;
  }

  /* Unlinked breadcrumb item */
  & span {
    color: var(--theme-color-masala);

    & svg {
      stroke: var(--theme-color-masala);
    }
  }

  /* Linked breadcrumb item */
  & a {
    &:hover {
      color: var(--theme-color-masala);

      & svg {
        stroke: var(--theme-color-masala);
      }
    }
  }
}
</style>

