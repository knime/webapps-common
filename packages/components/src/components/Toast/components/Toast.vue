<script setup lang="ts">
import { ref, computed, onMounted, watch, toRef } from "vue";
import { useMouseInElement, useWindowFocus, useEventBus } from "@vueuse/core";

import FunctionButton from "../../Buttons/FunctionButton.vue";

import CloseIcon from "@knime/styles/img/icons/close.svg";
import InfoIcon from "@knime/styles/img/icons/circle-info.svg";
import ErrorIcon from "@knime/styles/img/icons/circle-close.svg";
import SuccessIcon from "@knime/styles/img/icons/circle-check.svg";
import WarnIcon from "@knime/styles/img/icons/sign-warning.svg";

import { capitalize, truncateString } from "@knime/utils";

import ToastButton from "./ToastButton.vue";
import useAnimation from "../useAnimation";

import type { Toast } from "../types";
import type { Ref } from "vue";

const MAX_MESSAGE_LENGTH = 160;

const props = withDefaults(defineProps<Toast>(), {
  type: "info",
  headline: "",
  message: "",
  component: null,
  autoRemove: true,
  active: true,
  buttons: () => [],
  stackId: "default",
});

const availableHeadline = computed(() => {
  return props.headline ? props.headline : capitalize(props.type);
});

// Supported toast types and corresponding icons
const iconMap = {
  info: InfoIcon,
  error: ErrorIcon,
  success: SuccessIcon,
  warning: WarnIcon,
};
const typeIndicatorIcon = computed(() => iconMap[props.type]);

// Emitted events
const emits = defineEmits(["remove", "auto-remove"]);

// Toast ref
const toastRef: Ref<null | HTMLElement> = ref(null);

// Window focus and mouse tracking
const focused = useWindowFocus();
const { isOutside } = useMouseInElement(toastRef);
const shouldPause = computed(() => !focused.value || !isOutside.value);

// Auto-remove progress bar animation
// TODO HUB-6040: replace our `useAnimation` composable with `useAnimate` from VueUse
const progressBar: Ref<null | HTMLElement> = ref(null);
const keyframes: Keyframe[] = [{ transform: "scaleX(0)" }];
const options = {
  callback: () => emits("auto-remove"),
  animationOptions: { duration: 7000 },
};
const { play, pause, reset } = useAnimation(progressBar, keyframes, options);

// Truncation of long messages
const truncatedMessage = computed(() =>
  truncateString(props.message, MAX_MESSAGE_LENGTH),
);
const isTruncatable = truncatedMessage.value !== props.message;
const isTruncated = ref(isTruncatable);
const showMore = () => {
  // TODO HUB-5698: animate toast and stack height when expanding truncated text
  isTruncated.value = false;
};

// Height transformations
const nativeHeight: Ref<null | number> = ref(null);
const currentHeight: Ref<null | number> = ref(null);
// Enables communication between toasts within separate toast service channels
const eventBus = useEventBus(`new-stack-height-${props.stackId}`);
const animateHeightTo = (targetHeight: number) => {
  if (toastRef.value !== null) {
    toastRef.value.style.height = `${targetHeight}px`;
  }
  currentHeight.value = targetHeight;
};
// Listen to height changes of other toasts and animate height accordingly
eventBus.on((newStackHeight: any) => {
  if (
    typeof newStackHeight === "number" &&
    currentHeight.value !== newStackHeight
  ) {
    animateHeightTo(newStackHeight);
  }
});

onMounted(() => {
  if (toastRef.value !== null) {
    nativeHeight.value = toastRef.value.clientHeight;
    currentHeight.value = toastRef.value.clientHeight;
  }
  eventBus.emit(currentHeight.value);

  if (props.autoRemove && props.active) {
    play();
  }
});

watch(shouldPause, (shouldPause) => {
  if (!props.autoRemove || !props.active) {
    return;
  }

  if (shouldPause) {
    pause();
  } else {
    play();
  }
});

watch(toRef(props, "active"), (active) => {
  if (active) {
    if (nativeHeight.value !== null) {
      animateHeightTo(nativeHeight.value);
      eventBus.emit(currentHeight.value);
    }

    if (props.autoRemove && !shouldPause.value) {
      play();
    }
    return;
  }

  if (isTruncatable) {
    isTruncated.value = true;
  }

  if (props.autoRemove) {
    reset();
  }
});
</script>

<template>
  <div ref="toastRef" :class="['toast', type]">
    <div
      v-show="active"
      class="container"
      :class="{ 'auto-remove': autoRemove }"
    >
      <div class="type-indicator">
        <component :is="typeIndicatorIcon" class="type-indicator-icon" />
      </div>
      <div class="content">
        <div class="headline">{{ availableHeadline }}</div>
        <div v-if="message" class="message">
          <template v-if="isTruncated">
            {{ truncatedMessage }}
            <button class="show-more" @click="showMore">show more</button>
          </template>
          <template v-else>{{ message }}</template>
        </div>
        <div v-else-if="props.component" class="message">
          <component :is="props.component" />
        </div>

        <div v-if="buttons.length" class="buttons">
          <ToastButton
            v-for="(button, index) in buttons"
            v-bind="button"
            :key="index"
          />
        </div>

        <FunctionButton
          class="close-button"
          title="Dismiss message"
          @click="emits('remove')"
          @keydown.space.stop.prevent="emits('remove')"
        >
          <CloseIcon />
        </FunctionButton>
      </div>
      <div ref="progressBar" class="progress-bar">
        <div class="progress-bar-inner" />
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.toast {
  --gap-size: 25px;
  --icon-size: 24px;

  box-shadow: 0 2px 10px 0 var(--knime-gray-dark-semi);
  border-radius: 3px;
  overflow: hidden;
  background-color: var(--knime-white);
  color: var(--knime-masala);
  width: var(--toast-width, 350px);
  min-height: 75px;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;

  &.info {
    --color: var(--theme-color-info);
  }

  &.error {
    --color: var(--theme-color-error);
  }

  &.success {
    --color: var(--theme-color-success);
  }

  &.warning {
    --color: var(--theme-color-action-required);
  }

  & .container {
    display: flex;
    flex-direction: row;
    position: relative;
    flex-grow: 1;

    & .type-indicator {
      background-color: var(--color);
      width: 39px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 16px;
      flex-shrink: 0;

      & svg.type-indicator-icon {
        width: var(--icon-size);
        stroke: var(--knime-white);
        position: relative;
        stroke-width: calc(32px / var(--icon-size));
      }
    }

    & .content {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      padding: 15px;
      color: var(--knime-masala);
      max-width: 100%;

      & .headline {
        display: inline-block;
        color: var(--knime-masala);
        margin: 0;
        padding-right: 12px;
        padding-bottom: 5px;
        font-weight: 700;
        font-size: 16px;
        line-height: 150%;
        gap: var(--gap-size);
      }

      & .message {
        color: var(--knime-masala);
        font-weight: 300;
        font-size: 13px;
        line-height: 150%;
        word-break: break-word;
        white-space: break-spaces;

        & button.show-more {
          all: unset;
          cursor: pointer;
          font-weight: 500;

          &:active,
          &:hover {
            text-decoration: underline;
          }
        }
      }

      & .buttons {
        margin-top: 10px;
        display: flex;
        flex-direction: row;
        gap: 33px;
      }

      & .close-button {
        position: absolute;
        top: 8px;
        right: 8px;
      }
    }

    & .progress-bar {
      display: none;
      height: 5px;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      background-color: white;
      transform-origin: left;

      & .progress-bar-inner {
        height: 100%;
        opacity: 0.5;
        background-color: var(--color);
      }
    }
  }

  & .container.auto-remove {
    padding-bottom: 5px;

    & .type-indicator {
      margin-bottom: -5px;
    }

    & .progress-bar {
      display: initial;
    }
  }
}
</style>
