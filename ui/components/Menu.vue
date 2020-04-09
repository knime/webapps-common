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
  <ul>
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
        class="clickable-item"
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
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

ul {
  margin: 0;
  padding: 5px 0;
  background-color: var(--theme-color-white);
  color: var(--theme-color-dove-gray);
  font-size: 13px;
  line-height: 18px;
  font-weight: 500;
  text-align: left;
  list-style-type: none;

  & a {
    padding: 6px 13px;
    display: flex;
    align-items: center;
    text-decoration: none;
    cursor: pointer;
    white-space: nowrap;

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

        & .text {
          stroke: var(--theme-color-white);
        }
      }
    }
  }
}

</style>
