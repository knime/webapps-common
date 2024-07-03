<script>
import ArrowNext from "@knime/styles/img/icons/arrow-next.svg";
import { resolveNuxtLinkComponent } from "../nuxtComponentResolver";

export default {
  components: {
    ArrowNext,
  },
  props: {
    /**
     * items as array with a 'text' and optional properties 'href', 'icon' and 'clickable'
     *
     * Having "href" set will make the element behave as a link. Having the "clickable" property
     * set will make the component emit a "click-item" event when the corresponding item is clicked. "href" takes
     * precedence over "clickable"
     *
     * e.g.
     * [
     *   { text: 'KNIME Hub', href: '/', icon: Icon },
     *   { text: 'John Doe', href: '/john.doe' },
     *   { text: 'Public Space', href: '/john.doe/space' },
     *   { text: 'Examples', clickable: true },
     *   { text: 'Sentiment Prediction via REST' }
     * ]
     */
    items: {
      type: Array,
      default: () => [],
    },
    /**
     * focus and hover style can be switched by changing this value:
     * true - darker background, normal font
     * false - transparent background, bold font
     */
    greyStyle: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["click-item"],
  computed: {
    // TODO: Can be made into a composition function
    linkComponent() {
      return resolveNuxtLinkComponent();
    },
  },
};
</script>

<template>
  <nav
    v-if="items && items.length"
    :class="['breadcrumb', { 'grey-style': greyStyle }]"
  >
    <ul>
      <li v-for="(breadcrumbItem, i) in items" :key="i">
        <Component
          :is="linkComponent"
          v-if="breadcrumbItem.href"
          :to="breadcrumbItem.href"
        >
          <Component
            :is="breadcrumbItem.icon"
            v-if="breadcrumbItem.icon"
            class="breadcrumb-icon"
          />
          {{ breadcrumbItem.text }}
        </Component>
        <span
          v-else
          :class="{ clickable: breadcrumbItem.clickable }"
          :role="breadcrumbItem.clickable ? 'button' : null"
          :title="breadcrumbItem.title"
          :tabindex="breadcrumbItem.clickable ? 0 : null"
          @keydown.enter.stop.prevent="
            breadcrumbItem.clickable && $emit('click-item', breadcrumbItem)
          "
          @click="
            breadcrumbItem.clickable && $emit('click-item', breadcrumbItem)
          "
        >
          <Component
            :is="breadcrumbItem.icon"
            v-if="breadcrumbItem.icon"
            class="breadcrumb-icon"
          />
          {{ breadcrumbItem.text }} </span
        ><!-- no whitespace
        --><ArrowNext v-if="i !== items.length - 1" class="arrow" />
      </li>
    </ul>
  </nav>
</template>

<style lang="postcss" scoped>
@import url("../css/mixins.css");

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
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 100%;
    padding: 10px 5px;
    line-height: normal;
    vertical-align: middle;
  }

  & svg {
    position: relative;
    vertical-align: top;
    stroke: var(--theme-text-bold-color);
    bottom: 1px;
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
  }

  /* Unlinked breadcrumb item */
  & span {
    color: var(--theme-text-bold-color);

    &:focus {
      outline: none;
    }

    &:focus-visible {
      @mixin focus-outline;
    }

    & svg {
      stroke: var(--theme-text-bold-color);
    }
  }

  /* Clickable breadcrumb item */
  & span.clickable {
    cursor: pointer;
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

  &.grey-style {
    color: var(--theme-text-bold-color);

    /* Linked breadcrumb item */
    & a:hover,
    & a:focus {
      outline: none;
      background-color: var(--knime-silver-sand-semi);
    }
  }
}
</style>
