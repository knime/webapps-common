<script>
import CodeExample from "./demo/CodeExample.vue";
import LinkList from "webapps-common/ui/components/LinkList.vue";
import code from "webapps-common/ui/components/LinkList.vue?raw";

const codeExample = `<LinkList
  :links="[
    { text: 'Google', url: 'https://google.com' },
    { text: 'KNIME Hub', url: 'https://hub.knime.com' }
  ]"
/>`;

export default {
  components: {
    LinkList,
    CodeExample,
  },
  computed: {
    codeExample() {
      return codeExample;
    },
    code() {
      return code;
    },
  },
};
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <p>
          A list of clickable links displayed with an arrow icon and text. On
          small screens there is one column of links. On larger screens there
          are two.
        </p>
        <LinkList
          :links="[
            { text: 'Google', url: 'https://google.com' },
            { text: 'KNIME Hub', url: 'https://hub.knime.com' },
          ]"
        />
        <CodeExample summary="Show usage example">{{
          codeExample
        }}</CodeExample>
        <CodeExample summary="Show LinkList.vue source code">{{
          code
        }}</CodeExample>
      </div>
    </div>
  </section>
</template>
