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
  --horizontal-dialog-padding: var(--space-16);

  flex-grow: 1;
  display: flex;
  flex-direction: column;

  /* We need enough padding bottom to reserve space for error messages */
  padding: 0 var(--horizontal-dialog-padding)
    var(--error-message-min-reserved-space);
  overflow: hidden;
  overflow-y: auto;

  &:focus {
    outline: none;
  }
}
</style>
