<script lang="ts" setup>
import CloseIcon from "@knime/styles/img/icons/close.svg";

import { AutoPlayVideo, Button, FunctionButton } from "../../../components";
import type { VideoSource } from "../types";

interface Props {
  title: string;
  description: string;
  linkText?: string;
  linkHref?: string;
  video?: VideoSource;
  image?: string;
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
      <h6 class="title">{{ title }}</h6>
      <FunctionButton class="close-button" compact @click="close"
        ><CloseIcon
      /></FunctionButton>
    </div>
    <img
      v-if="image"
      :src="image"
      :alt="`Image for hint ${title}`"
      class="image"
    />
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
      <Button class="skip-hints" compact @click="skipAll">Skip hints</Button>
      <Button with-border compact @click="close">Got it!</Button>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.wrapper {
  padding: var(--space-16);
  min-width: 270px;
  position: relative;
  display: flex;
  flex-direction: column;
}

h6 {
  font-size: 15px;
  color: var(--knime-masala);
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  display: flex;
  margin: 0;
  padding: 0;
  margin-top: calc(var(--space-4) * -1);
  padding-right: var(--space-16);
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-12);
}

.close-button.function-button.single {
  align-self: flex-start;
  position: absolute;
  top: var(--space-6);
  right: var(--space-6);
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
  justify-content: space-between;
  margin-top: var(--space-12);

  & .skip-hints {
    padding: 0;
  }
}
</style>
