<script>
const portSize = 9;
const bgSize = 32;

const strokeWidth = 1.4; // can be adjusted without breaking anything

export default {
    props: {
        color: {
            type: String,
            default: ''
        },
        optional: {
            type: Boolean,
            default: false
        },
        dataType: {
            type: String,
            default: 'Data'
        },
        index: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            default: 1
        },
        autoAlign: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            strokeWidth
        };
    },
    computed: {
        strokeColor() {
            return `#${this.color}`;
        },
        fillColor() {
            return this.optional ? 'none' : this.strokeColor;
        },
        // top edge of port icon relative to 32x32 background
        yPosition() {
            /* eslint-disable no-magic-numbers */
            let spacing = 1;
            if (this.total === 2) {
                spacing = 6;
            } else if (this.total === 3) {
                spacing = 2;
            }
            let totalHeight = this.total * portSize + (this.total - 1) * spacing;
            let delta = (bgSize - totalHeight) / 2;
            return (spacing + portSize) * this.index + delta;
        },
        path() {
            switch (this.dataType) {
            case 'Data': {
                // triangle
                // y and d are chosen so the triangle (including strokeWidth) fits precisely in the 9x9 port
                const d = Math.sqrt(5) / 2;
                const y = d / 2 + 1 / 4;
                return `M${strokeWidth / 2},${strokeWidth * y}v${portSize - 2 * strokeWidth * y}` +
                  `L${portSize - strokeWidth * d},${portSize / 2}z`;
            }
            case 'Flow Variable': {
                // circle
                const r = (portSize - strokeWidth) / 2;
                return `M${strokeWidth / 2},4.5a${r},${r} 0 1,0 ${2 * r},0a${r},${r} 0 1,0 -${2 * r},0`;
            }
            default:
                // square
                return `M${strokeWidth / 2},${strokeWidth / 2}v${portSize - strokeWidth}` +
                  `h${portSize - strokeWidth}v-${portSize - strokeWidth}z`;
            }
        }
    }
};
</script>

<template>
  <path
    :fill="fillColor"
    :stroke="strokeColor"
    :d="path"
    :transform="autoAlign ? `translate(0, ${yPosition})` : null"
    :stroke-width="strokeWidth"
  />
</template>
