<script>
import PortIcon from './PortIcon2';
import backgroundFillColors from '../../colors/nodeColors';

const backgroundPaths = {
    // paths extracted from
    // https://bitbucket.org/KNIME/knime-workbench/src/bb437123743b220db34e39e4ffd887a307276ff8/org.knime.workbench.editor/icons/node/*.svg
    default: 'M0,29.2L0,2.8C0,1.3,1.3,0,2.8,0l26.3,0C30.7,0,32,1.3,32,2.8v26.3c0,1.6-1.3,2.8-2.8,2.8H2.8C1.3,32,0,30.' +
        '7,0,29.2z',
    LoopEnd: 'M32,2.8v26.3c0,1.6-1.3,2.8-2.8,2.8H4L0,16.1L4,0l25.2,0C30.7,0,32,1.3,32,2.8z',
    LoopStart: 'M0,29.2L0,2.8C0,1.3,1.3,0,2.8,0L32,0l-4,15.9L32,32H2.8C1.3,32,0,30.7,0,29.2z',
    ScopeEnd: 'M32,2.8v26.3c0,1.6-1.3,2.8-2.8,2.8H4L0,16.1L4,0l25.2,0C30.7,0,32,1.3,32,2.8z',
    ScopeStart: 'M0,29.2L0,2.8C0,1.3,1.3,0,2.8,0L32,0l-4,15.9L32,32H2.8C1.3,32,0,30.7,0,29.2z',
    VirtualIn: 'M32,2.8v26.3c0,1.6-1.3,2.8-2.8,2.8H6.5L0,25.9l5.2-10L0.7,7.2L6.5,0l22.7,0C30.7,0,32,1.3,32,2.8z',
    VirtualOut: 'M0,29.2L0,2.8C0,1.3,1.3,0,2.8,0L32,0l-5.8,7.2l4.5,8.7l-5.2,10L32,32H2.8C1.3,32,0,30.7,0,29.2z'
};

/**
 * SVG icon preview for a node or component, generated from its attributes
 */
export default {
    components: {
        PortIcon
    },
    /** Hub-Format of Ports expected */
    props: {
        /**
         * Type of node; determines the background color.
         * @example 'Reader'
         */
        nodeType: {
            type: String,
            default: ''
        },
        /**
         * Use alternative rendering style:
         * Components always have a gray background and a smaller rectangle whose background indicates the node type
         */
        isComponent: {
            type: Boolean,
            default: false
        },
        /**
         * List ouf incoming ports as received from API
         */
        inPorts: {
            type: Array,
            default: () => []
        },
        /**
         * List ouf outgoing ports as received from API
         */
        outPorts: {
            type: Array,
            default: () => []
        },
        /**
         * Show three dots to indicate dynamic ports
         */
        hasDynPorts: {
            type: Boolean,
            default: false
        },
        /**
         * URL of icon that is rendered inside the node. (Possibly `data:` URL)
         */
        icon: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            /*
            * Port icon size is 9x9 including stroke, background size is 32x32.
            * A height of 70 leaves whitespace and the top and bottom of the background, and allows for up to 7 ports
            * (i.e. Community Nodes > OpenMS > Utilities > SpectraSTSearchAdapter)
            * Keep in sync with iconRenderer:svgSize
            */
            viewBox: '-19 -19 70 70'
        };
    },
    computed: {
        unknownNodeColor() {
            return '#DC2C87'; // "unknown"
        },
        backgroundPath() {
            return backgroundPaths[this.nodeType] || backgroundPaths.default;
        },
        backgroundFill() {
            // Components always have a gray background
            if (this.isComponent) {
                return backgroundFillColors.Component;
            }
            return backgroundFillColors[this.nodeType] || this.unknownNodeColor;
        },
        innerFill() {
            // Nodes have no inner fill
            if (!this.isComponent) {
                return null;
            }
            return backgroundFillColors[this.nodeType];
        }
    },
    methods: {
        // top edge of port icon relative to 32x32 background
        yPortShift(index, total) {
            const portSize = 9;
            const bgSize = 32;

            /* eslint-disable no-magic-numbers */
            let spacing = 1;
            if (total === 2) {
                spacing = 6;
            } else if (total === 3) {
                spacing = 2;
            }

            let totalHeight = total * portSize + (total - 1) * spacing;
            let delta = (bgSize - totalHeight) / 2;
            return (spacing + portSize) * index + delta + portSize / 2;
        }
    }
};
</script>

<template>
  <svg :viewBox="viewBox">
    <path
      :d="backgroundPath"
      :fill="backgroundFill"
    />
    <path
      v-if="innerFill"
      :d="backgroundPath"
      :fill="innerFill"
      transform="translate(16 16) scale(.75) translate(-16 -16)"
    />
    <g transform="translate(-5)">
      <PortIcon
        v-for="(port, index) in inPorts"
        :key="index"
        :color="port.color"
        :filled="!port.optional"
        :data-type="port.dataType"
        :transform="`translate(0, ${ yPortShift(index, inPorts.length) })`"
      />
    </g>
    <g transform="translate(37)">
      <PortIcon
        v-for="(port, index) in outPorts"
        :key="index"
        :color="port.color"
        :filled="!port.optional"
        :data-type="port.dataType"
        :transform="`translate(0, ${ yPortShift(index, outPorts.length) })`"
      />
    </g>
    <g
      v-if="hasDynPorts"
      stroke="none"
    >
      <circle
        r="1.2"
        cx="4"
        cy="27"
      />
      <circle
        r="1.2"
        cx="9"
        cy="27"
      />
      <circle
        r="1.2"
        cx="14"
        cy="27"
      />
    </g>
    <image
      v-if="icon"
      x="8"
      y="8"
      width="16"
      height="16"
      :xlink:href="icon"
    />
  </svg>
</template>
