<script>
import CodeExample from './demo/CodeExample';
import themeColorsCSS from '!!raw-loader!webapps-common/ui/css/variables/colors.css';

export default {
    components: {
        CodeExample
    },
    computed: {
        themeColorsCSS() {
            return themeColorsCSS;
        }
    }
};
</script>

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
          <div style="--bg: var(--knime-gray-dark); --font: white;">--knime-gray-dark</div>
          <div style="--bg: var(--knime-stone-gray); --font: white;">--knime-stone-gray</div>
          <div style="--bg: var(--knime-silver-sand);">--knime-silver-sand</div>
          <div style="--bg: var(--knime-gray-dark-semi);">--knime-gray-dark-semi</div>
          <div style="--bg: var(--knime-porcelain);">--knime-porcelain</div>
          <div style="--bg: var(--knime-gray-light-semi);">--knime-gray-light-semi</div>
          <div style="--bg: var(--knime-gray-ultra-light);">--knime-gray-ultra-light</div>
          <div style="--bg: var(--knime-white);">--knime-white</div>
          <div style="--bg: var(--knime-blue); --font: white;">--knime-blue</div>
          <div style="--bg: var(--knime-blue-semi);">--knime-blue-semi</div>
        </div>
        <p>
          To support theming, please always use the <code>--theme-color-x</code> variables instead of directly
          referencing the colors.
        </p>
        <div class="demo">
          <div style="--bg: var(--theme-color-error); --font: white;">--theme-color-error</div>
          <div style="--bg: var(--theme-color-success); --font: white;">--theme-color-success</div>
          <div style="--bg: var(--theme-color-info); --font: white;">--theme-color-info</div>
          <div style="--bg: var(--theme-color-running); --font: white;">--theme-color-running</div>
          <div style="--bg: var(--theme-color-action-required); --font: white;">--theme-color-action-required</div>
        </div>
        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
        <CodeExample summary="Show available color variables" language="css">{{ themeColorsCSS }}</CodeExample>
      </div>
    </div>
  </section>
</template>

<style scoped lang="postcss">
@import "webapps-common/ui/css/variables";

.demo {
  display: flex;
  flex-wrap: wrap;
  margin: -3px;

  & > div {
    --bg: none;
    --font: black;

    background: var(--bg);
    color: var(--font);
    padding: 1em;
    min-width: 10vmin;
    height: 10vmin;
    outline: 1px solid rgba(0, 0, 0, 0.1);
    text-align: center;
    line-height: calc(10vmin - 2em);
    font-weight: bold;
    flex-grow: 1;
    white-space: pre-wrap;
    margin: 4px;
  }
}
</style>
