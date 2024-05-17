<script>
import { computed, defineComponent, ref, watch } from "vue";
import {
  rendererProps,
  DispatchRenderer,
  useJsonFormsArrayControl,
} from "@jsonforms/vue";
import { composePaths, toDataPath } from "@jsonforms/core";
import { useJsonFormsControlWithUpdate } from "@/nodeDialog/composables/components/useJsonFormsControlWithUpdate";
import Button from "webapps-common/ui/components/Button.vue";
import PlusIcon from "webapps-common/ui/assets/img/icons/plus.svg";
import DialogComponentWrapper from "@/nodeDialog/uiComponents/DialogComponentWrapper.vue";
import ArrayLayoutItemControls from "./ArrayLayoutItemControls.vue";
import ArrayLayoutItem from "./ArrayLayoutItem.vue";
import { useDirtySetting } from "@/nodeDialog/composables/components/useDirtySetting";
import { v4 as uuidv4 } from "uuid";
import {
  setIndex,
  deleteId,
} from "@/nodeDialog/composables/nodeDialog/useArrayIds";
import inject from "@/nodeDialog/utils/inject";

const ArrayLayout = defineComponent({
  name: "ArrayLayout",
  components: {
    DispatchRenderer,
    Button,
    PlusIcon,
    DialogComponentWrapper,
    ArrayLayoutItemControls,
    ArrayLayoutItem,
  },
  props: {
    ...rendererProps(),
  },
  setup(props) {
    const { handleChange, control } = useJsonFormsControlWithUpdate(props);
    const numElements = computed(() => control.value.data?.length ?? 0);
    const cleanArrayLength = ref(numElements.value);
    useDirtySetting({
      dataPath: control.value.path,
      value: numElements,
      valueComparator: {
        setSettings: (length) => {
          cleanArrayLength.value = length;
        },
        isModified: (length) => cleanArrayLength.value !== length,
      },
    });

    /**
     * We need to ids in the data for setting correct keys in the template and for handling updates correctly.
     */
    const dataWithId = computed(() =>
      control.value.data.map((item) =>
        item._id
          ? item
          : {
              ...item,
              _id: uuidv4(),
            },
      ),
    );
    const idsRecord = inject("createArrayAtPath")(
      toDataPath(control.value.uischema.scope),
    );
    const ids = computed(() => dataWithId.value.map(({ _id }) => _id));
    const hash = (ids) => ids.reduce((x, y) => x + y, "");

    watch(
      () => ids.value,
      (newIds, oldIds) => {
        if (oldIds && hash(newIds) === hash(oldIds)) {
          return;
        }
        newIds.forEach((id, index) => setIndex(id, index));
        oldIds
          ?.filter((id) => !newIds.includes(id))
          .forEach((id) => deleteId(id));
      },
      { immediate: true },
    );

    watch(
      () => hash(ids.value),
      () => handleChange(control.value.path, dataWithId.value),
      { immediate: true },
    );

    return {
      ...useJsonFormsArrayControl(props),
      cleanArrayLength,
      handleChange,
      signedData: dataWithId,
      idsRecord,
    };
  },
  data() {
    return {
      arrayElementTitleKey: "arrayElementTitle",
    };
  },
  computed: {
    showSortControls() {
      return this.control.uischema.options.showSortButtons;
    },
    showAddAndDeleteButtons() {
      return !this.control.uischema.options.hasFixedSize;
    },
    elements() {
      if (this.control.uischema.options.detail) {
        return Object.entries(this.control.uischema.options.detail);
      }
      return [];
    },
    arrayElementTitle() {
      return (
        this.control.uischema.options?.[this.arrayElementTitleKey] ?? false
      );
    },
    useCardLayout() {
      return this.arrayElementTitle !== false;
    },
  },
  methods: {
    createDefaultValue(schema) {
      const defaultObject = {};
      Object.keys(schema.properties).forEach((ele) => {
        defaultObject[ele] = schema.properties[ele].default;
      });
      return defaultObject;
    },
    addDefaultItem() {
      this.addItem(
        this.control.path,
        this.createDefaultValue(this.control.schema),
      )();
    },
    moveItemUp(index) {
      this.moveUp(this.control.path, index)();
    },
    moveItemDown(index) {
      this.moveDown(this.control.path, index)();
    },
    deleteItem(index) {
      this.removeItems(composePaths(this.control.path, ""), [index])();
    },
  },
});
export default ArrayLayout;
</script>

<template>
  <DialogComponentWrapper :control="control">
    <div class="array">
      <div
        v-for="(obj, objIndex) in signedData"
        :key="`${control.path}-${obj._id}`"
        :class="['item', { card: useCardLayout }]"
      >
        <ArrayLayoutItem
          :id="obj._id"
          :ids-record="idsRecord"
          :elements="elements"
          :array-element-title="arrayElementTitle"
          :path="control.path"
          :index="objIndex"
          :has-been-added="objIndex >= cleanArrayLength"
        >
          <template #renderer="{ element, path }">
            <DispatchRenderer
              :schema="control.schema"
              :uischema="element"
              :path="path"
              :enabled="control.enabled"
              :renderers="control.renderers"
              :cells="control.cells"
            />
          </template>
          <template #controls>
            <ArrayLayoutItemControls
              :is-first="objIndex === 0"
              :is-last="objIndex === control.data.length - 1"
              :show-sort-controls="showSortControls"
              :show-delete-button="showAddAndDeleteButtons"
              @move-up="moveItemUp(objIndex)"
              @move-down="moveItemDown(objIndex)"
              @delete="deleteItem(objIndex)"
            />
          </template>
        </ArrayLayoutItem>
      </div>
      <Button
        v-if="showAddAndDeleteButtons"
        class="add-item-button"
        with-border
        compact
        @click="addDefaultItem"
      >
        <PlusIcon />
        {{ control.uischema.options.addButtonText || "New" }}
      </Button>
    </div>
  </DialogComponentWrapper>
</template>

<style lang="postcss" scoped>
.array {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 10px;

  & .item {
    display: flex;
    flex-direction: column;

    &.card {
      padding: 5px 10px 10px;
      background-color: white;
      box-shadow: 0 1px 4px 0 var(--knime-gray-dark-semi);
    }
  }

  & .add-item-button {
    width: fit-content;

    &:not(:first-child) {
      margin-top: 10px;
    }
  }
}
</style>
