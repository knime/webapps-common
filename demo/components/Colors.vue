<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <h2>Colors</h2>
        <p>The following colors are pre-defined:</p>
        <div class="demo">
          <div style="--bg: var(--knime-yellow);">--knime-yellow</div>
          <div style="--bg: var(--knime-masala); --font: white;">--knime-masala</div>
          <div style="--bg: var(--knime-dove-gray); --font: white;">--knime-dove-gray</div>
          <div style="--bg: var(--knime-silver-sand);">--knime-silver-sand</div>
          <div style="--bg: var(--knime-porcelain);">--knime-porcelain</div>
          <div style="--bg: var(--knime-white);">--knime-white</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="postcss">
@import "../../ui/css/variables";

.demo {
  display: flex;

  & > div {
    --bg: none;
    --font: black;

    min-width: 10vmin;
    height: 10vmin;
    outline: 1px solid rgba(0, 0, 0, 0.1);
    text-align: center;
    line-height: 10vmin;
    font-weight: bold;
    flex-grow: 1;
    margin: 0 3px;
    background: var(--bg);
    color: var(--font);

    &:first-child {
      margin-left: 0;
    }

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
