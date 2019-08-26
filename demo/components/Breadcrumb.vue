<script>
import CodeExample from './demo/CodeExample';
import Breadcrumb from 'webapps-common/ui/components/Breadcrumb.vue';
import breadcrumbCode from '!!raw-loader!webapps-common/ui/components/Breadcrumb.vue';

export default {
    components: {
        Breadcrumb,
        CodeExample
    },
    computed: {
        breadcrumbCode() {
            return breadcrumbCode;
        },
        breadcrumbItems() {
            return [
                { text: 'KNIME Hub', href: '/' },
                { text: 'John Doe', href: '/john.doe' },
                { text: 'Public Space', href: '/john.doe/space' },
                { text: 'Examples', href: '/john.doe/space/examples' },
                { text: 'Sentiment Prediction via REST' }
            ];
        }
    }
};
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <h2>Breadcrumbs</h2>
        <Breadcrumb :items="breadcrumbItems" />
        <CodeExample summary="Show Breadcrumb.vue code">{{ breadcrumbCode }}</CodeExample>
      </div>
    </div>
  </section>
</template>
