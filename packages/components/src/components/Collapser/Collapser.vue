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
  padding: 0;
  font-size: 18px;
  line-height: 26px;
  font-weight: bold;
  background-color: transparent;
  border: 0;
  outline: none;
  appearance: none;
  color: inherit; /* Safari needs this */
  width: 100%;
  text-align: left;
  cursor: pointer;

  & :deep(svg) {
    position: absolute;
    margin-right: 4px;
    float: left;
    margin-left: 4px;
    top: 17px;
  }

  & .dropdown {
    text-align: center;
    position: absolute;
    right: 10px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    top: 13px;

    &:hover {
      background-color: var(--theme-button-function-background-color-hover);
    }

    & .dropdown-icon {
      position: relative;
      margin: auto;
      width: 18px;
      height: 18px;
      stroke-width: calc(32px / 18);
      stroke: var(--knime-masala);
      top: 0;
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
  margin: 0;
  padding-left: 40px;
}
</style>
