<template>
  <div class="no-versions-item">No version created yet</div>
</template>

<style lang="postcss" scoped>
.no-versions-item {
  padding-top: 4px;
  font-size: 12px;
  font-weight: 300;
  line-height: 15px;

  &::after {
    position: absolute;
    top: 11px;
    left: -4px;
    width: 6px;
    height: 6px;
    content: "";
    background-color: var(--knime-masala);
    border-radius: 100%;
  }
}
</style>
