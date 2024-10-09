<script lang="ts" setup>
import { computed, ref } from "vue";
import { throttle } from "lodash-es";

const ON_POINTER_MOVE_THROTTLE = 10;
const HANDLE_PADDING = "2px";

const emit = defineEmits(["resize-move", "resize-end"]);
const props = withDefaults(
  defineProps<{
    numberOfHandles: number;
    handleWidth: string;
    connectHandlesOnResize?: boolean;
    multipleHandlesHandleGap?: string;
    disabled?: boolean;
  }>(),
  {
    connectHandlesOnResize: false,
    multipleHandlesHandleGap: "0px",
    disabled: false,
  },
);

const currentPointerY = ref(0);
const pointerId = ref<number | null>(null);

const handleContainerWidth = computed(
  () => `calc(${props.handleWidth} + 2 * ${HANDLE_PADDING})`,
);

const showConnectionHandle = computed(
  () =>
    props.connectHandlesOnResize &&
    props.numberOfHandles > 1 &&
    pointerId.value !== null,
);

const multipleHandlesTotalGap = computed(
  () => `(${props.numberOfHandles} - 1) * ${props.multipleHandlesHandleGap}`,
);
const numberOfSpaceBetweenMargins = computed(
  () => `(2 * ${props.numberOfHandles})`,
);
const positionMiddlePointFirstHandle = computed(
  () =>
    `(100% - ${multipleHandlesTotalGap.value}) / ${numberOfSpaceBetweenMargins.value}`,
);
const connectionHandleWidth = computed(
  () => `calc(100% - 2 * ${positionMiddlePointFirstHandle.value})`,
);

const onPointerDown = (event: PointerEvent) => {
  if (props.disabled) {
    return;
  }
  (event.target as HTMLElement).setPointerCapture(event.pointerId);
  event.preventDefault();
  pointerId.value = event.pointerId;
  currentPointerY.value = event.clientY;
};

const onPointerMove = throttle((event: PointerEvent) => {
  if (pointerId.value === event.pointerId) {
    const deltaY = event.clientY - currentPointerY.value;
    if (
      (deltaY < 0 && event.offsetY <= 0) ||
      (deltaY > 0 && event.offsetY >= 0)
    ) {
      emit("resize-move", deltaY);
    }
    currentPointerY.value = event.clientY;
  }
}, ON_POINTER_MOVE_THROTTLE);

const onPointerUp = (event: PointerEvent) => {
  if (pointerId.value === event.pointerId) {
    currentPointerY.value = 0;
    pointerId.value = null;
    emit("resize-end");
  }
};
</script>

<template>
  <div
    class="resize-handle-container"
    :style="{ gap: multipleHandlesHandleGap }"
  >
    <div
      v-if="showConnectionHandle"
      class="handle connection"
      :style="{ width: connectionHandleWidth }"
    />
    <div
      v-for="i in numberOfHandles"
      :key="i"
      :class="['handle-container', { disabled }]"
      :style="{ width: handleContainerWidth }"
      @pointerdown="onPointerDown"
      @pointerup="onPointerUp"
      @pointermove="onPointerMove"
      @lostpointercapture="onPointerUp"
    >
      <div class="handle" />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.resize-handle-container {
  margin-top: var(--space-4);
  display: flex;
  justify-content: space-around;
  position: relative;

  & .handle {
    border: 1px solid var(--knime-stone-gray);
    border-radius: 1px;

    &.connection {
      position: absolute;
      top: 50%;
      transform: translate(0%, -50%);
      border-color: var(--knime-masala);
    }
  }

  & .handle-container {
    padding: v-bind(HANDLE_PADDING);

    &:hover:not(.disabled) {
      cursor: row-resize;

      & .handle {
        border-color: var(--knime-masala);
      }
    }
  }

  /* first line is to change the background-color of preceding siblings, second line of succeeding siblings */
  & .handle-container:has(~ .handle-container:hover:not(.disabled)) > .handle,
  .handle-container:hover:not(.disabled) ~ .handle-container > .handle {
    border-color: var(--knime-masala);
  }
}
</style>
