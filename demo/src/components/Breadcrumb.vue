<script>
import { markRaw } from 'vue';
import CodeExample from './demo/CodeExample.vue';
import FolderIcon from 'webapps-common/ui/assets/img/icons/folder.svg';
import Breadcrumb from 'webapps-common/ui/components/Breadcrumb.vue';
import breadcrumbCode from 'webapps-common/ui/components/Breadcrumb.vue?raw';

const codeExample = `<Breadcrumb
  :items="[
    { text: 'segment without link' },
    { text: 'segment with link', href: '/' },
    { text: 'segment with icon (clickable)', icon: FolderIcon, clickable: true },
    { text: 'segment with icon', icon: FolderIcon }
    { title: 'only an icon with no text but a title', icon: FolderIcon }
  ]"
  greyStyle
/>
`;

export default {
    components: {
        Breadcrumb,
        CodeExample
    },
    data() {
        const FolderIconRef = markRaw(FolderIcon);
        return {
            breadcrumbCode,
            breadcrumbItems: [
                { text: 'KNIME Hub', href: '/' },
                { text: 'John Doe', href: '/john.doe' },
                { text: 'Public Space', href: '/john.doe/space', icon: FolderIconRef },
                { text: 'Examples (clickable)', icon: FolderIconRef, clickable: true },
                { text: 'Sentiment Prediction via REST' },
                { title: 'only an icon with no text but a title', icon: FolderIcon }
            ],
            codeExample
        };
    },
    methods: {
        onItemClicked({ text }) {
            window.alert(`You clicked on item ${JSON.stringify({ text })}`);
        }
    }
};
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <p>Breadcrumbs can have different focus/hover styles, these can be toggled via the "greyStyle"-property</p>
        <span>Default style:</span>
        <Breadcrumb
          :items="breadcrumbItems"
          @click-item="onItemClicked"
        />
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
