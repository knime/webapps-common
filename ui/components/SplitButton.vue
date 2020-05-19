<template>
  <div>
    <slot />
  </div>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables/webportal-theme.css";

div {
  display: inline-flex;

  & >>> .button {
    position: relative;
    margin-bottom: 0;

    /* best way to ensure flexible 1/4 corners */
    border-radius: var(--theme-button-split-border-radius) 0 0 var(--theme-button-split-border-radius);

    &::after {
      content: '';
      display: block;
      position: absolute;
      width: 1px;
      height: calc(100% - 10px);
      right: 0;
      top: 5px;
      background-color: var(--theme-button-split-divider-color);
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
    /* best way to ensure flexible 1/4 corners */
    border-radius: 0 var(--theme-button-split-border-radius) var(--theme-button-split-border-radius) 0;

    & .submenu-toggle {
      width: 32px;
      display: flex;
      align-items: center;
      justify-content: center;

      &.active,
      &:hover {
        background-color: transparent;
      }

      & svg {
        padding: 0;
        width: 14px;
        height: 14px;
        stroke-width: calc(32px / 14);
        stroke: var(--theme-button-split-foreground-color);
      }
    }

    & ul {
      margin-left: 50%;
      margin-top: 80%;
    }
  }
}
</style>
