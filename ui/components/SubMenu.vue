<script>
import PopupController from '../components/PopupController';
import Menu from '../components/Menu';

const BLUR_TIMEOUT = 200; // ms

export default {
    components: {
        PopupController,
        Menu
    },
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
                return ['right', 'left', 'top'].includes(orientation);
            }
        },
        /**
         * Disable SubMenu
         */
        disabled: {
            type: Boolean,
            default: false
        }
    },
    methods: {
    }
};
</script>

<template>
  <PopupController
    :id="id"
    :orientation="orientation"
    :disabled="disabled"
  >
    <template #toggle>
      <button
        :title="buttonTitle"
        class="submenu-toggle"
      >
        <slot />
      </button>
    </template>

    <template #popup>
      <Menu :items="items" />
    </template>
  </PopupController>
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

</style>
