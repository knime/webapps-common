<script setup lang="ts">
import { ref } from "vue";

import { AutoPlayVideo } from "@knime/components";

import CodeExample from "./demo/CodeExample.vue";

const started = ref(false);

const codeExample = `<AutoPlayVideo aspect-ratio="16:9">
  <source
    src="https://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4"
    type="video/mp4"
  />
  </AutoPlayVideo>`;
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <p>
          Plays a video on render. Videos have a fixed aspect ratio 256:135 or
          16:10 or 16:9.
        </p>
        <p class="toggle">
          <a href="#" @click.prevent="started = !started"
            >Toggle AutoPlayVideo component</a
          >
        </p>

        <div class="examples">
          <AutoPlayVideo v-if="started" aspect-ratio="16:9">
            <source
              src="https://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4"
              type="video/mp4"
            />
          </AutoPlayVideo>
        </div>

        <CodeExample summary="Show usage example">{{
          codeExample
        }}</CodeExample>
      </div>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
p {
  margin: 0;
}

.examples {
  max-width: 250px;
}

.toggle {
  padding: 10px 0;
}
</style>
