<script setup lang="ts">
import { InlineMessage } from "@knime/components";

import CodeExample from "./demo/CodeExample.vue";

const code = "";

const codeExample = `<InlineMessage
  type="info"
  title="Info"
  description="Here is a message that informs the user"
/>`;
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <div class="wrapper">
          <InlineMessage
            type="info"
            title="Info"
            description="Here is a message that informs the user"
          />
          <InlineMessage
            type="warning"
            title="Warning"
            description="Here is a message that warns the user"
          />
          <InlineMessage
            type="error"
            title="Error"
            description="Here is a message that tells user about error and what to do"
          />
          <InlineMessage
            type="success"
            title="Success"
            description="Here is a message that informs the user about success"
          />
          <InlineMessage
            type="promotion"
            title="Promotion"
            description="Here is a message that informs the user about KNIME news"
          />
        </div>
        <CodeExample summary="Show usage example">{{
          codeExample
        }}</CodeExample>
        <CodeExample summary="Show InlineMessage.vue source code">{{
          code
        }}</CodeExample>
      </div>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 15px;
}
</style>
