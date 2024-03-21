// A layout component for listing settings in a consistently styled way. // Use
the bottom-content slot to fix content like buttons to the bottom of the
container
<template>
  <div class="flex-wrapper">
    <div class="form">
      <slot />
    </div>
    <slot name="bottom-content" />
  </div>
</template>

<style scoped lang="postcss">
.flex-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.form {
  --horizontal-dialog-padding: 20px;

  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 0 var(--horizontal-dialog-padding);
  overflow: hidden;
  overflow-y: auto;

  &:focus {
    outline: none;
  }

  /* if a dialog starts with a section header we don't need extra top padding, otherwise adding it here */
  &:not(
      :has(
          > .vertical-layout
            > .vertical-layout-item:first-child
            > div
            > .section:first-child
        )
    ) {
    padding-top: 11px;
  }

  /* TODO: UIEXT-1061 workaround to make the last dialog element fill the remaining height, used in RichTextInput */

  & .vertical-layout:last-child {
    display: flex;
    flex-direction: column;
    flex: 1;

    & :deep(.vertical-layout-item:last-child) {
      display: flex;
      flex-direction: column;
      flex: 1;
    }
  }
}
</style>
