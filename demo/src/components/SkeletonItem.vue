<script setup lang="ts">
import { ref } from "vue";

import { Button, SkeletonItem } from "@knime/components";

const loading = ref(true);
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <p>
          Skeleton loader component which can take varying sizes (width/height)
          to match the needed use-case. It will <b>NOT</b> make assumptions
          about size, so by default it will set width and height to 100% if not
          specified as props. Has variants which can help you further match the
          element being faked, but these only revolve around making the
          border-radius match, again leaving the size up to you.
        </p>
      </div>
    </div>

    <div class="grid-container">
      <div class="grid-item-4">
        Generic
        <SkeletonItem height="24px" />
      </div>
      <div class="grid-item-2">
        Button
        <SkeletonItem width="80px" height="24px" variant="button" />
      </div>
      <div class="grid-item-2">
        Icon button
        <SkeletonItem height="32px" width="32px" variant="icon-button" />
      </div>
      <div class="grid-item-2">
        Rounded small
        <SkeletonItem height="32px" variant="rounded-sm" />
      </div>
      <div class="grid-item-2">
        Rounded medium
        <SkeletonItem height="32px" variant="rounded-md" />
      </div>
    </div>

    <br />

    <div class="grid-container">
      <div class="grid-item-12">
        <p>
          Can also optionally use a slot which will be rendered depending on the
          loading prop
          <Button compact with-border @click="loading = !loading">
            Toggle loading
          </Button>
        </p>

        <SkeletonItem height="40px" :loading="loading">
          <div class="loaded-content">
            Hello. I am some content that got loaded
          </div>
        </SkeletonItem>
      </div>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
.loaded-content {
  height: 40px;
  background: var(--knime-porcelain);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
