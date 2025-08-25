<template>
  <div class="no-versions-item">No version created yet</div>
</template>

<style lang="postcss" scoped>
.no-versions-item {
  font-weight: 300;
  font-size: 12px;
  line-height: 15px;
  padding-top: 4px;

  &::after {
    content: "";
    position: absolute;
    left: -4px;
    top: 11px;
    background-color: var(--knime-masala);
    width: 6px;
    height: 6px;
    border-radius: 100%;
  }
}
</style>
