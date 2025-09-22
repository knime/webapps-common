<script lang="ts" setup>
import CloseIcon from "@knime/styles/img/icons/close.svg";

import AutoPlayVideo from "../../../components/AutoPlayVideo/AutoPlayVideo.vue";
import Button from "../../../components/Buttons/Button.vue";
import FunctionButton from "../../../components/Buttons/FunctionButton.vue";
import type { VideoSource } from "../types";

type Props = {
  title: string;
  description: string;
  linkText?: string;
  linkHref?: string;
  video?: VideoSource;
  image?: string;
  hideButtons?: boolean;
};

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
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 270px;
  padding: var(--space-16);
}

h6 {
  display: flex;
  padding: 0;
  padding-right: var(--space-16);
  margin: 0;
  margin-top: calc(var(--space-4) * -1);
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  color: var(--knime-masala);
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-12);
}

.close-button.function-button.single {
  position: absolute;
  top: var(--space-6);
  right: var(--space-6);
  align-self: flex-start;
}

.description,
.link {
  font-size: 13px;
  font-style: normal;
  font-weight: 300;
  line-height: 18px;
  color: var(--knime-masala);
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
