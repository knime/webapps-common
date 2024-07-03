<script>
import { Description } from "@knime/components";

export default {
  components: {
    Description,
  },
  props: {
    link: {
      required: true,
      type: String,
    },
    description: {
      default: "See npm package:",
      type: String,
    },
  },
};
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <Description>
          <p>{{ description }}</p>
          <a :href="link">{{ link }}</a>
        </Description>
      </div>
    </div>
  </section>
</template>
