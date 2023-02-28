<script>
import FunctionButton from 'webapps-common/ui/components/FunctionButton.vue';
import TrashIcon from 'webapps-common/ui/assets/img/icons/trash.svg';
import ArrowUpIcon from 'webapps-common/ui/assets/img/icons/arrow-up.svg';
import ArrowDownIcon from 'webapps-common/ui/assets/img/icons/arrow-down.svg';

export default {
    name: 'ArrayLayoutItemControls',
    components: {
        TrashIcon,
        FunctionButton,
        ArrowUpIcon,
        ArrowDownIcon
    },
    props: {
        isFirst: {
            type: Boolean,
            default: false
        },
        isLast: {
            type: Boolean,
            default: false
        },
        showSortControls: {
            type: Boolean,
            default: false
        }
    },
    emits: ['moveUp', 'moveDown', 'delete']
};
</script>

<template>
  <div class="item-controls">
    <FunctionButton
      v-if="showSortControls"
      :disabled="isFirst"
      @click="$emit('moveUp')"
    >
      <ArrowUpIcon />
    </FunctionButton>
    <FunctionButton
      v-if="showSortControls"
      :disabled="isLast"
      @click="$emit('moveDown')"
    >
      <ArrowDownIcon />
    </FunctionButton>
    <FunctionButton
      class="trashButton"
      @click="$emit('delete')"
    >
      <TrashIcon class="trash" />
    </FunctionButton>
  </div>
</template>

<style lang="postcss" scoped>
  & .item-controls {
    display: flex;
  }
</style>
