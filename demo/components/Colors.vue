<script>
import CodeExample from './demo/CodeExample';
import colorsCSS from '!!raw-loader!webapps-common/ui/css/variables/knime-colors.css';

export default {
    components: {
        CodeExample
    },
    computed: {
        themeColorsCSS() {
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
        
        <h4>Primary Colors from the style guide</h4>
        <div class="demo">
          <div style="--bg: var(--knime-yellow);">--knime-yellow</div>
          <div style="--bg: var(--knime-masala); --font: white;">--knime-masala</div>
          <div style="--bg: var(--knime-dove-gray); --font: white;">--knime-dove-gray</div>
          <div style="--bg: var(--knime-silver-sand);">--knime-silver-sand</div>
          <div style="--bg: var(--knime-porcelain);">--knime-porcelain</div>
          <div style="--bg: var(--knime-white);">--knime-white</div>
        </div>
        
        <h4>Additional colors</h4>
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
        
        <h4>Secondary colors from the style guide</h4>
        <ul class="color-list">
          <li style="--bg: var(--knime-avocado-light);">--knime-avocado-light</li>
          <li style="--bg: var(--knime-avocado);">--knime-avocado</li>
          <li style="--bg: var(--knime-avocado-dark); --font: white;">--knime-avocado-dark</li>
          <li style="--bg: var(--knime-meadow-light);">--knime-meadow-light</li>
          <li style="--bg: var(--knime-meadow);">--knime-meadow</li>
          <li style="--bg: var(--knime-meadow-dark); --font: white;">--knime-meadow-dark</li>
          <li style="--bg: var(--knime-petrol-light);">--knime-petrol-light</li>
          <li style="--bg: var(--knime-petrol);">--knime-petrol</li>
          <li style="--bg: var(--knime-petrol-dark); --font: white;">--knime-petrol-dark</li>
          <li style="--bg: var(--knime-aquamarine-light);">--knime-aquamarine-light</li>
          <li style="--bg: var(--knime-aquamarine);">--knime-aquamarine</li>
          <li style="--bg: var(--knime-aquamarine-dark); --font: white;">--knime-aquamarine-dark</li>
          <li style="--bg: var(--knime-cornflower-light);">--knime-cornflower-light</li>
          <li style="--bg: var(--knime-cornflower); --font: white;">--knime-cornflower</li>
          <li style="--bg: var(--knime-cornflower-dark); --font: white;">--knime-cornflower-dark</li>
          <li style="--bg: var(--knime-lavender-light);">--knime-lavender-light</li>
          <li style="--bg: var(--knime-lavender); --font: white;">--knime-lavender</li>
          <li style="--bg: var(--knime-lavender-dark); --font: white;">--knime-lavender-dark</li>
          <li style="--bg: var(--knime-hibiscus-light);">--knime-hibiscus-light</li>
          <li style="--bg: var(--knime-hibiscus);">--knime-hibiscus</li>
          <li style="--bg: var(--knime-hibiscus-dark); --font: white;">--knime-hibiscus-dark</li>
          <li style="--bg: var(--knime-coral-light);">--knime-coral-light</li>
          <li style="--bg: var(--knime-coral); --font: white;">--knime-coral</li>
          <li style="--bg: var(--knime-coral-dark); --font: white;">--knime-coral-dark</li>
          <li style="--bg: var(--knime-carrot-light);">--knime-carrot-light</li>
          <li style="--bg: var(--knime-carrot); --font: white;">--knime-carrot</li>
          <li style="--bg: var(--knime-carrot-dark); --font: white;">--knime-carrot-dark</li>
          <li style="--bg: var(--knime-wood-light);">--knime-wood-light</li>
          <li style="--bg: var(--knime-wood);">--knime-wood</li>
          <li style="--bg: var(--knime-wood-dark); --font: white;">--knime-wood-dark</li>
          <li style="--bg: var(--knime-stone-light);">--knime-stone-light</li>
          <li style="--bg: var(--knime-stone);">--knime-stone</li>
          <li style="--bg: var(--knime-stone-dark); --font: white;">--knime-stone-dark</li>
        </ul>

        <h4>Node Backgorund Colors</h4>
        <p>To reference the colors use <code>--knime-node-my-node-type</code></p>
        <div class="node-demo">
          <div style="--bg: var(--knime-node-component);">Component</div>
          <div style="--bg: var(--knime-node-container);">Container</div>
          <div style="--bg: var(--knime-node-learner);">Learner</div>
          <div style="--bg: var(--knime-node-loop-start);">Loop Start</div>
          <div style="--bg: var(--knime-node-loop-end);">Loop End</div>
          <div style="--bg: var(--knime-node-manipulator);">Manipulator</div>
          <div style="--bg: var(--knime-node-metanode); --font: white;">Metanode</div>
          <div style="--bg: var(--knime-node-other);">Other</div>
          <div style="--bg: var(--knime-node-predictor);">Predictor</div>
          <div style="--bg: var(--knime-node-quick-form);">Quick Form</div>
          <div style="--bg: var(--knime-node-scope-start); --font: white;">Scope Start</div>
          <div style="--bg: var(--knime-node-scope-end); --font: white;">Scope End</div>
          <div style="--bg: var(--knime-node-sink); --font: white;">Sink</div>
          <div style="--bg: var(--knime-node-source); --font: white;">Source</div>
          <div style="--bg: var(--knime-node-virtual-in);">Virtual in</div>
          <div style="--bg: var(--knime-node-virtual-out);">Virtual out</div>
          <div style="--bg: var(--knime-node-visualizer); --font: white;">Visualizer</div>
        </div>
        
        <p>The following `--theme` colors should be used in place of '--knime' variables if theming is desired:</p>
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

.color-list {
  padding: 0;
  list-style: none;
  column-count: 3;


  & li {
    --bg: none;
    --font: black;

    background: var(--bg);
    color: var(--font);
    outline: 1px solid rgba(0, 0, 0, 0.1);
    margin-bottom: 6px;
    padding: 10px;
    font-weight: bold;
  }
}

.demo {
  display: flex;
  flex-wrap: wrap;
  margin: -3px;

  & > * {
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

.node-demo {
  display: flex;
  flex-wrap: wrap;

  & > * {
    width: 74px;
    height: 74px;
    border-radius: 2px;
    padding: 4px;
    background: var(--bg);
    color: var(--font);
    font-size: 18px;
    word-wrap: break-word;
    margin: 4px;
  }
}
</style>
