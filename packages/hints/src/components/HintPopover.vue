<script lang="ts" setup>
import { Button } from "@knime/components";
import BulbIcon from "@knime/styles/img/icons/bulb.svg";
import CloseIcon from "@knime/styles/img/icons/close.svg";

interface Props {
  title: string;
  description: string;
  linkText?: string;
  linkHref?: string;
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
    <div class="close-button">
      <Button @click="onGotItButtonClicked"><CloseIcon /></Button>
    </div>
    <div class="title">
      <BulbIcon />
      <div>{{ title }}</div>
    </div>
    <div class="description">{{ description }}</div>
    <template v-if="linkHref">
      <div class="link">
        <a :href="linkHref">{{ linkText ?? linkHref }}</a>
      </div>
    </template>
    <div class="button-controls">
      <Button @click="onSkipHintsButtonClicked">Skip hints</Button>
      <Button @click="onGotItButtonClicked">Got it!</Button>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.wrapper {
  padding: 15px;
  min-width: 270px;
  font-family: Roboto, sans-serif;
}

.title {
  color: var(--knime-masala);
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 21px;
  display: flex;
  gap: 7px;
  margin-bottom: 8px;

  & svg {
    width: 20px;
  }
}

.close-button {
  display: flex;
  justify-content: flex-end;

  & button {
    padding: 0;
    line-height: 8px;

    & svg {
      margin: 0;
      width: 8px;
      height: 8px;
      stroke-width: 3;
    }
  }
}

.description,
.link {
  color: var(--knime-masala);
  font-size: 13px;
  font-style: normal;
  font-weight: 300;
  line-height: 18px;
  margin-bottom: 10px;
}

.button-controls {
  border-top: 1px solid var(--knime-dove-gray);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 8px;

  & button {
    color: var(--knime-dove-gray);
    padding: 0 8px;
    font-size: 13px;
    font-style: normal;
    font-weight: 500;
    line-height: 18px;
  }
}
</style>
