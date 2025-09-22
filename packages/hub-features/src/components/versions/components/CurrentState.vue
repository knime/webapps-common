<script setup lang="ts">
import { computed } from "vue";

import { Button, LocalDateTime, SubMenu } from "@knime/components";
import MenuIcon from "@knime/styles/img/icons/menu-options.svg";
import WrenchIcon from "@knime/styles/img/icons/wrench.svg";

import HubAvatar from "../../avatars/HubAvatar.vue";
import type { ItemSavepoint, WithAvatar, WithLabels } from "../types";

import LabelList from "./LabelList.vue";

const props = defineProps<{
  isSelected: boolean;
  hasEditCapability: boolean;
  hasPreviousVersion: boolean;
  currentStateSavepoint: ItemSavepoint & WithAvatar & WithLabels;
  isVersionLimitExceeded?: boolean;
}>();

const emit = defineEmits<{
  createVersion: [];
  discard: [];
  select: [];
}>();

const menuItems = computed(() => {
  return props.hasEditCapability && props.hasPreviousVersion
    ? [
        {
          text: "Discard",
          action: () => emit("discard"),
        },
      ]
    : [];
});

const onMenuItemClick = (_: Event, item: (typeof menuItems.value)[number]) => {
  item.action();
};
</script>

<template>
  <div class="wrapper">
    <div
      class="current-state"
      :class="{ selected: isSelected }"
      @click="!isSelected && $emit('select')"
    >
      <div class="left">
        <div class="draft">
          <h6><WrenchIcon class="draft-icon" /><span>Draft</span></h6>

          <div class="labels">
            <LabelList :labels="currentStateSavepoint.labels" />
          </div>

          <span class="date">
            Latest edits on
            <LocalDateTime
              class="date"
              show-time
              :date="currentStateSavepoint.changes[0].createdOn"
            />
          </span>
        </div>
      </div>
      <div class="right">
        <Button
          v-if="hasEditCapability && !isVersionLimitExceeded"
          with-border
          compact
          class="create-button"
          @click.stop="$emit('createVersion')"
        >
          Create version
        </Button>
        <HubAvatar
          class="profile-picture"
          v-bind="currentStateSavepoint.avatar"
        />
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
    </div>
  </div>
</template>

<style lang="postcss" scoped>
@import url("@knime/styles/css/mixins.css");

.wrapper {
  position: relative;
  margin-left: 30px;

  &::before {
    position: absolute;
    top: 0;
    left: -22px;
    width: 2px;
    height: calc(100% + 30px);
    content: "";
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 5 5'%3E%3Ccircle cx='1' cy='1' r='.5' fill='%236E6E6E'/%3E%3C/svg%3E");
    background-repeat: repeat-y;
    background-size: 5px;
  }

  & .current-state {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    background-color: var(--knime-gray-ultra-light);
    transition: background-color 0.25s ease;

    & .left {
      & .draft {
        display: flex;
        flex-direction: column;
        gap: 3px;
        word-break: normal;
        overflow-wrap: anywhere;

        & h6 {
          display: flex;
          align-items: center;
          margin: 0;
          font-size: 13px;
          font-weight: 700;
          line-height: 18px;
          transition: color 0.25s ease;

          & .draft-icon {
            @mixin svg-icon-size 20;

            padding: 4px;
            margin-right: 4px;
            background: var(--knime-carrot-light);
            border-radius: 1000px;
          }
        }

        & .labels {
          display: flex;
          flex-flow: row wrap;
          gap: 5px;
          align-items: center;
        }

        & .date {
          margin: 0;
          font-size: 11px;
          font-weight: 300;
          line-height: 16px;
          transition: color 0.25s ease;
        }
      }
    }

    & .right {
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: flex-end;

      & .create-button {
        white-space: nowrap;
      }

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
      background-color: var(--knime-gray-ultra-light);
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

          & .draft-icon {
            background: none;
            stroke: var(--knime-cornflower-dark);
          }
        }
      }

      & .controls {
        border-left: 1px solid var(--knime-cornflower-light);
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
}
</style>
