<script>
import CodeExample from './demo/CodeExample';
import LinkList from '../../ui/components/LinkList';
import code from '!!raw-loader!../../ui/components/LinkList';

const codeExample = `<LinkList
  :links="[
    { text: 'Google', url: 'https://google.com' },
    { text: 'Knime Hub', url: 'https://hub.knime.com' }
  ]"
/>`;

export default {
    components: {
        LinkList,
        CodeExample
    },
    computed: {
        codeExample() {
            return codeExample;
        },
        code() {
            return code;
        }
    }
};
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <h2>LinkList</h2>
        <p>
          A list of clickable links displayed with an arrow icon and text.
          On small screens there is on column of links. On larger screens there are two.
        </p>
        <LinkList
          :links="[
            { text: 'Google', url: 'https://google.com' },
            { text: 'Knime Hub', url: 'https://hub.knime.com' }
          ]"
        />
        <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
        <CodeExample summary="Show Breadcrumb.vue source code">{{ code }}</CodeExample>
      </div>
    </div>
  </section>
</template>
