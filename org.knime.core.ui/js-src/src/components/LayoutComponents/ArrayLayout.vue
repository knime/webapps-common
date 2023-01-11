<script>
import { defineComponent } from '@vue/composition-api';
import { useJsonFormsArrayControl, rendererProps, DispatchRenderer } from '@jsonforms/vue2';
import { composePaths } from '@jsonforms/core';
import Label from '~/webapps-common/ui/components/forms/Label.vue';
import Button from '~/webapps-common/ui/components/Button.vue';
import FunctionButton from '~/webapps-common/ui/components/FunctionButton.vue';
import TrashIcon from '~/webapps-common/ui/assets/img/icons/trash.svg?inline';
import PlusIcon from '~/webapps-common/ui/assets/img/icons/plus.svg?inline';
import DialogComponentWrapper from '../UIComponents/DialogComponentWrapper.vue';
import ArrowUpIcon from '~/webapps-common/ui/assets/img/icons/arrow-up.svg?inline';
import ArrowDownIcon from '~/webapps-common/ui/assets/img/icons/arrow-down.svg?inline';

const ArrayLayout = defineComponent({
    name: 'ArrayLayout',
    components: {
        DispatchRenderer,
        Label,
        Button,
        TrashIcon,
        PlusIcon,
        FunctionButton,
        DialogComponentWrapper,
        ArrowUpIcon,
        ArrowDownIcon
    },
    props: {
        ...rendererProps()
    },
    setup(props) {
        return useJsonFormsArrayControl(props);
    },
    methods: {
        createDefaultValue(schema) {
            const defaultObject = {};
            Object.keys(schema.properties).forEach(ele => {
                defaultObject[ele] = schema.properties[ele].default;
            });
            return defaultObject;
        },
        addDefaultItem() {
            this.addItem(this.control.path,
                this.createDefaultValue(this.control.schema))();
        },
        createIndexedPath(index) {
            return composePaths(this.control.path, `${index}`);
        },
        deleteItem(index) {
            this.removeItems(composePaths(this.control.path, ''),
                [index])();
        },
        returnLabel(index) {
            let convertedIndex = parseInt(index, 10);
            return `${this.control.uischema.options.arrayElementTitle} ${convertedIndex + 1}`;
        }
    }
});
export default ArrayLayout;
</script>

<template>
  <DialogComponentWrapper :control="control">
    <div
      class="array"
    >
      <div
        v-for="(obj, objIndex) in control.data"
        :key="`${control.path}-${objIndex}`"
      >
        <div class="item-header">
          <Label
            :text="returnLabel(objIndex)"
            :compact="true"
          />
          <div class="item-controls">
            <FunctionButton
              v-if="control.uischema.options.showSortButtons"
              :disabled="objIndex === 0"
              @click="moveUp(control.path, objIndex)()"
            >
              <ArrowUpIcon />
            </FunctionButton>
            <FunctionButton
              v-if="control.uischema.options.showSortButtons"
              :disabled="objIndex === control.data.length - 1"
              @click="moveDown(control.path, objIndex)()"
            >
              <ArrowDownIcon />
            </FunctionButton>
            <FunctionButton
              class="trashButton"
              @click="deleteItem(objIndex)"
            >
              <TrashIcon class="trash" />
            </FunctionButton>
          </div>
        </div>
        <div
          v-for="(element, elemIndex) in control.uischema.options.detail"
          :key="`${control.path}-${objIndex}-${elemIndex}`"
        >
          <DispatchRenderer
            :schema="control.schema"
            :uischema="element"
            :path="createIndexedPath(objIndex)"
            :enabled="control.enabled"
            :renderers="control.renderers"
            :cells="control.cells"
          />
        </div>
      </div>
      <Button
        with-border
        compact
        @click="addDefaultItem"
      >
        <PlusIcon />
        {{ control.uischema.options.addButtonText }}
      </Button>
    </div>
  </DialogComponentWrapper>
</template>

<style lang="postcss" scoped>
.array {
  margin-bottom: 30px;

  & .item-header {
    margin-bottom: 10px;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: baseline;

    & .item-controls {
      display: flex;
    }
  }
}

& > *:last-child > * {
  margin-bottom: 0;
}
</style>
