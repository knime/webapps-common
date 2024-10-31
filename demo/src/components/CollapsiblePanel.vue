<script setup lang="ts">
import { ref } from "vue";

import { CollapsiblePanel } from "@knime/components";

const isExpanded = ref(true);
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <div>
          Collapsible
          <CollapsiblePanel v-model="isExpanded" title="Collapsible Panel">
            <div>Hello world</div>
          </CollapsiblePanel>
        </div>

        <br />
        <div>
          Closeable
          <CollapsiblePanel
            v-model="isExpanded"
            title="Collapsible Panel"
            :collapsible="false"
            closeable
          >
            <div class="panel-demo-content">Hello world</div>
          </CollapsiblePanel>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
.panel-demo-content {
  padding: var(--space-8);
}
</style>
