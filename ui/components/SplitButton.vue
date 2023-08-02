<template>
  <div class="split-button">
    <slot />
  </div>
</template>

<style lang="postcss" scoped>
.split-button {
  display: inline-flex;
  border-radius: var(
    --theme-button-split-border-radius
  ); /* needed for correct :hover style trigger below */

  & :slotted(.button.primary) {
    position: relative;
    margin-bottom: 0;

    /* best way to ensure flexible 1/4 corners */
    border-radius: var(--theme-button-split-border-radius) 0 0
      var(--theme-button-split-border-radius);

    &::after {
      content: "";
      display: block;
      position: absolute;
      width: 1px;
      height: calc(100% - 10px);
      right: 0;
      top: 5px;
      background-color: var(--theme-button-split-divider-color);
    }
  }

  & :slotted(.button.primary.compact) {
    /* best way to ensure flexible 1/4 corners also for a button in compact mode */
    border-radius: var(--theme-button-split-border-radius) 0 0
      var(--theme-button-split-border-radius);
  }

  &:hover,
  &:focus-within {
    & :slotted(.button) {
      &::after {
        display: none;
      }
    }
  }

  & :slotted(.submenu) {
    display: inline-flex;

    /* best way to ensure flexible 1/4 corners */
    border-radius: 0 var(--theme-button-split-border-radius)
      var(--theme-button-split-border-radius) 0;

    & .submenu-toggle {
      width: 32px;
      display: flex;
      align-items: center;
      justify-content: center;

      &.active,
      &:hover,
      &:focus {
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
  }
}
</style>
