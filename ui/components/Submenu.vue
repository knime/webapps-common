<script>
export default {
    props: {
        items: {
            required: true,
            type: Array
        }
    }
};
</script>
<template>
  <div class="submenu">
    <!-- The @click is required by Firefox -->
    <button
      ref="submenu-toggle"
      title="More KNIME"
      class="submenu-toggle"
      aria-haspopup="true"
      tabindex="0"
      @click="e => { e.currentTarget.focus(); }"
    >
      <slot />
    </button>
    <ul
      aria-label="submenu"
      role="menu"
    >
      <li
        v-for="item in items"
        :key="item.href"
      >
        <Component
          :is="item.to ? 'nuxt-link' : 'a'"
          :to="item.to"
          :href="item.href ? item.href : ''"
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
  color: inherit;
  font-weight: inherit;
  background: transparent;
  padding: 0;
  border: 0 none;
  text-decoration: none;
  display: block;
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
  background-color: var(--theme-color-3);
  color: var(--theme-color-7);
  font-size: 13px;
  line-height: 18px;
  font-weight: 500;
  text-align: left;
  list-style-type: none;
  box-shadow: 0 1px 4px 0 var(--theme-color-9);
  z-index: 1;

  & a {
    padding: 6px 13px;
    display: flex;
    align-items: center;
    text-decoration: none;

    & .item-icon {
      stroke: var(--theme-color-4);
      width: 18px;
      height: 18px;
      margin-right: 7px;
    }

    &:active,
    &:hover,
    &:focus {
      outline: none;
      background-color: var(--theme-color-4);
      color: var(--theme-color-3);

      & .item-icon {
        stroke: var(--theme-color-3);
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
