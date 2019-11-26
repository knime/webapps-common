<script>
export default {
    props: {
        /**
         * Items to be listed in the menu.
         * Each item has a `text`, optional `icon` and optional `to` / `href` properties, where `to` is for router-links
         * and `href` for standard (e.g. external) links.
         * @example
           [{
              href: 'http://apple.com',
              text: 'Apples',
              icon: HelpIcon
           }, {
              href: 'https://en.wikipedia.org/wiki/Orange_(colour)',
              text: 'Oranges',
              icon: StarIcon
           },  {
              to: '/testing-nuxt-link',
              text: 'Ananas'
           }]
         */
        items: {
            required: true,
            type: Array
        },
        /**
         * Identifier for clickhandler
         */
        id: {
            default: '',
            type: String
        },
        /**
         * Button title
         */
        buttonTitle: {
            default: '',
            type: String
        },
        /**
         * Alignment of the submenu with the menu button
         * left or right. Defaults to 'right'.
         */
        orientation: {
            type: String,
            default: 'right',
            validator(orientation = 'right') {
                return ['right', 'left'].includes(orientation);
            }
        }

    },
    methods: {
        onItemClick(event, item) {
            this.$emit('item-click', event, item, this.id);
        }
    }
};
</script>

<template>
  <div class="submenu">
    <!-- The @click is required by Firefox -->
    <button
      ref="submenu-toggle"
      :title="buttonTitle"
      class="submenu-toggle"
      aria-haspopup="true"
      tabindex="0"
      @click="e => { e.currentTarget.focus(); }"
    >
      <slot />
    </button>
    <ul
      :class="`orient-${orientation}`"
      aria-label="submenu"
      role="menu"
    >
      <li
        v-for="(item, index) in items"
        :key="index"
        @click="onItemClick($event, item, index)"
      >
        <Component
          :is="item.to ? 'nuxt-link' : 'a'"
          :to="item.to"
          :href="item.href || null"
          tabindex="0"
        >
          <Component
            :is="item.icon"
            v-if="item.icon"
            class="item-icon"
          />
          {{ item.text }}
        </Component>
      </li>
    </ul>
  </div>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

button {
  display: block;
  color: inherit;
  font-weight: inherit;
  background: transparent;
  padding: 0;
  border: 0 none;
  text-decoration: none;
  cursor: pointer;

  &:active,
  &:hover,
  &:focus {
    outline: none;
  }
}

ul {
  display: none;
  position: absolute;
  right: 0;
  margin-top: 8px;
  padding: 0;
  background-color: var(--theme-color-white);
  color: var(--theme-color-dove-gray);
  font-size: 13px;
  line-height: 18px;
  font-weight: 500;
  text-align: left;
  list-style-type: none;
  box-shadow: 0 1px 4px 0 var(--theme-color-gray-dark-semi);
  z-index: 1;

  &.orient-left {
    right: auto;
    left: 0;
  }

  & a {
    padding: 6px 13px;
    display: flex;
    align-items: center;
    text-decoration: none;
    cursor: pointer;

    & .item-icon {
      stroke: var(--theme-color-masala);
      width: 18px;
      height: 18px;
      margin-right: 7px;
    }

    &:active,
    &:hover,
    &:focus {
      outline: none;
      background-color: var(--theme-color-masala);
      color: var(--theme-color-white);

      & .item-icon {
        stroke: var(--theme-color-white);
      }
    }
  }
}

.submenu {
  position: relative;

  &:focus-within ul,
  & .submenu-toggle:focus + ul { /* only for IE/Edge */
    display: block;
  }
}
</style>
