<script setup lang="ts">
import {
  type ComponentPublicInstance,
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
} from "vue";
import { FocusTrap } from "focus-trap-vue";

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

const currentlyAppliedFormat = ref<{
  format: string;
  index: number;
  category: FormatCategory;
  temporalType: FormatDateType;
} | null>(null);

const currentlyHighlightedFormat = ref<string | null>(null);
const selectedFormatStandard = ref<FormatCategory>("RECENT");

// this can be updated from outside sometimes, hence watcher
const selectedFormatType = ref<FormatDateType>(props.selectedType);
watch(
  () => props.selectedType,
  (newSelectedType) => {
    currentlyHighlightedFormat.value = newSelectedType;
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

const {
  currentIndex: currentlyHighlightedFormatIndex,
  onKeydown,
  resetNavigation,
  setElement: setHighlightedElement,
} = useDropdownNavigation({
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
 * Only if the format is included in the currently applicable formats. Otherwise is a no-op.
 */
const scrollToFormat = (format: string) => {
  const element =
    allFormatListItemRefs[
      `${format}-${selectedFormatStandard.value}-${selectedFormatType.value}`
    ];
  if (element) {
    scrollIntoView(element);
  }
};

/**
 * Select the given format, highlighting it in the menu. If the temporalType or category
 * are provided, first switch to them. It will also scroll to the selected format.
 *
 * Note that this doesn't change the applied format, which is the one that is currently
 * set in the text field input in the parent component. Only the highlighted one, which is
 * the one that will be applied upon pressing enter/space.
 *
 * This isn't needed by the keyboard navigation, but is needed when the value switches are
 * used to change the type or standard, or on mount.
 */
const highlightAndScrollToFormat = async (
  format: string,
  temporalType?: FormatDateType,
  category?: FormatCategory,
) => {
  selectedFormatType.value = temporalType ?? selectedFormatType.value;
  selectedFormatStandard.value = category ?? selectedFormatStandard.value;

  // Wait for the next tick to ensure that the list has been rendered
  await nextTick();

  // scroll to the selected format
  currentlyHighlightedFormat.value = format;
  scrollToFormat(format);

  // also need to select the format in the list
  const newHighlightedIndex = applicableFormats.value!.findIndex(
    (applicableFormat) => applicableFormat.format === format,
  );
  // If we don't do this, we get inconsistent initial state, which prevents
  // the user pressing space/enter before they select a format.
  setHighlightedElement({
    index: newHighlightedIndex,
    onClick: () =>
      emit(
        "commit",
        formatWithExampleToModel(applicableFormats.value![newHighlightedIndex]),
      ),
  });
};

// Require this watcher to get the scrolling to work when using the arrow keys
// to navigate the list.
watch(currentlyHighlightedFormatIndex, (newIndex) => {
  if (newIndex === null) {
    return;
  }

  const format = applicableFormats.value?.[newIndex]?.format;
  if (format) {
    scrollToFormat(format);
  }
});

watch([selectedFormatType, selectedFormatStandard], () => {
  // unselect the format when the type or standard changes. However,
  // if we change the switches s.t. the applied format is visible, we
  // just highlight the applied format again. Otherwise, deselect everything.
  if (
    selectedFormatType.value === currentlyAppliedFormat.value?.temporalType &&
    selectedFormatStandard.value === currentlyAppliedFormat.value?.category
  ) {
    highlightAndScrollToFormat(
      currentlyAppliedFormat.value.format,
      currentlyAppliedFormat.value.temporalType,
      currentlyAppliedFormat.value.category,
    );
  } else {
    currentlyHighlightedFormat.value = null;
    resetNavigation();
  }
});

const isMounted = ref(false);
onMounted(async () => {
  // Sort through and select the first format that matches the currently applied format.

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
    const format = sortedFormats[0].format;
    const temporalType = sortedFormats[0].temporalType;
    const category = sortedFormats[0].category;

    await highlightAndScrollToFormat(format, temporalType, category);

    const index = applicableFormats.value!.findIndex(
      (applicableFormat) => applicableFormat.format === format,
    );

    currentlyAppliedFormat.value = {
      format,
      index,
      category,
      temporalType,
    };
  }

  nextTick(() => (isMounted.value = true));
});

onUnmounted(() => (isMounted.value = false));
</script>

<template>
  <FocusTrap
    v-model:active="isMounted"
    :initial-focus="() => formatContainerRef ?? false"
  >
    <div class="popover">
      <ValueSwitch
        v-if="showTypeSwitch"
        id="selectedFormatType"
        ref="typeSwitchRef"
        v-model="selectedFormatType"
        compact
        :possible-values="typesToDisplayInValueSwitch"
        class="filter-switch"
      />
      <ValueSwitch
        id="selectedFormatStandard"
        ref="standardSwitchRef"
        v-model="selectedFormatStandard"
        compact
        :possible-values="categoriesToDisplayInValueSwitch"
        class="filter-switch"
      />
      <div class="formats-container-border-host">
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
              :class="{
                highlighted: index === currentlyHighlightedFormatIndex,
                applied:
                  index === currentlyAppliedFormat?.index &&
                  format.category === currentlyAppliedFormat.category &&
                  format.temporalType === currentlyAppliedFormat.temporalType,
              }"
              class="single-format"
              role="menuitem"
              @click="() => emit('commit', formatWithExampleToModel(format))"
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
    </div>
  </FocusTrap>
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

.formats-container-border-host {
  position: relative;
  outline: none;

  &:focus-within::after {
    content: "";
    position: absolute;
    inset: -2px;
    border: 1px solid var(--knime-cornflower);
    pointer-events: none;
  }
}

.formats-container {
  border: var(--formats-container-border-width) solid var(--knime-silver-sand);
  height: 200px;
  overflow: hidden auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  outline: none;

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

    &.applied {
      background-color: var(--knime-masala);

      & .format-pattern {
        color: var(--knime-white);
      }

      & .format-preview {
        color: var(--knime-porcelain);
      }
    }

    &:hover,
    &.highlighted {
      &:not(.applied) {
        background-color: var(--knime-porcelain);
      }
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
