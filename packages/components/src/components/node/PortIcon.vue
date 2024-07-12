<script>
import * as portColors from "@knime/styles/colors/portColors";

const portSize = 9; // 9px
const strokeWidth = 1.4; // 1.4px

/** Draws a Node's port. Either a triangle, circle or square */
export default {
  props: {
    /**
     * Distinguish between 'table', 'flowVariable' and other types of ports
     * Determines the shape of the port:
     *   table -> triangle
     *   flowVariable -> circle
     *   default -> square
     */
    type: {
      type: String,
      default: "table",
    },
    /**
     * Shape fill color. Format has to be valid for css. Only used by square ports.
     * Tables are always black, flow variables always red.
     */
    color: {
      type: String,
      default: "",
    },
    filled: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    portSize() {
      return portSize;
    },
    strokeWidth() {
      return strokeWidth;
    },
    trianglePath() {
      // draw triangle around middle point
      let [x1, y1, x2, y3] = [
        -portSize / 2,
        -portSize / 2,
        portSize / 2,
        portSize / 2,
      ];

      // y and d are chosen so the triangle (including strokeWidth) fits precisely in the 9x9 port
      /* eslint-disable no-magic-numbers */
      const d = Math.sqrt(5) / 2;
      const y = d / 2 + 1 / 4;
      /* eslint-enable no-magic-numbers */

      // move points towards the center of the triangle according to strokeWidth
      let { strokeWidth } = this;
      x1 += strokeWidth / 2;
      x2 -= strokeWidth * d; /* eslint-disable-line no-magic-numbers */
      y1 += strokeWidth * y; /* eslint-disable-line no-magic-numbers */
      y3 -= strokeWidth * y; /* eslint-disable-line no-magic-numbers */

      // draw triangle clock-wise
      return `${x1},${y1} ${x2},${0} ${x1},${y3}`;
    },
    portColor() {
      return portColors[this.type] || this.color;
    },
    fillColor() {
      return this.filled ? this.portColor : "transparent";
    },
  },
};
</script>

<template>
  <!-- data table port -->
  <polygon
    v-if="type === 'table'"
    :points="trianglePath"
    :fill="fillColor"
    :stroke="portColor"
    :stroke-width="strokeWidth"
    v-bind="$attrs"
  />
  <!-- flow variable port -->
  <circle
    v-else-if="type === 'flowVariable'"
    :r="portSize / 2 - strokeWidth / 2"
    :fill="fillColor"
    :stroke="portColor"
    :stroke-width="strokeWidth"
    v-bind="$attrs"
  />
  <!-- other port -->
  <rect
    v-else
    :width="portSize - strokeWidth"
    :height="portSize - strokeWidth"
    :x="-portSize / 2 + strokeWidth / 2"
    :y="-portSize / 2 + strokeWidth / 2"
    :fill="fillColor"
    :stroke="portColor"
    :stroke-width="strokeWidth"
    v-bind="$attrs"
  />
</template>
