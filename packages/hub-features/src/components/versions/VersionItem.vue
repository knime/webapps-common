<script setup lang="ts">
import { computed, ref } from "vue";
import { compact } from "lodash-es";

import { LocalDateTime, SubMenu, Tooltip } from "@knime/components";
import MenuIcon from "@knime/styles/img/icons/menu-options.svg";
import { truncateString } from "@knime/utils";

import HubAvatar from "../avatars/HubAvatar.vue";

import LabelList from "./LabelList.vue";
import type { NamedItemVersion, WithAvatar, WithLabels } from "./types";

const DESCRIPTION_TRUNCATE_LENGTH = 120;

const props = defineProps<{
  version: NamedItemVersion & WithAvatar & WithLabels;
  isSelected: boolean;
  hasAdminRights: boolean;
  hasEditCapability: boolean;
}>();

const emit = defineEmits<{
  select: [version: NamedItemVersion["version"] | null];
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
  if (props.isSelected) {
    emit("select", null);
  } else {
    emit("select", props.version.version);
  }
};

const menuItems = computed(() =>
  compact([
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
  ]),
);

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
  background-color: var(--knime-white);
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-items: stretch;
  padding: 10px;
  gap: 15px;
  transition: background-color 0.25s ease;

  & .tooltip {
    display: flex;
  }

  & p {
    font-size: 11px;
    line-height: 1.5;
    margin: 10px 0;
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
    overflow-wrap: anywhere;
    word-break: break-word;

    & h6 {
      display: block;
      margin: 0;
      font-size: 13px;
      line-height: 18px;
      font-weight: 700;
      transition: color 0.25s ease;
    }

    & .footer-info {
      margin: 0;
      font-size: 11px;
      line-height: 1.5;
      font-weight: 300;
      transition: color 0.25s ease;
    }
  }

  & .right {
    display: flex;
    justify-content: flex-end;
    align-items: stretch;
    width: 100px;
    gap: 8px;

    & .controls {
      display: flex;
      justify-content: center;
      flex-direction: column;
      border-left: 1px solid var(--knime-silver-sand);
      padding-left: 5px;
      margin-right: -4px;
    }
  }

  &::before {
    content: "";
    width: 12px;
    height: 12px;
    background-color: var(--knime-white);
    transform: rotateZ(45deg);
    position: absolute;
    left: -6px;
    top: 12px;
    transition: background-color 0.25s ease;
  }

  &::after {
    content: "";
    position: absolute;
    left: -24px;
    top: 15px;
    background-color: var(--knime-masala);
    width: 6px;
    height: 6px;
    border-radius: 100%;
    box-shadow: 0 0 0 0 transparent;
    transition:
      background-color 0.25s ease,
      box-shadow 0.25s ease;
  }

  &:hover {
    box-shadow: 0 2px 10px 0 var(--knime-gray-dark-semi);
    cursor: pointer;
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
