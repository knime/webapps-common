<script setup lang="ts">
import {
  type ComponentPublicInstance,
  type Ref,
  computed,
  reactive,
  ref,
  watch,
} from "vue";
import { autoUpdate, flip, offset, shift, useFloating } from "@floating-ui/vue";

import FunctionButton from "../../../Buttons/FunctionButton.vue";
import Tooltip from "../../../Tooltip/Tooltip.vue";
import ValueSwitch, {
  type ValueSwitchItem,
} from "../../ValueSwitch/ValueSwitch.vue";
import {
  type FormatCategory,
  type FormatDateType,
  type FormatWithExample,
} from "../utils/types";

const emit = defineEmits<{
  commit: [value: string];
}>();

const props = defineProps<{
  attachTo: Ref<HTMLElement | ComponentPublicInstance | null | undefined>;
  allFormats: FormatWithExample[];
  allowedFormats: FormatDateType[];
}>();

const typesToDisplayInValueSwitch = computed<ValueSwitchItem[]>(() =>
  [
    {
      id: "DATE",
      text: "Date",
    },
    {
      id: "TIME",
      text: "Time",
    },
    {
      id: "DATE_TIME",
      text: "Date & Time",
    },
    {
      id: "ZONED_DATE_TIME",
      text: "Date & Time & Zone",
    },
  ].filter((valueSwitchItem) =>
    props.allowedFormats.includes(valueSwitchItem.id as FormatDateType),
  ),
);

const categoriesToDisplayInValueSwitch = computed<ValueSwitchItem[]>(() => [
  {
    id: "RECENT",
    text: "Recent",
  },
  {
    id: "STANDARD",
    text: "Standard",
  },
  {
    id: "EUROPEAN",
    text: "European",
  },
  {
    id: "AMERICAN",
    text: "United States",
  },
]);

const floatingPopover = ref<HTMLElement | null>(null);

const selectedFormat = ref<string | null>(null);
const commitButtonDisabledErrorReason = computed<string>(() =>
  selectedFormat.value ? "" : "No format selected",
);

const selectedFormatType = ref<FormatDateType>("DATE");
const selectedFormatStandard = ref<FormatCategory>("RECENT");
watch([selectedFormatType, selectedFormatStandard], () => {
  // unselect the format when the type or standard changes
  selectedFormat.value = null;
});

const applicableFormats = computed<FormatWithExample[]>(() => {
  const standard = selectedFormatStandard.value;
  const type = selectedFormatType.value;

  return props.allFormats.filter(
    (format) => format.category === standard && format.temporalType === type,
  );
});

const allFormatListItemRefs = reactive<{
  [formatAndStandard: string]: HTMLElement;
}>({});
const createFormatListItemKey = (format: FormatWithExample) =>
  `${format.format}-${format.category}-${format.temporalType}`;
const createFormatListItemRef = (format: FormatWithExample) => {
  return (el: Element | ComponentPublicInstance | null) => {
    allFormatListItemRefs[createFormatListItemKey(format)] = el as HTMLElement;
  };
};

const { floatingStyles: popoverFloatingStyles } = useFloating(
  props.attachTo,
  floatingPopover,
  {
    middleware: [
      offset({
        mainAxis: 2,
        crossAxis: 0,
      }),
      shift(),
      flip({
        mainAxis: true,
        crossAxis: false,
      }),
    ],
    placement: "top-end",
    whileElementsMounted: autoUpdate,
  },
);

const selectFormat = (format: string) => {
  selectedFormat.value = format;
  allFormatListItemRefs[
    `${format}-${selectedFormatStandard.value}-${selectedFormatType.value}`
  ]?.scrollIntoView({
    block: "nearest",
    behavior: "smooth",
  });
};
const handleKeyInput = (event: KeyboardEvent) => {
  const currentIndex = applicableFormats.value.findIndex(
    (format) => format.format === selectedFormat.value,
  );

  const moveSelection = (step: -1 | 1) => {
    if (applicableFormats.value.length === 0) {
      return;
    }

    if (currentIndex === -1) {
      const newSelectionIndex =
        step === 1 ? 0 : applicableFormats.value.length - 1;
      selectFormat(applicableFormats.value[newSelectionIndex].format);
      return;
    }

    const newIndex =
      (currentIndex + step + applicableFormats.value.length) %
      applicableFormats.value.length;
    selectFormat(applicableFormats.value[newIndex].format);
  };

  switch (event.key) {
    case "Enter":
    case " ":
      if (selectedFormat.value) {
        emit("commit", selectedFormat.value);
        event.preventDefault();
      }
      break;

    case "ArrowDown":
      moveSelection(1);
      event.preventDefault();
      break;

    case "ArrowUp":
      moveSelection(-1);
      event.preventDefault();
      break;

    default:
      break;
  }
};
</script>

<template>
  <div ref="floatingPopover" class="popover" :style="popoverFloatingStyles">
    <span class="title">Date & Time Formats</span>

    <div class="switch-with-title">
      <span class="control-title">Type</span>
      <ValueSwitch
        v-model="selectedFormatType"
        compact
        :possible-values="typesToDisplayInValueSwitch"
      />
    </div>
    <div class="switch-with-title">
      <span class="control-title">Standard</span>
      <ValueSwitch
        v-model="selectedFormatStandard"
        compact
        :possible-values="categoriesToDisplayInValueSwitch"
      />
    </div>
    <div class="date-format-input">
      <span class="control-title">Date formats</span>
      <div class="formats-container" tabindex="-1" @keydown="handleKeyInput">
        <div v-if="applicableFormats.length === 0" class="no-formats-available">
          No formats available
        </div>
        <div
          v-for="format in applicableFormats"
          v-else
          :key="createFormatListItemKey(format)"
          :ref="createFormatListItemRef(format)"
          :class="{ selected: selectedFormat === format.format }"
          class="single-format"
          @click="selectFormat(format.format)"
          @dblclick="() => emit('commit', format.format)"
        >
          <span class="format-pattern">
            {{ format.format }}
          </span>
          <span class="format-preview">
            {{ format.example }}
          </span>
        </div>
      </div>
    </div>
    <div class="commit-button-container">
      <Tooltip :text="commitButtonDisabledErrorReason">
        <FunctionButton
          primary
          class="commit-button"
          :disabled="!selectedFormat"
          @click="
            () => {
              emit('commit', selectedFormat!);
            }
          "
          >Set format</FunctionButton
        >
      </Tooltip>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.control-title {
  font-size: 14px;
  margin-bottom: var(--space-4);
  font-weight: 300;
  color: var(--knime-masala);
}

.popover {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  position: absolute;
  top: 0;
  left: 0;
  min-width: 0;
  min-height: 0;
  box-shadow: var(--shadow-elevation-2);
  padding: var(--space-24);
  padding-bottom: var(--space-16);
  background-color: white;
  z-index: var(--z-index-common-modal, 100);

  & .title {
    font-size: 16px;
    font-weight: 500;
    line-height: 28px;
    border-bottom: 1px solid var(--knime-silver-sand);
  }

  & .date-format-input {
    display: flex;
    flex-direction: column;
    width: 350px;

    & .formats-container {
      border: 1px solid var(--knime-silver-sand);
      height: 200px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;

      & .no-formats-available {
        font-style: italic;
        color: var(--knime-stone-gray);
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
      }

      & .single-format {
        display: flex;
        padding: 2px var(--space-8);
        flex-direction: column;
        cursor: pointer;
        flex: 0;

        &:hover:not(.selected) {
          background-color: var(--knime-porcelain);
        }

        & .format-preview,
        & .format-pattern {
          white-space: nowrap;
          overflow-x: hidden;
          text-overflow: ellipsis;
          width: 100%;
          line-height: 1.44;
          font-weight: 300;

          /* stop double-click from highlighting text */
          user-select: none;
        }

        & .format-pattern {
          font-size: 16px;
          color: var(--knime-masala);
        }

        & .format-preview {
          font-style: italic;
          color: var(--knime-stone-gray);
          font-size: 14px;
        }

        &.selected {
          background-color: var(--knime-masala);

          & .format-pattern {
            color: var(--knime-white);
          }

          & .format-preview {
            color: var(--knime-porcelain);
          }
        }
      }
    }
  }

  & .commit-button-container {
    display: flex;
    justify-content: flex-end;
    margin-top: var(--space-8);
    margin-right: var(--space-4);

    & .commit-button {
      width: fit-content;
    }
  }
}
</style>
