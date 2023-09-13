<script lang="ts">
import { defineComponent, markRaw, type Ref } from "vue";
import { rendererProps } from "@jsonforms/vue";
import {
  mergeDeep,
  getFlowVariablesMap,
  isModelSettingAndHasNodeView,
} from "../utils";
import LabeledInput from "./LabeledInput.vue";
import DialogComponentWrapper from "./DialogComponentWrapper.vue";
import MultiModeTwinlist from "webapps-common/ui/components/forms/MultiModeTwinlist.vue";
import { useJsonFormsControlWithUpdate } from "../composables/useJsonFormsControlWithUpdate";
import inject from "../utils/inject";
import type { IdAndText, PossibleValue } from "../types/ChoicesUiSchemaOptions";
import type Control from "../types/Control";
import type { PartialDeep } from "type-fest";
import TwinlistLoadingInfo from "./loading/TwinlistLoadingInfo.vue";

const defaultTwinlistSize = 7;
const defaultTwinlistLeftLabel = "Excludes";
const defaultTwinlistRightLabel = "Includes";

type TwinlistData = {
  mode: string;
  manualFilter: {
    manuallySelected: string[];
    manuallyDeselected: string[];
    includeUnknownColumns: boolean;
  };
  typeFilter: {
    selectedTypes: string[];
    typeDisplays: IdAndText[] | undefined;
  };
  patternFilter: {
    pattern: string;
    isInverted: boolean;
    isCaseSensitive: boolean;
  };
  selected: string[] | null | undefined;
};

type ControlWithTwinlistData = {
  [P in keyof Control]: P extends "data" ? TwinlistData : Control[P];
};

const TwinlistInput = defineComponent({
  name: "TwinListInput",
  components: {
    LabeledInput,
    DialogComponentWrapper,
    MultiModeTwinlist,
  },
  props: {
    ...rendererProps(),
    twinlistSize: {
      type: Number,
      required: false,
      default: defaultTwinlistSize,
    },
    twinlistLeftLabel: {
      type: String,
      required: false,
      default: defaultTwinlistLeftLabel,
    },
    twinlistRightLabel: {
      type: String,
      required: false,
      default: defaultTwinlistRightLabel,
    },
  },
  setup(props) {
    const jsonFormsControl = useJsonFormsControlWithUpdate(props);
    return {
      handleChange: jsonFormsControl.handleChange,
      control: jsonFormsControl.control as Ref<ControlWithTwinlistData>,
      getPossibleValuesFromUiSchema: inject("getPossibleValuesFromUiSchema"),
    };
  },
  data() {
    return {
      TwinlistLoadingInfo: markRaw(TwinlistLoadingInfo),
      possibleValues: null as null | PossibleValue[],
      previouslySelectedTypes: null as null | IdAndText[],
    };
  },
  computed: {
    isModelSettingAndHasNodeView() {
      return isModelSettingAndHasNodeView(this.control);
    },
    flowSettings() {
      return getFlowVariablesMap(this.control);
    },
    disabled() {
      return (
        !this.control.enabled ||
        Boolean(this.flowSettings?.controllingFlowVariableName)
      );
    },
    withTypes() {
      return (
        this.possibleValues !== null &&
        Boolean(this.possibleValues[0]?.hasOwnProperty("type"))
      );
    },
    showMode() {
      return (
        !this.control.uischema.options?.hasOwnProperty("showMode") ||
        this.control.uischema.options?.showMode
      );
    },
    showSearch() {
      return (
        !this.control.uischema.options?.hasOwnProperty("showSearch") ||
        this.control.uischema.options?.showSearch
      );
    },
  },
  created() {
    this.getPossibleValuesFromUiSchema(this.control).then((result) => {
      this.possibleValues = result;
      this.updateManualFilter(this.possibleValues.map((col) => col.id));
      this.previouslySelectedTypes = this.getPreviouslySelectedTypes();
    });
  },
  methods: {
    onChange(obj: PartialDeep<TwinlistData>) {
      let newData = mergeDeep(this.control.data, obj);
      this.handleChange(this.control.path, newData);
    },
    onSelectedChange({
      selected,
      isManual,
      isFirstInput,
      deselected,
    }: {
      selected: string[];
      isManual: boolean;
      isFirstInput: boolean;
      deselected: string[];
    }) {
      this.onChange({
        selected,
        ...(isManual
          ? {
              manualFilter: {
                manuallySelected: selected,
                manuallyDeselected: deselected,
              },
            }
          : {}),
      });
      /**
       * TODO: UIEXT-1122 do not use isFirstInput anymore but instead compare the value with the initial one,
       * once the initial value is set correctly in the backend.
       * */
      if (this.isModelSettingAndHasNodeView && !isFirstInput) {
        // @ts-ignore
        this.$store.dispatch("pagebuilder/dialog/dirtySettings", true);
      }
    },
    onIncludeUnknownColumnsChange(includeUnknownColumns: boolean) {
      this.onChange({ manualFilter: { includeUnknownColumns } });
    },
    /**
     *  add unknown columns either to the manually selected or manually deselected
     * @param {string[]} possibleValueIds the possible values from which unknown values are determined.
     * @returns {void}.
     */
    updateManualFilter(possibleValueIds: string[]) {
      const { manuallySelected, manuallyDeselected, includeUnknownColumns } =
        this.control.data.manualFilter;
      const unknownColumns = possibleValueIds.filter(
        (col) =>
          !manuallySelected.includes(col) && !manuallyDeselected.includes(col),
      );
      const remainingManuallyDeselected = manuallyDeselected.filter((col) =>
        possibleValueIds.includes(col),
      );
      const newData = {} as any;
      if (includeUnknownColumns) {
        newData.manualFilter = {
          manuallySelected: [...manuallySelected, ...unknownColumns],
          manuallyDeselected: remainingManuallyDeselected,
        };
      } else {
        newData.manualFilter = {
          manuallyDeselected: [
            ...remainingManuallyDeselected,
            ...unknownColumns,
          ],
        };
      }
      this.onChange(newData);
    },
    getPreviouslySelectedTypes() {
      const selectedTypesIds = this.control.data.typeFilter.selectedTypes;
      const selectedTypesToDisplayedText = this.typeDisplaysToMap(
        this.control.data.typeFilter.typeDisplays,
      );
      return selectedTypesIds.map((id) => ({
        id,
        text: selectedTypesToDisplayedText[id] || id,
      }));
    },
    typeDisplaysToMap(keyValuePairs: IdAndText[] | undefined) {
      if (typeof keyValuePairs === "undefined") {
        return {};
      }
      return keyValuePairs.reduce(
        (obj, { id, text }) => ({ ...obj, [id]: text }),
        {} as Record<string, string>,
      );
    },
    onPatternChange(pattern: string) {
      this.onChange({ patternFilter: { pattern } });
    },
    onModeChange(mode: string) {
      this.onChange({ mode: mode.toUpperCase() });
    },
    onSelectedTypesChange(selectedTypes: string[], typeDisplays: IdAndText[]) {
      this.onChange({ typeFilter: { selectedTypes, typeDisplays } });
    },
    onInversePatternChange(isInverted: boolean) {
      this.onChange({ patternFilter: { isInverted } });
    },
    onCaseSensitiveChange(isCaseSensitive: boolean) {
      this.onChange({ patternFilter: { isCaseSensitive } });
    },
  },
});
export default TwinlistInput;
</script>

<template>
  <DialogComponentWrapper :control="control">
    <LabeledInput
      v-if="control.visible"
      #default="{ labelForId }"
      :config-keys="control?.schema?.configKeys"
      :with-flow-variables="false"
      :path="control.path"
      :text="control.label"
      :show-reexecution-icon="isModelSettingAndHasNodeView"
      :description="control.description"
      @controlling-flow-variable-set="onChange"
    >
      <MultiModeTwinlist
        v-bind="$attrs"
        :id="labelForId"
        :show-mode="showMode"
        :show-search="showSearch"
        :disabled="disabled"
        :with-types="withTypes"
        :initial-selected-types="control.data.typeFilter.selectedTypes"
        :additional-possible-types="previouslySelectedTypes"
        :initial-pattern="control.data.patternFilter.pattern"
        :initial-mode="control.data.mode.toLowerCase()"
        :initial-case-sensitive-pattern="
          control.data.patternFilter.isCaseSensitive
        "
        :empty-state-component="possibleValues ? null : TwinlistLoadingInfo"
        :initial-inverse-pattern="control.data.patternFilter.isInverted"
        :initial-manually-selected="control.data.manualFilter.manuallySelected"
        :initial-include-unknown-values="
          control.data.manualFilter.includeUnknownColumns
        "
        :hide-options="possibleValues === null"
        :filter-chosen-values-on-possible-values-change="false"
        mode-label="Selection mode"
        :possible-values="possibleValues ?? []"
        :size="twinlistSize"
        :left-label="twinlistLeftLabel"
        :right-label="twinlistRightLabel"
        @input="onSelectedChange"
        @include-unknown-values-input="onIncludeUnknownColumnsChange"
        @pattern-input="onPatternChange"
        @mode-input="onModeChange"
        @types-input="onSelectedTypesChange"
        @inverse-pattern-input="onInversePatternChange"
        @case-sensitive-pattern-input="onCaseSensitiveChange"
      />
    </LabeledInput>
  </DialogComponentWrapper>
</template>

<style lang="postcss" scoped>
.twinlist :deep(.lists) :deep(.multiselect-list-box) :deep([role="listbox"]) {
  font-size: 13px;
}

.twinlist :deep(.header) :deep(.title) {
  font-size: 13px;
  font-weight: 500;
  color: var(--knime-dove-gray);
}
</style>
