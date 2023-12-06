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
            // formatting and hiding the date first to reserve the correct space and avoid content jumping once date is mounted.
            localDateTime: formatLocalDateTimeString(this.date, this.showTime),
            hidden: true
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
        // after mounted the date is shown and hidden set to false
        this.hidden = false;
    }
};
</script>

<template>
  <time
    :title="date"
    :datetime="date"
    :class="{ hidden: hidden }"
  >{{ localDateTime }}</time>
</template>

<style scoped>
.hidden{
    visibility: hidden
}

</style>

