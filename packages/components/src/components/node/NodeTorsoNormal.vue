<script>
import * as nodeBackgroundColors from "@knime/styles/colors/nodeColors";
import { HibiscusDark as colorHibiscusDark } from "@knime/styles/colors/knimeColors";

const nodeSize = 32;
const backgroundPaths = {
  default:
    "M0,29.2L0,2.8C0,1.3,1.3,0,2.8,0l26.3,0C30.7,0,32,1.3,32,2.8v26.3c0,1.6-1.3,2.8-2.8,2.8H2.8C1.3,32,0,30." +
    "7,0,29.2z",
  LoopEnd:
    "M32,2.8v26.3c0,1.6-1.3,2.8-2.8,2.8H4L0,16.1L4,0l25.2,0C30.7,0,32,1.3,32,2.8z",
  LoopStart:
    "M0,29.2L0,2.8C0,1.3,1.3,0,2.8,0L32,0l-4,15.9L32,32H2.8C1.3,32,0,30.7,0,29.2z",
  ScopeEnd:
    "M32,2.8v26.3c0,1.6-1.3,2.8-2.8,2.8H4L0,16.1L4,0l25.2,0C30.7,0,32,1.3,32,2.8z",
  ScopeStart:
    "M0,29.2L0,2.8C0,1.3,1.3,0,2.8,0L32,0l-4,15.9L32,32H2.8C1.3,32,0,30.7,0,29.2z",
  VirtualIn:
    "M32,2.8v26.3c0,1.6-1.3,2.8-2.8,2.8H6.5L0,25.9l5.2-10L0.7,7.2L6.5,0l22.7,0C30.7,0,32,1.3,32,2.8z",
  VirtualOut:
    "M0,29.2L0,2.8C0,1.3,1.3,0,2.8,0L32,0l-5.8,7.2l4.5,8.7l-5.2,10L32,32H2.8C1.3,32,0,30.7,0,29.2z",
};
export const componentBackgroundPortion = 0.75;

/**
 * Draws the Torso (colored rounded rectangle with icon) of a Node or Component
 * This Component only draws regular Nodes/Components, no Metanodes, no Unknown nor Missing Nodes
 */
export default {
  name: "NodeTorsoNormal",
  props: {
    /**
     * Node type, e.g. "Learner", "Visualizer"
     * as defined in org.knime.core.node.NodeFactory.NodeType.
     * Is undefined for MetaNodes
     */
    type: { type: String, default: null },
    /**
     * Differentiate between a native node and a component node
     */
    isComponent: {
      type: Boolean,
      default: false,
    },
    /**
     * data-url containing Base64-encoded icon
     */
    icon: {
      type: String,
      default: null,
      validator: (url) => url.startsWith("data:image/"),
    },
  },
  computed: {
    backgroundPath() {
      return backgroundPaths[this.type] || backgroundPaths.default;
    },
    backgroundColor() {
      // In case of unknown type, use Hibiscus Dark
      return nodeBackgroundColors[this.type] || colorHibiscusDark;
    },
    componentColor() {
      return nodeBackgroundColors.Component;
    },
    componentBackgroundTransformation() {
      let offset = nodeSize / 2;
      let scaleFactor = componentBackgroundPortion;
      return `translate(${offset}, ${offset}) scale(${scaleFactor}) translate(-${offset}, -${offset})`;
    },
  },
};
</script>

<template>
  <g>
    <path
      class="bg"
      :d="backgroundPath"
      :fill="isComponent ? componentColor : backgroundColor"
    />
    <!-- components may have two layers of background. This is the inner part, a shrunk version of the outer frame -->
    <path
      v-if="isComponent && type"
      class="bg"
      :d="backgroundPath"
      :fill="backgroundColor"
      :transform="componentBackgroundTransformation"
    />
    <image
      v-if="icon"
      :xlink:href="icon"
      x="8"
      y="8"
      width="16"
      height="16"
      pointer-events="none"
    />
  </g>
</template>
