<script setup lang="ts">
import { computed, ref } from "vue";

import { LocalDateTime, SubMenu, Tooltip } from "@knime/components";
import MenuIcon from "@knime/styles/img/icons/menu-options.svg";
import { truncateString } from "@knime/utils";

import HubAvatar from "../../avatars/HubAvatar.vue";
import type { NamedItemVersion, WithAvatar, WithLabels } from "../types";

import LabelList from "./LabelList.vue";

const DESCRIPTION_TRUNCATE_LENGTH = 120;

const props = defineProps<{
  version: NamedItemVersion & WithAvatar & WithLabels;
  isSelected: boolean;
  hasAdminRights: boolean;
  hasEditCapability: boolean;
}>();

const emit = defineEmits<{
  select: [selectionStatus: boolean];
  delete: [];
  restore: [];
}>();

const hideTooltip = ref(false);
const tooltipText = computed(() => {
  if (hideTooltip.value) {
    return "";
  }

  if (props.isSelected) {
    return "Deselect to go back to latest";
  } else {
    return "Show version";
  }
});

const truncatedDescription = computed(() => {
  return truncateString(props.version.description, DESCRIPTION_TRUNCATE_LENGTH);
});
const isDescriptionTruncated = computed(
  () =>
    props.version.description &&
    props.version.description.length !== truncatedDescription.value.length,
);
const isDescriptionExpanded = ref(false);

const toggleVersionSelection = () => {
  emit("select", !props.isSelected);
};

const menuItems = computed(() => {
  type MenuItem = { text: string; action: () => void };
  const items: (MenuItem | false)[] = [
    props.hasEditCapability && {
      text: props.isSelected ? "Deselect this version" : "Show this version",
      action: toggleVersionSelection,
    },
    props.hasEditCapability && {
      text: "Restore this version",
      action: () => emit("restore"),
    },
    props.hasAdminRights && {
      text: "Delete this version",
      action: () => emit("delete"),
    },
  ];
  return items.filter((item): item is MenuItem => Boolean(item));
});

const onMenuItemClick = (_: Event, item: (typeof menuItems.value)[number]) => {
  item.action();
};

const onExpandDescription = () => {
  isDescriptionExpanded.value = true;
};

const onLabelOver = () => {
  hideTooltip.value = true;
};
const onLabelLeave = () => {
  hideTooltip.value = false;
};
</script>

<template>
  <div>
    <div
      :class="['version-item-container', isSelected && 'selected']"
      @click="toggleVersionSelection"
    >
      <Tooltip ref="tooltip" class="tooltip" :text="tooltipText">
        <div class="left">
          <h6>
            {{ version.title }}
          </h6>

          <div class="labels">
            <LabelList
              :labels="version.labels"
              @label-over="onLabelOver"
              @label-leave="onLabelLeave"
            />
          </div>

          <p v-if="isDescriptionTruncated && !isDescriptionExpanded">
            {{ truncatedDescription }}
            <button class="show-more-button" @click.stop="onExpandDescription">
              Show more
            </button>
          </p>
          <p v-else-if="version.description">{{ version.description }}</p>
          <span class="footer-info">
            Created on <LocalDateTime show-time :date="version.createdOn" /> –
            Version {{ version.version }}
          </span>
        </div>
        <div class="right">
          <HubAvatar class="profile-picture" v-bind="version.avatar" />
          <div v-if="menuItems.length" class="controls">
            <nav>
              <SubMenu
                :items="menuItems"
                button-title="Options"
                @item-click="onMenuItemClick"
              >
                <MenuIcon class="open-icon" />
              </SubMenu>
            </nav>
          </div>
        </div>
      </Tooltip>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.version-item-container {
  position: relative;
  display: flex;
  gap: 15px;
  align-items: center;
  align-items: stretch;
  padding: 10px;
  background-color: var(--knime-white);
  transition: background-color 0.25s ease;

  & .tooltip {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  & p {
    margin: 10px 0;
    font-size: 11px;
    line-height: 1.5;
  }

  & button {
    all: unset;
    font-size: 11px;
    font-weight: 500;
    color: var(--knime-dove-gray);
  }

  & .left {
    display: flex;
    flex-direction: column;
    gap: 3px;
    word-break: normal;
    overflow-wrap: break-word;

    & h6 {
      display: block;
      margin: 0;
      font-size: 13px;
      font-weight: 700;
      line-height: 18px;
      transition: color 0.25s ease;
    }

    & .footer-info {
      margin: 0;
      font-size: 11px;
      font-weight: 300;
      line-height: 1.5;
      transition: color 0.25s ease;
    }
  }

  & .right {
    display: flex;
    gap: 8px;
    align-items: stretch;
    justify-content: flex-end;
    width: 100px;

    & .controls {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-left: 5px;
      margin-right: -4px;
      border-left: 1px solid var(--knime-silver-sand);
    }
  }

  &::before {
    position: absolute;
    top: 12px;
    left: -6px;
    width: 12px;
    height: 12px;
    content: "";
    background-color: var(--knime-white);
    transform: rotateZ(45deg);
    transition: background-color 0.25s ease;
  }

  &::after {
    position: absolute;
    top: 15px;
    left: -24px;
    width: 6px;
    height: 6px;
    content: "";
    background-color: var(--knime-masala);
    border-radius: 100%;
    box-shadow: 0 0 0 0 transparent;
    transition:
      background-color 0.25s ease,
      box-shadow 0.25s ease;
  }

  &:hover {
    cursor: pointer;
    box-shadow: 0 2px 10px 0 var(--knime-gray-dark-semi);
  }

  &.selected {
    background-color: var(--knime-cornflower-semi);

    & .left {
      & h6,
      & .date {
        color: var(--knime-cornflower-dark);
      }
    }

    & .controls {
      border-left: 1px solid var(--knime-cornflower-light);
    }

    & .footer-info {
      color: var(--knime-cornflower-dark);
    }

    &::before {
      background-color: var(--knime-cornflower-semi);
    }

    &::after {
      background-color: var(--knime-cornflower);
      box-shadow:
        0 0 0 3px var(--knime-porcelain),
        0 0 0 5px var(--knime-cornflower);
    }
  }

  @media only screen and (width <= 900px) {
    width: calc(100vw - 100px);
  }
}
</style>
