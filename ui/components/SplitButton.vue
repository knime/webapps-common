<template>
  <div class="split-button">
    <slot />
  </div>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

.split-button {
  display: inline-flex;

  & > *:first-child {
    position: relative;
    margin-bottom: 0;
    border-radius: 9999px 0 0 9999px;

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

  &:active,
  &:hover,
  &:focus-within { /* TODO: good behaviour? */
    & >>> .button {
      &::after {
        display: none;
      }
    }
  }

  & >>> .popup {
    border-radius: 0 9999px 9999px 0;

    & .toggle-button {
      width: 32px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      /* display: block; */
      color: inherit;
      font-weight: inherit;
      background: transparent;
      padding: 0;
      border: 0 none;
      text-decoration: none;
      cursor: pointer;


      & svg {
        width: 14px;
        height: 14px;
        stroke-width: calc(32px / 14);
        stroke: var(--theme-color-masala);
      }
    }
  }
}
</style>
