<script>
import PortIcon2 from './PortIcon2';

const portSize = 9;
const bgSize = 32;

export default {
    components: {
        PortIcon2
    },
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
            portSize
        };
    },
    computed: {
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
        translatedType() {
            switch (this.dataType) {
                case 'Data':
                    return 'table';
                case 'Flow Variable':
                    return 'flowVariable';
                default:
                    return 'other';
            }
        }
    }
};
</script>

<template>
    <PortIcon2 
        :color="'#' + color"
        :filled="!optional"
        :dataType="translatedType"
        :transform="`translate(${portSize / 2}, ${(autoAlign ? yPosition : 0) + portSize / 2})`"
    />
</template>
