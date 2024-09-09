<script lang="ts">
import ArrowNext from "@knime/styles/img/icons/arrow-next.svg";
import { resolveNuxtLinkComponent } from "../nuxtComponentResolver";
import type { FunctionalComponent, PropType, SVGAttributes } from "vue";

type BreadcrumbItem = {
  text?: string;
  href?: string;
  icon?: FunctionalComponent<SVGAttributes>;
  clickable?: boolean;
  title?: string;
  [key: string]: any;
};

export default {
  name: "Breadcrumb",
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
      type: Array as PropType<null | BreadcrumbItem[]>,
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
    /**
     * Set to true to prevent line breaks in the breadcrumb
     * If elements are too wide, the first and the last two elements are shown preferentially.
     * Elements are shown in full on hover or focus.
     * On overflow, no scrollbar will be shown, but the breadcrumb will be scrollable
     */
    noWrap: {
      type: Boolean,
      default: false,
    },
    /**
     * Set to true to reduce the space between the breadcrumb items
     */
    compact: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    "click-item": (_item: BreadcrumbItem) => true,
  },
  computed: {
    // TODO: Can be made into a composition function
    linkComponent() {
      return resolveNuxtLinkComponent();
    },
    /**
     * Whether the items are rendered in reverse order from right to left
     * With that we achieve that the right-most elements
     * (which are the most important) stay visible initially on overflow
     */
    reverseItems() {
      return this.noWrap;
    },
    breadcrumbItems() {
      return this.reverseItems ? this.items?.toReversed() : this.items;
    },
    rightMostItemIndex() {
      return this.reverseItems ? 0 : (this.items?.length ?? 0) - 1;
    },
  },
};
</script>

<template>
  <nav
    v-if="breadcrumbItems && breadcrumbItems.length"
    :class="[
      'breadcrumb',
      { 'grey-style': greyStyle, compact, 'no-wrap': noWrap },
    ]"
  >
    <ul>
      <li
        v-for="(breadcrumbItem, i) in breadcrumbItems"
        :key="i"
        :style="
          !breadcrumbItem.icon && (breadcrumbItem.text?.length ?? 0) < 3
            ? { minWidth: 'fit-content' }
            : {}
        "
      >
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
          :role="breadcrumbItem.clickable ? 'button' : undefined"
          :title="breadcrumbItem.title"
          :tabindex="breadcrumbItem.clickable ? 0 : undefined"
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
        --><ArrowNext v-if="i !== rightMostItemIndex" class="arrow" />
      </li>
    </ul>
  </nav>
</template>

<style lang="postcss" scoped>
@import url("@knime/styles/css/mixins.css");

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
    padding: 0;
  }

  & li {
    position: relative;
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

  /* stylelint-disable no-descending-specificity */
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
    flex-shrink: 0;
    margin: 0 5px;
    stroke-width: calc(32px / 10);
    vertical-align: middle;
    position: relative;
  }

  /* Unlinked breadcrumb item */
  & span {
    &:focus {
      outline: none;
    }

    &:focus-visible {
      @mixin focus-outline;
    }
  }

  /* Clickable breadcrumb item */
  & span.clickable {
    cursor: pointer;
  }

  & span:not(.clickable) {
    color: var(--theme-text-bold-color);
  }

  & span:not(.clickable) svg {
    stroke: var(--theme-text-bold-color);
  }

  /* Linked breadcrumb item */
  & a,
  & span.clickable {
    &:hover,
    &:focus {
      color: var(--theme-text-bold-color);

      & svg {
        stroke: var(--theme-text-bold-color);
      }
    }
  }

  & a {
    &:hover,
    &:focus {
      outline: none;
    }
  }

  &.compact {
    & .breadcrumb-icon,
    & .arrow {
      margin: 0;
    }

    & span,
    & a {
      padding-right: 2px;
      padding-left: 2px;
    }
  }

  &.grey-style {
    color: var(--theme-text-bold-color);

    /* Linked breadcrumb item */
    & a,
    & span.clickable {
      &:hover,
      &:focus {
        background-color: var(--knime-silver-sand-semi);
      }
    }
  }

  &.no-wrap {
    display: flex; /** Otherwise the ul within will not shrink */
    & ul {
      display: inline-flex;
      flex-direction: row-reverse; /* See this.reverseItems for explanation */
      white-space: nowrap;
      overflow-x: auto; /* Scroll with hidden scrollbar in ... */
      -ms-overflow-style: none; /* ... Edge */
      scrollbar-width: none; /* ... Firefox */
      &::-webkit-scrollbar {
        display: none; /* ... Chrome, Safari and Opera */
      }
    }

    & li {
      display: inline-flex;
      align-items: center;
      transition: flex-shrink 0.1s;
      flex: 1 1 min(400px, 30%);
      max-width: fit-content;
      min-width: 45px;

      &:hover,
      &:focus {
        flex-basis: unset;
        flex-shrink: 0;
      }

      &:nth-child(1),
      &:nth-child(2),
      &:nth-last-child(1) {
        flex-shrink: 0;
      }
    }
  }

  &.no-wrap.compact li {
    min-width: 30px;
  }
}
</style>
