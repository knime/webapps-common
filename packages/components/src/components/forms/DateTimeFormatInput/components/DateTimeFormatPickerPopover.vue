<script setup lang="ts">
import {
  type ComponentPublicInstance,
  computed,
  nextTick,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";

import { useDropdownNavigation } from "../../../../composables";
import FunctionButton from "../../../Buttons/FunctionButton.vue";
import LoadingIcon from "../../../LoadingIcon/LoadingIcon.vue";
import Tooltip from "../../../Tooltip/Tooltip.vue";
import Label from "../../Label/Label.vue";
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
  cancel: [];
}>();

const props = defineProps<{
  allFormats: FormatWithExample[] | null;
  allowedTypes: FormatDateType[];
  initialSelectedPattern: string | null;
}>();

const unfilteredTypesToDisplayInValueSwitch: ValueSwitchItem[] = [
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
];
const typesToDisplayInValueSwitch = computed<ValueSwitchItem[]>(() =>
  unfilteredTypesToDisplayInValueSwitch.filter((valueSwitchItem) =>
    props.allowedTypes.includes(valueSwitchItem.id as FormatDateType),
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

const selectedFormat = ref<string | null>(null);
const commitButtonDisabledErrorReason = computed<string>(() =>
  selectedFormat.value ? "" : "No format selected",
);

const selectedFormatType = ref<FormatDateType>("DATE");
const selectedFormatStandard = ref<FormatCategory>("RECENT");

const applicableFormats = computed<FormatWithExample[] | null>(() => {
  const standard = selectedFormatStandard.value;
  const type = selectedFormatType.value;

  return (
    props.allFormats?.filter(
      (format) => format.category === standard && format.temporalType === type,
    ) ?? null
  );
});

const formatContainerRef = ref<HTMLElement | null>(null);

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

const { currentIndex, onKeydown, resetNavigation } = useDropdownNavigation({
  keepOpenedOnTab: true,
  getFirstElement: () => {
    const index = 0;
    return {
      index,
      onClick: () => emit("commit", applicableFormats.value![index].format),
    };
  },
  getLastElement: () => {
    const index = applicableFormats.value!.length - 1;

    return {
      index,
      onClick: () => emit("commit", applicableFormats.value![index].format),
    };
  },
  getNextElement: (currentIndex, direction) => {
    const indexUnset = currentIndex === null || currentIndex === -1;
    currentIndex = indexUnset ? null : currentIndex;

    if (direction === 1) {
      const newIndex =
        ((currentIndex ?? -1) + 1) % applicableFormats.value!.length;

      return {
        index: newIndex,
        onClick: () =>
          emit("commit", applicableFormats.value![newIndex].format),
      };
    } else {
      const newIndex =
        ((currentIndex ?? 0) - 1 + applicableFormats.value!.length) %
        applicableFormats.value!.length;

      return {
        index: newIndex,
        onClick: () =>
          emit("commit", applicableFormats.value![newIndex].format),
      };
    }
  },
  close: () => {
    emit("cancel");
  },
});
const BORDER_WIDTH = 1;
const scrollIntoView = (element: HTMLElement) => {
  const parentNode = element.parentElement;
  if (parentNode && parentNode.scrollHeight > parentNode.clientHeight) {
    const parentOffsetTopPlusBorder = parentNode.offsetTop + BORDER_WIDTH;
    const scrollBottom = parentNode.clientHeight + parentNode.scrollTop;
    const elementBottom =
      element.offsetTop + element.offsetHeight - parentOffsetTopPlusBorder;
    if (elementBottom > scrollBottom) {
      parentNode.scrollTop = elementBottom - parentNode.clientHeight;
    } else if (
      element.offsetTop - parentNode.scrollTop <
      parentOffsetTopPlusBorder
    ) {
      parentNode.scrollTop = element.offsetTop - parentOffsetTopPlusBorder;
    }
  }
};

/**
 * Select the given format, highlighting it in the menu. If the temporalType or category
 * are provided, first switch to them. It will also scroll to the selected format.
 */
const selectFormat = async (
  format: string,
  temporalType?: FormatDateType,
  category?: FormatCategory,
) => {
  selectedFormatType.value = temporalType ?? selectedFormatType.value;
  selectedFormatStandard.value = category ?? selectedFormatStandard.value;

  // Wait for the next tick to ensure that the list has been rendered
  await nextTick();

  // scroll to the selected format
  selectedFormat.value = format;
  const element =
    allFormatListItemRefs[
      `${format}-${selectedFormatStandard.value}-${selectedFormatType.value}`
    ];
  if (element) {
    scrollIntoView(element);
  }

  // also need to select the format in the list
  const index = applicableFormats.value!.findIndex(
    (applicableFormat) => applicableFormat.format === format,
  );
  currentIndex.value = index;
};

const focusFormatContainer = async () => {
  await nextTick();
  formatContainerRef.value?.focus();
};

// Require this watcher to get the scrolling to work when using the arrow keys
// to navigate the list.
watch(currentIndex, (newIndex) => {
  if (newIndex === null) {
    return;
  }

  const format = applicableFormats.value![newIndex];
  selectFormat(format.format, format.temporalType, format.category);
});

watch([selectedFormatType, selectedFormatStandard], () => {
  // unselect the format when the type or standard changes
  selectedFormat.value = null;
  resetNavigation();
});

const isMounted = ref(false);
onMounted(() => {
  if (!props.allFormats) {
    return;
  }

  // sort the allowed formats - recents, then standards, then the rest
  const sortedCategories: FormatCategory[] = [
    "RECENT",
    "STANDARD",
    "EUROPEAN",
    "AMERICAN",
  ];
  const sortedFormats = props.allFormats
    .filter((format) => props.initialSelectedPattern === format.format)
    .sort((a, b) => {
      const aIndex = sortedCategories.indexOf(a.category);
      const bIndex = sortedCategories.indexOf(b.category);

      return aIndex - bIndex;
    });

  // select the first format if it's available
  if (sortedFormats.length > 0) {
    selectFormat(
      sortedFormats[0].format,
      sortedFormats[0].temporalType,
      sortedFormats[0].category,
    );
  }

  focusFormatContainer();
  setTimeout(() => {
    isMounted.value = true;
  }, 0);
});
</script>

<template>
  <div class="popover">
    <h2 class="title">Date & Time Formats</h2>
    <div class="switch-with-title">
      <Label class="control-title" text="Type" for="selectedFormatType">
        <ValueSwitch
          id="selectedFormatType"
          v-model="selectedFormatType"
          compact
          :possible-values="typesToDisplayInValueSwitch"
          @keydown.tab.shift="emit('cancel')"
        />
      </Label>
    </div>
    <div class="switch-with-title">
      <Label class="control-title" text="Standard" for="selectedFormatStandard">
        <ValueSwitch
          id="selectedFormatStandard"
          v-model="selectedFormatStandard"
          compact
          :possible-values="categoriesToDisplayInValueSwitch"
        />
      </Label>
    </div>
    <div class="date-format-input">
      <Label class="control-title" text="Date formats" for="dateFormats">
        <div
          id="dateFormats"
          ref="formatContainerRef"
          class="formats-container"
          :style="{ '--formats-container-border-width': BORDER_WIDTH + 'px' }"
          tabindex="0"
          role="menu"
          @keydown="onKeydown"
        >
          <div v-if="applicableFormats === null" class="no-formats-available">
            <LoadingIcon class="loading-spinner" />
          </div>
          <div
            v-else-if="applicableFormats.length === 0"
            class="no-formats-available"
          >
            No formats available
          </div>
          <template v-else>
            <div
              v-for="(format, index) in applicableFormats"
              :key="createFormatListItemKey(format)"
              :ref="createFormatListItemRef(format)"
              :class="{ selected: index === currentIndex }"
              class="single-format"
              role="menuitem"
              @click="currentIndex = index"
              @dblclick="() => emit('commit', format.format)"
            >
              <span class="format-pattern">
                {{ format.format }}
              </span>
              <span class="format-preview">
                {{ format.example }}
              </span>
            </div>
          </template>
        </div>
      </Label>
    </div>
    <div class="commit-button-container">
      <Tooltip :text="commitButtonDisabledErrorReason">
        <FunctionButton
          primary
          class="commit-button"
          :disabled="!selectedFormat"
          @keydown.tab="(e: KeyboardEvent) => e.shiftKey || emit('cancel')"
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
.popover {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.control-title {
  font-size: 14px;
  margin-bottom: var(--space-4);
  font-weight: 300;
  color: var(--knime-masala);
}

.title {
  font-size: 16px;
  font-weight: 500;
  line-height: 28px;
  border-bottom: 1px solid var(--knime-silver-sand);
  margin: 0;
}

.date-format-input {
  display: flex;
  flex-direction: column;
  width: 100%;

  & .formats-container {
    border: var(--formats-container-border-width) solid var(--knime-silver-sand);
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

    & .loading-spinner {
      width: 50px;
      height: 50px;
      margin: auto;
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
        min-height: 23px;
      }

      & .format-preview {
        font-style: italic;
        color: var(--knime-stone-gray);
        font-size: 14px;
        min-height: 20px;
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

.commit-button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--space-8);
  margin-right: var(--space-4);

  & .commit-button {
    width: fit-content;
  }
}
</style>
