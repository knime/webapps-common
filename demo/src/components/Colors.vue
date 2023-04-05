<script>
import CodeExample from './demo/CodeExample.vue';
// eslint-disable-next-line import/extensions
import colorsCSS from 'webapps-common/ui/css/variables/knime-colors.css?raw';

export default {
    components: {
        CodeExample
    },
    computed: {
        colorsCSS() {
            return colorsCSS;
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

        <h4>Primary Colors from the corporate style guide</h4>
        <div class="demo">
          <div style="--bg: var(--knime-yellow);">--knime-yellow</div>
          <div style="--bg: var(--knime-masala); --font: white;">--knime-masala</div>
          <div style="--bg: var(--knime-dove-gray); --font: white;">--knime-dove-gray</div>
          <div style="--bg: var(--knime-silver-sand);">--knime-silver-sand</div>
          <div style="--bg: var(--knime-porcelain);">--knime-porcelain</div>
          <div style="--bg: var(--knime-white);">--knime-white</div>
        </div>

        <h4>Additional colors not defined in the corporate style guide</h4>
        <div class="demo">
          <div style="--bg: var(--knime-black); --font: white;">--knime-black</div>
          <div style="--bg: var(--knime-masala-semi); --font: white;">--knime-masala-semi</div>
          <div style="--bg: var(--knime-gray-dark); --font: white;">--knime-gray-dark</div>
          <div style="--bg: var(--knime-stone-gray); --font: white;">--knime-stone-gray</div>
          <div style="--bg: var(--knime-silver-sand-semi);">--knime-silver-sand-semi</div>
          <div style="--bg: var(--knime-gray-dark-semi);">--knime-gray-dark-semi</div>
          <div style="--bg: var(--knime-gray-light-semi);">--knime-gray-light-semi</div>
          <div style="--bg: var(--knime-gray-ultra-light);">--knime-gray-ultra-light</div>
        </div>

        <h4>Secondary colors from the corporate style guide</h4>
        <div class="demo">
          <div style="--bg: var(--knime-avocado-light);">--knime-avocado-light</div>
          <div style="--bg: var(--knime-avocado);">--knime-avocado</div>
          <div style="--bg: var(--knime-avocado-dark); --font: white;">--knime-avocado-dark</div>
          <div style="--bg: var(--knime-meadow-light);">--knime-meadow-light</div>
          <div style="--bg: var(--knime-meadow); --font: white;">--knime-meadow</div>
          <div style="--bg: var(--knime-meadow-dark); --font: white;">--knime-meadow-dark</div>
          <div style="--bg: var(--knime-petrol-light);">--knime-petrol-light</div>
          <div style="--bg: var(--knime-petrol); --font: white;">--knime-petrol</div>
          <div style="--bg: var(--knime-petrol-dark); --font: white;">--knime-petrol-dark</div>
          <div style="--bg: var(--knime-aquamarine-light);">--knime-aquamarine-light</div>
          <div style="--bg: var(--knime-aquamarine);">--knime-aquamarine</div>
          <div style="--bg: var(--knime-aquamarine-dark); --font: white;">--knime-aquamarine-dark</div>
          <div style="--bg: var(--knime-cornflower-light);">--knime-cornflower-light</div>
          <div style="--bg: var(--knime-cornflower-semi);">--knime-cornflower-semi</div>
          <div style="--bg: var(--knime-cornflower); --font: white;">--knime-cornflower</div>
          <div style="--bg: var(--knime-cornflower-dark); --font: white;">--knime-cornflower-dark</div>
          <div style="--bg: var(--knime-lavender-light);">--knime-lavender-light</div>
          <div style="--bg: var(--knime-lavender); --font: white;">--knime-lavender</div>
          <div style="--bg: var(--knime-lavender-dark); --font: white;">--knime-lavender-dark</div>
          <div style="--bg: var(--knime-hibiscus-light);">--knime-hibiscus-light</div>
          <div style="--bg: var(--knime-hibiscus); --font: white;">--knime-hibiscus</div>
          <div style="--bg: var(--knime-hibiscus-dark); --font: white;">--knime-hibiscus-dark</div>
          <div style="--bg: var(--knime-coral-light);">--knime-coral-light</div>
          <div style="--bg: var(--knime-coral); --font: white;">--knime-coral</div>
          <div style="--bg: var(--knime-coral-dark); --font: white;">--knime-coral-dark</div>
          <div style="--bg: var(--knime-carrot-light);">--knime-carrot-light</div>
          <div style="--bg: var(--knime-carrot); --font: white;">--knime-carrot</div>
          <div style="--bg: var(--knime-carrot-dark); --font: white;">--knime-carrot-dark</div>
          <div style="--bg: var(--knime-wood-light);">--knime-wood-light</div>
          <div style="--bg: var(--knime-wood); --font: white;">--knime-wood</div>
          <div style="--bg: var(--knime-wood-dark); --font: white;">--knime-wood-dark</div>
          <div style="--bg: var(--knime-stone-light);">--knime-stone-light</div>
          <div style="--bg: var(--knime-stone); --font: white;">--knime-stone</div>
          <div style="--bg: var(--knime-stone-dark); --font: white;">--knime-stone-dark</div>
        </div>

        <h4>Node Background Colors</h4>
        <p>
          These are aliases for the secondary colors defined above.
        </p>
        <div class="demo node">
          <div style="--bg: var(--knime-node-component);">--knime-node-component</div>
          <div style="--bg: var(--knime-node-configuration);">--knime-node-configuration</div>
          <div style="--bg: var(--knime-node-container);">--knime-node-container</div>
          <div style="--bg: var(--knime-node-learner);">--knime-node-learner</div>
          <div style="--bg: var(--knime-node-loop-start);">--knime-node-loop-start</div>
          <div style="--bg: var(--knime-node-loop-end);">--knime-node-loop-end</div>
          <div style="--bg: var(--knime-node-manipulator);">--knime-node-manipulator</div>
          <div style="--bg: var(--knime-node-metanode);">--knime-node-metanode</div>
          <div style="--bg: var(--knime-node-other);">--knime-node-other</div>
          <div style="--bg: var(--knime-node-predictor);">--knime-node-predictor</div>
          <div style="--bg: var(--knime-node-quick-form);">--knime-node-quick-form</div>
          <div style="--bg: var(--knime-node-scope-start);">--knime-node-scope-start</div>
          <div style="--bg: var(--knime-node-scope-end);">--knime-node-scope-end</div>
          <div style="--bg: var(--knime-node-sink);">--knime-node-sink</div>
          <div style="--bg: var(--knime-node-source);">--knime-node-source</div>
          <div style="--bg: var(--knime-node-virtual-in);">--knime-node-virtual-in</div>
          <div style="--bg: var(--knime-node-virtual-out);">--knime-node-virtual-out</div>
          <div style="--bg: var(--knime-node-visualizer);">--knime-node-visualizer</div>
          <div style="--bg: var(--knime-node-widget);">--knime-node-widget</div>
        </div>

        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
        <CodeExample summary="Show available color variables" language="css">{{ colorsCSS }}</CodeExample>
      </div>
    </div>
  </section>
</template>

<style scoped lang="postcss">
.color-list {
  padding: 0;
  list-style: none;
  column-count: 3;

  & li {
    --bg: none;
    --font: black;

    background: var(--bg);
    color: var(--font);
    outline: 1px solid rgb(0 0 0 / 10%);
    margin-bottom: 6px;
    padding: 10px;
    font-weight: bold;
  }
}

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
    outline: 1px solid rgb(0 0 0 / 10%);
    text-align: center;
    line-height: calc(10vmin - 2em);
    font-weight: bold;
    flex-grow: 1;
    white-space: pre-wrap;
    margin: 4px;
  }

  &.node > div {
    --bg: none;

    padding-bottom: 0;
    background: transparent;
    border-radius: 2px;
    border: none;
    height: auto;

    &::before {
      content: "";
      display: block;
      margin: auto;
      width: 5vmin;
      height: 5vmin;
      border-radius: 0.5vmin;
      background: var(--bg);
    }
  }
}
</style>
