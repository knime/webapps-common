<script setup>

import { ref, computed, onMounted, watch } from 'vue';
import { useMouseInElement, useWindowFocus } from '@vueuse/core';
import CloseIcon from '../../assets/img/icons/close.svg';
import InfoIcon from '../../assets/img/icons/circle-info.svg';
import ErrorIcon from '../../assets/img/icons/circle-close.svg';
import SuccessIcon from '../../assets/img/icons/circle-check.svg';
import WarnIcon from '../../assets/img/icons/circle-warning.svg';
import useAnimation from '../../composables/useAnimation';

const capitalizeFirstLetter = str => `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

const iconMap = {
    info: InfoIcon,
    error: ErrorIcon,
    success: SuccessIcon,
    warn: WarnIcon
};

const props = defineProps({
    type: {
        type: String,
        default: 'info',
        validator(type = 'info') {
            return ['info', 'error', 'success', 'warn'].includes(type);
        }
    },
    headline: {
        type: String,
        default: ''
    },
    message: {
        type: String,
        default: ''
    },
    buttons: {
        type: Array,
        default: () => []
    },
    autoRemove: {
        type: Boolean,
        default: true
    },
    enabled: {
        type: Boolean,
        default: true
    }
});

const emits = defineEmits(['dismiss']);

const toastRef = ref(null);
const active = ref(true);

const dismiss = () => {
    active.value = false;
    emits('dismiss');
};

const focused = useWindowFocus();
const { isOutside } = useMouseInElement(toastRef);
const shouldPause = computed(() => !focused.value || !isOutside.value);

const progressBar = ref(null);
const keyframes = { transform: 'scaleX(0)' };
const options = { callback: dismiss, animationOptions: { duration: 5000 } };
const { play, pause } = useAnimation(progressBar, keyframes, options);

const componentHeadline = computed(() => props.headline ? props.headline : capitalizeFirstLetter(props.type));
const typeIndicatorIcon = computed(() => iconMap[props.type]);

onMounted(() => {
    play();
});

watch(shouldPause, (shouldPause) => {
    if (shouldPause) {
        pause();
    } else {
        play();
    }
});
</script>

<template>
  <div
    ref="toastRef"
    :class="['toast', type]"
  >
    <div class="type-indicator">
      <component
        :is="typeIndicatorIcon"
        class="type-indicator-icon"
      />
    </div>
    <div class="content">
      <h3>{{ componentHeadline }}</h3>
      <p>{{ message }}</p>
      <button
        class="close-button"
        @click="dismiss"
        @keydown.space.stop.prevent="dismiss"
      >
        <span class="visually-hidden">Dismiss message</span>
        <CloseIcon />
      </button>
    </div>
    <div
      class="progress-bar"
    >
      <div
        ref="progressBar"
        class="progress-bar-inner"
      />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.toast {
  --gap-size: 25px;
  --icon-size: 24px;
  box-shadow: 0 2px 10px 0 var(--knime-gray-dark-semi);

  &.info {
    --color: var(--theme-color-info);
    --secondary-color: purple;
  }
  &.error {
    --color: var(--theme-color-error);
    --secondary-color: brown;
  }
  &.success {
    --color: var(--theme-color-success);
    --secondary-color: green;
  }

  &.warn {
    --color: var(--theme-color-action-required);
    --secondary-color: yellow;
  }

  display: flex;
  flex-direction: row;
  background-color: var(--knime-white);
  color: var(--knime-masala);
  position: relative;
  width: 390px;
  border-radius: 3px;

  & svg {
    width: var(--icon-size);
    stroke: var(--knime-white);
    position: relative;
    stroke-width: calc(32px / var(--icon-size));
  }


  & .type-indicator {
    background-color: var(--color);
    width: 39px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 18px;
    & .type-indicator-icon {

    }
  }

  & .content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    padding: 15px 42px 29px 15px;
    
    & h3 {
      color: var(--knime-masala);
      display: flex;
      align-items: center;
      margin: 0;
      font-weight: 700;
      font-size: 18px;
      line-height: 150%;
      gap: var(--gap-size);
    }

    & p {
      color: var(--knime-masala);
      margin: 5px 0 0;
      font-weight: 300;
      font-size: 16px;
      line-height: 150%;
    }
    & .close-button {
      all: unset;
      cursor: pointer;
      position: absolute;
      top: 12px;
      right: 12px;

      & svg {
        stroke: var(--knime-dove-gray);
        width: 16px;
        height: 16px;
        stroke-width: calc(32px / 16);
      }
    }
  }

  & .progress-bar {
    height: 5px;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;

    & .progress-bar-inner {
      height: 100%;
      background-color: var(--secondary-color);
      transform-origin: left;
    }
  }
}
</style>
