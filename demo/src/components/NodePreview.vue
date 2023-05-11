<script>
import CodeExample from "./demo/CodeExample.vue";
import NodePreview from "webapps-common/ui/components/node/NodePreview.vue";
import sourceCode from "webapps-common/ui/components/node/NodePreview.vue?raw";

const icon =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAsklEQVR4nGNgoBUwMDBwMDIyakDGIDFiN" +
  "AqAFJuYmGAoBoonAPEEoBoFilwHNLyeaEMMIEABTUzA2Nh4PooA0Gn12JwN8jc2cZAYWBxoUgBQcwGQnoBiKgEDYGEFF4CGsgIooIgxAKYHOweLT" +
  "egGE20AkkEGQC+uRzNgApwDDxQiAchFGOpRTMTvGlA0YqqFBmIBIc2wAMelQAFo+n5s6R4kBrKZqFQITR8omYmUMCIaAAD0RELelYkiBgAAAABJR" +
  "U5ErkJggg==";

const codeExample = `<NodePreview
  :hasDynPorts="false"
  isComponent
  type="Sink"
  :inPorts="[{ type: 'table' }]"
  :outPorts="[
      { type: 'other', color: '#1eb9dc' },
      { type: 'table' },
      { type: 'table', optional: true }
  ]"
  icon="${icon}"
/>`;

export default {
  components: {
    NodePreview,
    CodeExample,
  },
  data() {
    return {
      codeExample,
      nodePreview: {
        hasDynPorts: true,
        isComponent: false,
        type: "Learner",
        inPorts: [{ type: "table" }],
        outPorts: [
          { type: "other", color: "#1eb9dc" },
          { type: "table", optional: true },
        ],
        icon,
      },
      componentPreview: {
        hasDynPorts: false,
        isComponent: true,
        type: "Sink",
        inPorts: [{ type: "table" }],
        outPorts: [
          { type: "other", color: "#1eb9dc" },
          { type: "table" },
          { type: "table", optional: true },
        ],
        icon,
      },
    };
  },
  computed: {
    sourceCode() {
      return sourceCode;
    },
  },
};
</script>

<template>
  <div>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <h2>NodePreview</h2>
          <p>
            A component that draws a Node (left, with dynamic ports) or a
            Component (right).<br />
            This Component only draws regular nodes/components, no Metanodes, no
            Unknown nor Missing Nodes.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-12 demo-items">
          <div>
            <NodePreview v-bind="nodePreview" />
          </div>
          <div>
            <NodePreview v-bind="componentPreview" />
          </div>
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{
            codeExample
          }}</CodeExample>
          <CodeExample summary="Show NodePreview.vue source code">{{
            sourceCode
          }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="postcss" scoped>
.demo-items {
  display: flex;
  justify-content: flex-start;

  & > div {
    outline: 1px solid var(--knime-silver-sand);
    margin-right: 20px;

    & svg {
      width: 130px;
    }
  }
}
</style>
