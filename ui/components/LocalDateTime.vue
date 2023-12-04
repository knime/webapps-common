<script>
import { formatLocalDateTimeString } from './../../util/format';

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
            localDateTime: this.date,
            processing: true
        };
    },

    watch: {
        date(newDate, oldDate) {
            if (newDate !== oldDate) {
                this.localDateTime = formatLocalDateTimeString(newDate, this.showTime);
            }
        }
    },
    mounted() {
        this.localDateTime = formatLocalDateTimeString(this.date, this.showTime);
        this.processing = false;
    }
};
</script>

<template>
  <time
    :title="date"
    :datetime="date"
    :class="{ hidden: processing }"
  >{{ localDateTime }}</time>
</template>

<style scoped>
.hidden{
    visibility: hidden
}

</style>

