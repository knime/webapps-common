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
        },
        /**
         * focus and hover style can be switched by changing this value:
         * true - darker background, normal font
         * false - transparent background, bold font
         */
        greyStyle: {
            type: Boolean,
            default: false
        }
    }
};
</script>

<template>
  <nav
    v-if="items && items.length"
    :class="['breadcrumb', { greyStyle }]"
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
  color: var(--knime-dove-gray);
  font-family: var(--theme-text-bold-font-family);
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
    padding: 0;
    width: 100%;
  }

  & li {
    position: relative;
    margin: 0;
    max-width: 100%;
  }

  & span,
  & a {
    display: inline-block;
    text-decoration: none;
    vertical-align: top;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 100%;
    padding: 10px 5px;
  }

  & svg {
    vertical-align: top;
    stroke: var(--theme-text-bold-color);
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
    margin: 0 5px;
    stroke-width: calc(32px / 10);
    vertical-align: middle;
    position: relative;
    top: 9px;
  }

  /* Unlinked breadcrumb item */
  & span {
    color: var(--theme-text-bold-color);

    & svg {
      stroke: var(--theme-text-bold-color);
    }
  }

  /* Linked breadcrumb item */
  & a {
    &:hover,
    &:focus {
      outline: none;
      color: var(--theme-text-bold-color);

      & svg {
        stroke: var(--theme-text-bold-color);
      }
    }
  }

  &.greyStyle {
    color: var(--theme-text-bold-color);

    /* Linked breadcrumb item */
    & a {
      &:hover,
      &:focus {
        outline: none;
        background-color: var(--knime-silver-sand-semi);
      }
    }
  }
}
</style>

