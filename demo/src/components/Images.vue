<script>
import ImagePreviews from "./demo/ImagePreviews.vue";
import CodeExample from "./demo/CodeExample.vue";

export default {
  components: {
    ImagePreviews,
    CodeExample,
  },
  data() {
    return {
      codeExample: `<img src="~@knime/styles/img/KNIME_Logo_gray.svg">

or e.g. inline as base64 in CSS:

<style>
.foo {
  background: url("~@knime/styles/img/KNIME_Logo_gray.svg?data") no-repeat 50% 50%;
}
</style>`,
    };
  },
  computed: {
    images() {
      const files = import.meta.glob("../../../packages/styles/img/*", {
        as: "url",
        eager: true,
      });
      return Object.keys(files).map((file) => ({
        name: file.replace("../../../packages/", "@knime/"),
        src: files[file],
      }));
    },
  },
};
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <ImagePreviews
          :images="images"
          width="200px"
          height="auto"
          checkerboard
        />
        <CodeExample summary="Show usage example">{{
          codeExample
        }}</CodeExample>
      </div>
    </div>
  </section>
</template>
