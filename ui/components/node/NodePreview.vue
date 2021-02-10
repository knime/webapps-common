<script>
import PortIcon from './PortIcon';
import NodeTorsoNormal from './NodeTorsoNormal';

/**
 * SVG icon preview for a node or component, generated from its attributes
 */
export default {
    components: {
        PortIcon,
        NodeTorsoNormal
    },
    props: {
        /**
         * Type of node; determines the background color.
         * @example 'Reader'
         */
        type: {
            type: String,
            default: null
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
         * List of incoming ports
         * Port: {
         *    color: String (css-compatible),
         *    optional: Boolean,
         *    type: String,
         *    ...
         * }
         *
         * The port format is further described in
         * https://bitbucket.org/KNIME/knime-com-shared/src/master/com.knime.gateway.codegen/src-gen/api/web-ui/gateway.yaml#lines-545
         */
        inPorts: {
            type: Array,
            default: () => []
        },
        /**
         * List ouf outgoing ports
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
         * Passed through to NodeTorsoNormal
         */
        icon: {
            type: String,
            default: null,
            validator: url => url.startsWith('data:image/')
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
    methods: {
        // top edge of port icon relative to 32x32 background
        yPortShift(index, total) {
            const portSize = 9;
            const bgSize = 32;

            /* eslint-disable no-magic-numbers */
            let spacing = 1;
            if (total === 2) {
                spacing = 12;
            } else if (total === 3) {
                spacing = 1.5;
            }
            /* eslint-enable no-magic-numbers */

            let totalHeight = total * portSize + (total - 1) * spacing;
            let delta = (bgSize - totalHeight) / 2;
            return (spacing + portSize) * index + delta + portSize / 2;
        }
    }
};
</script>

<template>
  <svg :viewBox="viewBox">
    <NodeTorsoNormal
      :type="type"
      :icon="icon"
      :is-component="isComponent"
    />
    <PortIcon
      v-for="(port, index) in inPorts"
      :key="`in-${index}`"
      :color="port.color"
      :filled="!port.optional"
      :type="port.type"
      :transform="`translate(-4.5, ${ yPortShift(index, inPorts.length) })`"
    />
    <PortIcon
      v-for="(port, index) in outPorts"
      :key="`out-${index}`"
      :color="port.color"
      :filled="!port.optional"
      :type="port.type"
      :transform="`translate(36.5, ${ yPortShift(index, outPorts.length) })`"
    />
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
  </svg>
</template>
