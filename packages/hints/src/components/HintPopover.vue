<script lang="ts" setup>
import { Button, FunctionButton } from "@knime/components";
import CloseIcon from "@knime/styles/img/icons/close.svg";

interface Props {
  title: string;
  description: string;
  linkText?: string;
  linkHref?: string;
  video?: Array<{ source: string; type: string }>;
  hideButtons?: boolean;
  completeHint: () => void;
  skipAllHints: () => void;
}

const props = defineProps<Props>();

const onGotItButtonClicked = () => {
  props.completeHint();
};

const onSkipHintsButtonClicked = () => {
  props.skipAllHints();
};
</script>

<template>
  <div class="wrapper">
    <div class="header">
      <h6>{{ title }} asdfasf asdf asdf asddf asdf asfd asdf asfd sdf</h6>
      <FunctionButton class="close-button" @click="onGotItButtonClicked"
        ><CloseIcon
      /></FunctionButton>
    </div>
    <p class="description">{{ description }}</p>
    <template v-if="linkHref">
      <div class="link">
        <a :href="linkHref">{{ linkText ?? linkHref }}</a>
      </div>
    </template>
    <div v-if="!hideButtons" class="button-controls">
      <Button style="padding: 0" compact @click="onSkipHintsButtonClicked"
        >Skip hints</Button
      >
      <Button with-border compact @click="onGotItButtonClicked">Got it!</Button>
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
