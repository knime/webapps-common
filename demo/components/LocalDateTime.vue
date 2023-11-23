<script>
import LocalDateTime from '../../ui/components/LocalDateTime.vue';


export default {
    components: {
        LocalDateTime
    }
};

</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <h2>LocalDateTime</h2>

        <h5>UTC date format</h5>
        <p>Original Date: 2023-10-27T11:17:42.460Z </p>
        <p>Converted to local time: <LocalDateTime date="2023-10-27T11:17:42.460Z" /></p>

        <h5>Timezone date format</h5>
        <p>Original Date: 2023-01-23T09:15:28+00:00 </p>
        <p>Converted to local time: <LocalDateTime date="2023-01-23T09:15:28+00:00" /></p>
      </div>
    </div>
    <!-- usage example to be added -->
  </section>
</template>

<style lang="postcss" scoped>
</style>
