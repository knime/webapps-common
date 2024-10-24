<script lang="ts" setup>
import { AutoPlayVideo, Button, FunctionButton } from "@knime/components";
import CloseIcon from "@knime/styles/img/icons/close.svg";

import type { VideoSource } from "../types";

interface Props {
  title: string;
  description: string;
  linkText?: string;
  linkHref?: string;
  video?: VideoSource;
  hideButtons?: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  close: [];
  skipAll: [];
}>();

const close = () => {
  emit("close");
};

const skipAll = () => {
  emit("skipAll");
};
</script>

<template>
  <div class="wrapper">
    <div class="header">
      <h6>{{ title }}</h6>
      <FunctionButton class="close-button" @click="close"
        ><CloseIcon
      /></FunctionButton>
    </div>
    <AutoPlayVideo v-if="video && video.length > 0" with-border class="video">
      <source
        v-for="{ source, type } in video"
        :key="source"
        :src="source"
        :type="type"
      />
    </AutoPlayVideo>
    <p class="description">{{ description }}</p>
    <template v-if="linkHref">
      <div class="link">
        <a :href="linkHref">{{ linkText ?? linkHref }}</a>
      </div>
    </template>
    <div v-if="!hideButtons" class="button-controls">
      <Button style="padding: 0" compact @click="skipAll">Skip hints</Button>
      <Button with-border compact @click="close">Got it!</Button>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.wrapper {
  padding: var(--space-16);
  min-width: 270px;
  font-family: Roboto, sans-serif;
}

h6 {
  font-size: 18px;
  color: var(--knime-masala);
  font-style: normal;
  font-weight: 700;
  line-height: 1.5;
  display: flex;
  margin: 0;
  padding: 0;
}

.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: var(--space-12);
}

.close-button.function-button.single {
  align-self: flex-start;
}

.description,
.link {
  color: var(--knime-masala);
  font-size: 13px;
  font-style: normal;
  font-weight: 300;
  line-height: 18px;
}

.button-controls {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: var(--space-12);
}
</style>
