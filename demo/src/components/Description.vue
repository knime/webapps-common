<script>
import CodeExample from "./demo/CodeExample.vue";
import Description from "webapps-common/ui/components/Description.vue";
import code from "webapps-common/ui/components/Description.vue?raw";

export default {
  components: {
    Description,
    CodeExample,
  },
  data() {
    return {
      codeExample: `<Description>Text with <b>HTML code</b> via slot.</Description>

<Description :text="htmlString" renderAsHtml />`,
    };
  },
  computed: {
    code() {
      return code;
    },
  },
};
</script>

<template>
  <div>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <p>
            The Description component provides styling for rich-text markup (see
            component code for details)…
          </p>
        </div>
      </div>
    </section>
    <section class="demo">
      <div class="grid-container">
        <Description class="description grid-item-12">
          <h5>Links</h5>
          <p>
            <a href="/">Internal link</a> or
            <a href="https://www.knime.com/">External link</a>
          </p>

          <h5>Lists</h5>
          <ol>
            <li>Aggregation method (count, summary, average)</li>
            <li>Pie size</li>
            <li>Show missing value section</li>
            <li>Show pie section outline</li>
          </ol>
          <ul>
            <li>
              <b>Replace outlier values:</b> Allows to replace outliers based on
              the selected "Replacement strategy"
            </li>
            <li>
              <b>Remove outlier rows:</b>
              Removes all rows from the input data that contain in any of the
              selected columns at least one outlier
            </li>
            <li>
              <b>Remove non-outlier rows:</b>
              Retains only those rows of the input data that contain at least
              one outlier in any of the selected columns
            </li>
          </ul>

          <h5>Table</h5>
          <table>
            <tbody>
              <tr>
                <th>level0</th>
                <th>level1</th>
                <th>level2</th>
                <th>value</th>
              </tr>
              <tr>
                <td>Carnivora</td>
                <td>Felidae</td>
                <td>Panthera</td>
                <td>10</td>
              </tr>
              <tr>
                <td>Carnivora</td>
                <td>Mustelidae</td>
                <td>Mephitis</td>
                <td>6</td>
              </tr>
              <tr>
                <td>Carnivora</td>
                <td>Mustelidae</td>
                <td>Lutra</td>
                <td>7</td>
              </tr>
              <tr>
                <td>Carnivora</td>
                <td>Canidae</td>
                <td>?</td>
                <td>14</td>
              </tr>
            </tbody>
          </table>

          <h5>Code & Pre</h5>
          <pre>
var svgElement = document.getElementById("mySVG");
knimeService.inlineSvgStyles(svgElement);
return (new XMLSerializer()).serializeToString(svgElement);</pre
          >

          <p>or <code>inline code</code></p>
          <h5>Definition list</h5>
          <dl>
            <dt>knimeNode:</dt>
            <dd>The knimeNode must have the correct namespace.</dd>
            <dt>views:</dt>
            <dd>Explains what is displayed in the view.</dd>
          </dl>
        </Description>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{
            codeExample
          }}</CodeExample>
          <CodeExample summary="Show Description.vue source code">{{
            code
          }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="postcss" scoped>
section.demo {
  background-color: var(--knime-porcelain);
}
</style>
