<script>
import CodeExample from './demo/CodeExample.vue';
import FolderIcon from '../../ui/assets/img/icons/folder.svg';
import Breadcrumb from '../../ui/components/Breadcrumb.vue';
import breadcrumbCode from '!!raw-loader!../../ui/components/Breadcrumb';

const codeExample = `<Breadcrumb :items="[{ text: 'segment without link' },
    { text: 'segment with link', href: '/' },
    { text: 'segment with icon', icon: FolderIcon }]" greyStyle />
`;

export default {
    components: {
        Breadcrumb,
        CodeExample
    },
    data() {
        return {
            breadcrumbCode,
            breadcrumbItems: [
                { text: 'KNIME Hub', href: '/' },
                { text: 'John Doe', href: '/john.doe' },
                { text: 'Public Space', href: '/john.doe/space', icon: FolderIcon },
                { text: 'Examples', icon: FolderIcon },
                { text: 'Sentiment Prediction via REST' }
            ],
            codeExample
        };
    }
};
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <h2>Breadcrumb</h2>
        <p>Breadcrumbs can have different focus/hover styles, these can be toggled via the "greyStyle"-property</p>
        <span>Default style:</span>
        <Breadcrumb :items="breadcrumbItems" />
        <span>"greyStyle" enabled:</span>
        <Breadcrumb
          :items="breadcrumbItems"
          grey-style
        />
        <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
        <CodeExample summary="Show Breadcrumb.vue source code">{{ breadcrumbCode }}</CodeExample>
      </div>
    </div>
  </section>
</template>
