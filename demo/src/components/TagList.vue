<script>
import { TagList } from "@knime/components";

import CodeExample from "./demo/CodeExample.vue";
// import code from "webapps-common/ui/components/TagList.vue?raw";
const code = "";

const codeExample = `<TagList
  :tags="['Apple', 'Banana', 'Guanábana', 'Papaya', 'Mango', 'Granadilla']"
  :number-of-initial-tags="3"
  clickable
  activeTags="['Banana', 'Papaya']"
  @click="onTagClick"
/>`;

export default {
  components: {
    TagList,
    CodeExample,
  },
  data() {
    return {
      codeExample,
    };
  },
  computed: {
    code() {
      return code;
    },
  },
  methods: {
    onTagClick(tag) {
      alert(`clicked tag: ${tag}`);
    },
  },
};
</script>

<template>
  <div>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <p>
            Displays a list of tags with support for only showing a maximal
            number of tags via the
            <code>numberOfInitialTags</code> prop. Optionally it is possible to
            display active tags. Tags can be clickable by enabling the
            <code>clickable</code> prop.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-12">
          <TagList
            :tags="[
              'Apple',
              'Banana',
              'Guanábana',
              'Papaya',
              'Mango',
              'Granadilla',
            ]"
            :number-of-initial-tags="3"
            clickable
            active-tags="['Banana', 'Papaya']"
            @click="onTagClick"
          />
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{
            codeExample
          }}</CodeExample>
          <CodeExample summary="Show TagList.vue source code">{{
            code
          }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="postcss" scoped></style>
