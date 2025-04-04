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
import LoadingIcon from "../../../LoadingIcon/LoadingIcon.vue";
import ValueSwitch, {
  type ValueSwitchItem,
} from "../../ValueSwitch/ValueSwitch.vue";
import {
  type DateTimeFormatModel,
  type FormatCategory,
  type FormatDateType,
  type FormatWithExample,
} from "../utils/types";

const emit = defineEmits<{
  commit: [value: DateTimeFormatModel];
  cancel: [];
}>();

const props = defineProps<{
  allFormats: FormatWithExample[] | null;
  selectedType: FormatDateType;
  initialSelectedPattern: string | null;
  showTypeSwitch: boolean;
}>();

const categoriesToDisplayInValueSwitch = computed<ValueSwitchItem[]>(() => [
  {
    id: "RECENT",
    text: "Recent",
  },
  {
    id: "STANDARD",
    text: "ISO",
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

const typesToDisplayInValueSwitch = computed<ValueSwitchItem[]>(() => [
  {
    id: "DATE",
    text: "Date",
  },
  {
    id: "DATE_TIME",
    text: "Date & time",
  },
  {
    id: "TIME",
    text: "Time",
  },
  {
    id: "ZONED_DATE_TIME",
    text: "Zoned date & time",
  },
]);

const selectedFormat = ref<string | null>(null);
const selectedFormatStandard = ref<FormatCategory>("RECENT");

// this can be updated from outside sometimes, hence watcher
const selectedFormatType = ref<FormatDateType>(props.selectedType);
watch(
  () => props.selectedType,
  (newSelectedType) => {
    selectedFormatType.value = newSelectedType;
  },
);

const applicableFormats = computed<FormatWithExample[] | null>(
  () =>
    props.allFormats?.filter(
      (format) =>
        format.category === selectedFormatStandard.value &&
        format.temporalType === selectedFormatType.value,
    ) ?? null,
);

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

const formatWithExampleToModel = (
  format: FormatWithExample,
): DateTimeFormatModel => {
  return {
    format: format.format,
    temporalType: format.temporalType,
  };
};

const { currentIndex, onKeydown, resetNavigation } = useDropdownNavigation({
  keepOpenedOnTab: true,
  getFirstElement: () => {
    const index = 0;
    return {
      index,
      onClick: () =>
        emit(
          "commit",
          formatWithExampleToModel(applicableFormats.value![index]),
        ),
    };
  },
  getLastElement: () => {
    const index = applicableFormats.value!.length - 1;

    return {
      index,
      onClick: () =>
        emit(
          "commit",
          formatWithExampleToModel(applicableFormats.value![index]),
        ),
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
          emit(
            "commit",
            formatWithExampleToModel(applicableFormats.value![newIndex]),
          ),
      };
    } else {
      const newIndex =
        ((currentIndex ?? 0) - 1 + applicableFormats.value!.length) %
        applicableFormats.value!.length;

      return {
        index: newIndex,
        onClick: () =>
          emit(
            "commit",
            formatWithExampleToModel(applicableFormats.value![newIndex]),
          ),
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
    .filter(
      (format) =>
        // if the type switch is hidden, filter to only formats with the same type
        props.selectedType === format.temporalType || props.showTypeSwitch,
    )
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
    <ValueSwitch
      v-if="showTypeSwitch"
      id="selectedFormatType"
      v-model="selectedFormatType"
      compact
      :possible-values="typesToDisplayInValueSwitch"
      class="filter-switch"
    />
    <ValueSwitch
      id="selectedFormatStandard"
      v-model="selectedFormatStandard"
      compact
      :possible-values="categoriesToDisplayInValueSwitch"
      class="filter-switch"
    />
    <div
      id="dateFormats"
      ref="formatContainerRef"
      class="formats-container"
      :style="{ '--formats-container-border-width': BORDER_WIDTH + 'px' }"
      tabindex="0"
      role="menu"
      @keydown="onKeydown"
      @keydown.tab="(e: KeyboardEvent) => e.shiftKey || emit('cancel')"
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
          @click="
            () => {
              currentIndex = index;
              formatContainerRef?.focus();
            }
          "
          @dblclick="() => emit('commit', formatWithExampleToModel(format))"
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

.formats-container {
  border: var(--formats-container-border-width) solid var(--knime-silver-sand);
  height: 200px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  width: 100%;

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
</style>
