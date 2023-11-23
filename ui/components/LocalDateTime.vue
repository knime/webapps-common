<script>
import { parseToLocalTime } from './../../util/format';

export default {

    props: {
        date: {
            type: String,
            default: ''
        },
        showTime: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            localDateTime: ''
        };
    },
    mounted() {
        this.localDateTime = parseToLocalTime(this.date, this.showTime);
    }
};
</script>

<template>
  <span>{{ localDateTime }}</span>
</template>

