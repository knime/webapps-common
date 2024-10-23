<script lang="ts" setup>
import { type Ref, nextTick, onMounted, ref, toRef } from "vue";
import {
  type MaybeElement,
  type Placement,
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from "@floating-ui/vue";

import PopoverContent from "./PopoverContent.vue";

interface Props {
  content: InstanceType<typeof PopoverContent>["$props"];
  reference: string;
  placement: Placement;
  isVisible: Ref<boolean>;
}

const props = defineProps<Props>();
const referenceElement = ref<MaybeElement<Element>>();
const placement = toRef(props, "placement");

onMounted(async () => {
  await nextTick();
  referenceElement.value = document.querySelector(props.reference);
});

const floating = ref<HTMLElement>();
const floatingArrow = ref<HTMLElement>();

const { floatingStyles, middlewareData } = useFloating(
  referenceElement,
  floating,
  {
    whileElementsMounted: autoUpdate,
    placement,
    // eslint-disable-next-line no-magic-numbers
    middleware: [
      offset(10),
      flip(),
      shift(),
      arrow({ element: floatingArrow }),
    ],
  },
);
</script>

<template>
  <div
    v-if="isVisible.value"
    ref="floating"
    class="hint-popover"
    :style="floatingStyles"
  >
    <PopoverContent v-bind="content" />
    <div
      ref="floatingArrow"
      class="arrow"
      :style="{
        position: 'absolute',
        left:
          middlewareData.arrow?.x != null ? `${middlewareData.arrow.x}px` : '',
        top:
          middlewareData.arrow?.y != null ? `${middlewareData.arrow.y}px` : '',
      }"
    />
  </div>
</template>

<style lang="postcss" scoped>
.hint-popover {
  --hint-popover-background: var(--knime-white);
  --hint-popover-arrow-size: 16px;

  background: var(--hint-popover-background);
  box-shadow: var(--shadow-elevation-2);

  & .arrow {
    position: absolute;
    background: var(--hint-popover-background);
    width: var(--hint-popover-arrow-size);
    height: var(--hint-popover-arrow-size);
    transform: rotate(45deg);
  }
}
</style>
