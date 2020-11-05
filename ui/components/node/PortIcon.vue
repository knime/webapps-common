<script>
import portColors from '../../colors/portColors';

const portSize = 9; // 9px

export default {
    props: {
        /** Distinguish between 'table', 'flowVariable' and other types of ports */
        dataType: {
            type: String,
            default: 'table',
            validator: (dataType) => ['table', 'flowVariable', 'other'].includes(dataType)
        },
        /** Format has to be valid for css. Only used by square ports (dataType: 'other') */
        color: {
            type: String,
            default: ''
        },
        filled: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        portSize() {
            return portSize;
        },
        trianglePath() {
            let [x1, y1, x2, y3] = [-portSize / 2, -portSize / 2, portSize / 2, portSize / 2];

            // adjust size of triangle so that filled and bordered triangle match, and the line width is exactly 1
            x1 += 1 / 2;
            y1 += (1 + Math.sqrt(5)) / 4; /* eslint-disable-line no-magic-numbers */
            x2 -= Math.sqrt(5) / 2; /* eslint-disable-line no-magic-numbers */
            y3 -= (1 + Math.sqrt(5)) / 4; /* eslint-disable-line no-magic-numbers */

            return `${x1},${y1} ${x2},${0} ${x1},${y3}`;
        },
        portColor() {
            return portColors[this.dataType] || this.color;
        }
    }
};
</script>

<template>
  <!-- data table port -->
  <polygon
    v-if="dataType === 'table'"
    :points="trianglePath"
    :fill="filled ? portColor : 'white'"
    :stroke="portColor"
  />
  <!-- flow variable port -->
  <circle
    v-else-if="dataType === 'flowVariable'"
    :r="portSize / 2 - 0.5"
    :fill="filled ? portColor : 'white'"
    :stroke="portColor"
  />
  <!-- other port -->
  <rect
    v-else
    :width="portSize - 1"
    :height="portSize - 1"
    :x="-portSize / 2 + 0.5"
    :y="-portSize / 2 + 0.5"
    :fill="filled ? portColor: 'white'"
    :stroke="portColor"
  />
</template>
