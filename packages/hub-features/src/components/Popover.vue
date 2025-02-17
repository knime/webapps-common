<script setup lang="ts">
import { type Ref, ref } from "vue";
import { onClickOutside } from "@vueuse/core";

import { FunctionButton } from "@knime/components";
import CloseIcon from "@knime/styles/img/icons/close.svg";

type Props = {
  disabled?: boolean;
  buttonTitle?: string | null;
  useButton?: boolean;
  buttonWithBorder?: boolean;
  hasCloseButton?: boolean;
  arrowPosition?: "top" | "right";
};

withDefaults(defineProps<Props>(), {
  buttonTitle: null,
  arrowPosition: "top",
  useButton: true,
  bottonWithBorder: true,
  hasCloseButton: true,
});

const emit = defineEmits(["open", "close"]);

const expanded = ref(false);
const toggleRef: Ref<InstanceType<typeof FunctionButton> | null> = ref(null);
const expandedElemRef = ref<HTMLElement | null>(null);

const closeMenu = () => {
  if (expanded.value) {
    consola.trace("Closing popover menu");
    emit("close");
    expanded.value = false;
  }
};
const openMenu = () => {
  consola.trace("Opening popover menu");
  emit("open");
  expanded.value = true;
};
const onToggle = () => {
  if (expanded.value) {
    closeMenu();
  } else {
    openMenu();
  }
};
const onFocus = () => {
  toggleRef.value?.focus();
};

onClickOutside(expandedElemRef, closeMenu, { capture: false });

defineExpose({
  openMenu,
  closeMenu,
  onToggle,
});
</script>

<template>
  <div
    ref="wrapper"
    :class="['popover', `arrow-${arrowPosition}`, { expanded }]"
    :expanded="expanded"
    @focus="onFocus"
  >
    <!-- use mouseup instead of click as the click event fires twice on key input in Firefox-->
    <FunctionButton
      v-if="useButton"
      ref="toggleRef"
      :title="buttonTitle"
      class="toggle"
      :class="{ 'with-border': buttonWithBorder }"
      :active="expanded"
      :disabled="disabled"
      @mouseup.stop="onToggle"
      @keydown.space.stop="onToggle"
      @keydown.esc.stop="closeMenu"
    >
      <slot name="button" />
    </FunctionButton>
    <span
      v-else
      ref="toggleRef"
      tabindex="0"
      :title="buttonTitle ?? undefined"
      :active="expanded"
      :class="['toggle', { disabled, 'with-border': buttonWithBorder }]"
      @mouseup.stop="onToggle"
      @keydown.space.prevent="onToggle"
      @keydown.esc.prevent="closeMenu"
    >
      <slot name="button" />
    </span>
    <div v-if="expanded" ref="expandedElemRef" class="content">
      <slot name="content" />
      <FunctionButton
        v-if="hasCloseButton"
        class="closer"
        @click.stop="closeMenu"
      >
        <CloseIcon />
      </FunctionButton>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.popover {
  position: relative;
  --popover-top-margin: 18px;
  --popover-arrow-size: 15px;

  filter: drop-shadow(0 2px 10px var(--knime-gray-dark-semi));

  &.expanded {
    z-index: 1;

    &::after {
      position: absolute;
      content: "";
      width: 0;
      height: 0;
    }

    /* transparent background to maintain focus on the popover while transitioning into it with the mouse */
    &::before {
      content: "";
      position: absolute;
      background-color: rgb(0 0 0 / 0%);
    }

    &.arrow-top {
      &::after {
        top: calc(100% + var(--popover-top-margin) - var(--popover-arrow-size));
        right: 20px;
        border-left: var(--popover-arrow-size) solid transparent;
        border-right: var(--popover-arrow-size) solid transparent;
        border-bottom: var(--popover-arrow-size) solid var(--knime-white);

        @media only screen and (width <= 900px) {
          border-top: var(--popover-arrow-size) solid var(--knime-white);
          border-bottom: 0;
          bottom: calc(
            100% + var(--popover-top-margin) - var(--popover-arrow-size)
          );
          top: auto;
        }
      }

      &::before {
        top: calc(100% + var(--popover-top-margin) - var(--popover-arrow-size));
        right: 0;
        width: var(--popover-width, 300px);
        height: var(--popover-arrow-size);
      }
    }

    &.arrow-right {
      &::after {
        top: 40px;
        left: var(--popover-width, 300px);
        width: var(--popover-arrow-size);
        height: auto;
        aspect-ratio: 1/2;
        background: var(--knime-white);
        clip-path: polygon(0 0, 100% 50%, 0 100%);
      }
    }
  }

  & .content {
    width: var(--popover-width, 300px);
    position: absolute;
    top: calc(
      100% + var(--popover-top-margin) - 1px
    ); /* shift by one pixel to avoid zoom issues */

    right: 0;
    padding: 20px;
    background: var(--knime-white);

    @media only screen and (width <= 900px) {
      bottom: calc(
        100% + var(--popover-top-margin) - 1px
      ); /* shift by one pixel to avoid zoom issues */

      top: auto;
    }
  }

  & .toggle {
    display: flex;

    &:focus {
      outline: none;
    }

    &.disabled {
      opacity: 0.5;
      pointer-events: none;
    }
  }

  & .with-border {
    &.function-button {
      border: 1px solid var(--knime-silver-sand);

      &.active {
        border-color: var(--theme-button-function-background-color-active);
      }
    }
  }

  & .closer {
    position: absolute;
    top: 6px;
    right: 6px;
  }
}
</style>
