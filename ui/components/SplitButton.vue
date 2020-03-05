<template>
  <div>
    <slot />
  </div>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

div {
  display: inline-flex;

  & >>> .button {
    position: relative;
    margin-bottom: 0;

    &::after {
      content: '';
      display: block;
      position: absolute;
      width: 1px;
      height: calc(100% - 10px);
      right: 0;
      top: 5px;
      background-color: var(--theme-color-dove-gray);
    }
  }

  &:hover,
  &:focus-within {
    & >>> .button {
      &::after {
        display: none;
      }
    }
  }

  & >>> .submenu {
    & .submenu-toggle {
      width: 32px;
      display: flex;
      align-items: center;
      justify-content: center;

      & svg {
        width: 14px;
        height: 14px;
        stroke-width: calc(32px / 14);
        stroke: var(--theme-color-masala);
      }
    }

    & ul {
      margin-left: 50%;
      margin-top: 80%;
    }
  }
}
</style>
