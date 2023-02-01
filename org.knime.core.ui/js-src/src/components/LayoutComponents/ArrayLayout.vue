<script>
import { defineComponent } from '@vue/composition-api';
import { useJsonFormsArrayControl, rendererProps, DispatchRenderer } from '@jsonforms/vue2';
import { composePaths } from '@jsonforms/core';
import Label from '~/webapps-common/ui/components/forms/Label.vue';
import Button from '~/webapps-common/ui/components/Button.vue';
import PlusIcon from '~/webapps-common/ui/assets/img/icons/plus.svg?inline';
import DialogComponentWrapper from '../UIComponents/DialogComponentWrapper.vue';
import ArrayLayoutItemControls from './ArrayLayoutItemControls.vue';

const ArrayLayout = defineComponent({
    name: 'ArrayLayout',
    components: {
        DispatchRenderer,
        Label,
        Button,
        PlusIcon,
        DialogComponentWrapper,
        ArrayLayoutItemControls
    },
    props: {
        ...rendererProps()
    },
    setup(props) {
        return useJsonFormsArrayControl(props);
    },
    data() {
        return {
            arrayElementTitleKey: 'arrayElementTitle'
        };
    },
    computed: {
        showSortControls() {
            return this.control.uischema.options.showSortButtons;
        },
        elements() {
            if (this.control.uischema.options.detail) {
                return Object.entries(this.control.uischema.options.detail);
            }
            return [];
        },
        showElementTitles() {
            return this.control.uischema.options.hasOwnProperty(this.arrayElementTitleKey);
        }
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
            return `${this.control.uischema.options[this.arrayElementTitleKey]} ${convertedIndex + 1}`;
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
        <div
          v-if="showElementTitles"
          class="item-header"
        >
          <Label
            :text="returnLabel(objIndex)"
            :compact="true"
          />
          <ArrayLayoutItemControls
            :is-first="objIndex === 0"
            :is-last="objIndex === control.data.length - 1"
            :show-sort-controls="showSortControls"
            @moveUp="moveUp(control.path, objIndex)()"
            @moveDown="moveDown(control.path, objIndex)()"
            @delete="deleteItem(objIndex)"
          />
        </div>
        <div
          v-for="([elemKey, element], elemIndex) in elements"
          :key="`${control.path}-${objIndex}-${elemKey}`"
          class="element"
        >
          <DispatchRenderer
            :schema="control.schema"
            :uischema="element"
            :path="createIndexedPath(objIndex)"
            :enabled="control.enabled"
            :renderers="control.renderers"
            :cells="control.cells"
          />
          <ArrayLayoutItemControls
            v-if="elemIndex === 0 && !showElementTitles"
            :is-first="objIndex === 0"
            :is-last="objIndex === control.data.length - 1"
            :show-sort-controls="showSortControls"
            @moveUp="moveUp(control.path, objIndex)()"
            @moveDown="moveDown(control.path, objIndex)()"
            @delete="deleteItem(objIndex)"
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
  }

  & .item-controls {
    display: flex;
  }

  & .element {
    display: flex;
    align-items: center;
    gap: 5px;
  }
}

& > *:last-child > * {
  margin-bottom: 0;
}
</style>
