<script>
import DropdownIcon from "@knime/styles/img/icons/arrow-dropdown.svg";

import BaseButton from "../base/Button/BaseButton.vue";
import ExpandTransition from "../transitions/ExpandTransition.vue";

export default {
  name: "Collapser",
  components: {
    DropdownIcon,
    BaseButton,
    ExpandTransition,
  },
  props: {
    /**
     * if the initial state is expanded
     */
    initiallyExpanded: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isExpanded: this.initiallyExpanded,
    };
  },
  methods: {
    onTrigger() {
      this.isExpanded = !this.isExpanded;
    },
  },
};
</script>

<template>
  <div>
    <BaseButton
      class="button"
      :aria-expanded="String(isExpanded)"
      @click.prevent="onTrigger"
    >
      <slot name="title" />
      <div class="dropdown">
        <DropdownIcon :class="['dropdown-icon', { flip: isExpanded }]" />
      </div>
    </BaseButton>
    <ExpandTransition :is-expanded="isExpanded">
      <slot />
    </ExpandTransition>
  </div>
</template>

<style lang="postcss" scoped>
.button {
  position: relative;
  width: 100%;
  padding: 0;
  font-size: 18px;
  font-weight: bold;
  line-height: 26px;
  color: inherit; /* Safari needs this */
  text-align: left;
  appearance: none;
  cursor: pointer;
  outline: none;
  background-color: transparent;
  border: 0;

  & :deep(svg) {
    position: absolute;
    top: 17px;
    float: left;
    margin-right: 4px;
    margin-left: 4px;
  }

  & .dropdown {
    position: absolute;
    top: 13px;
    right: 10px;
    display: flex;
    align-items: center;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 50%;

    &:hover {
      background-color: var(--theme-button-function-background-color-hover);
    }

    & .dropdown-icon {
      position: relative;
      top: 0;
      width: 18px;
      height: 18px;
      margin: auto;
      stroke: var(--knime-masala);
      stroke-width: calc(32px / 18);
      transition: transform 0.4s ease-in-out;

      &.flip {
        transform: scaleY(-1);
      }
    }
  }

  &:focus .dropdown {
    /* whole button gets focus but only dropdown icon is styled */
    background-color: var(--theme-button-function-background-color-focus);
  }
}

:deep(ul),
:deep(ol) {
  padding-left: 40px;
  margin: 0;
}
</style>
