<script>
import Description from '../../../ui/components/Description.vue';

export default {
    components: {
        Description
    },
    props: {
        link: {
            required: true,
            type: String
        },
        name: {
            required: true,
            type: String
        },
        description: {
            default: 'For the module\'s documentation, please look at the npm module page itself:',
            type: String
        }
    }
};
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <h2>{{ name }}</h2>
        <Description>
          <p>{{ description }}</p>
          <a :href="link">{{ link }}</a>
        </Description>
      </div>
    </div>
  </section>
</template>

