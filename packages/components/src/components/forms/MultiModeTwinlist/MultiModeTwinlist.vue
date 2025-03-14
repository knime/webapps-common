<script lang="ts">
import { type PropType, toRef } from "vue";

import FilterIcon from "@knime/styles/img/icons/filter.svg";
import { filters } from "@knime/utils";

import Checkboxes from "../Checkboxes/Checkboxes.vue";
import Label from "../Label/Label.vue";
import SearchInput from "../SearchInput/SearchInput.vue";
import Twinlist, {
  type TwinlistModelValue,
  useTwinlistModelValue,
} from "../Twinlist/Twinlist.vue";
import ValueSwitch from "../ValueSwitch/ValueSwitch.vue";
import {
  type Id,
  type PossibleValue as TwinlistPossibleValue,
} from "../possibleValues";

type PossibleType = { id: string; text: string };
type PossibleValue = TwinlistPossibleValue & { type?: PossibleType };

const allModes = {
  manual: "Manual",
  wildcard: "Wildcard",
  regex: "Regex",
  type: "Type",
};

export default {
  name: "MultiModeTwinlist",
  components: {
    Label,
    FilterIcon,
    SearchInput,
    Checkboxes,
    ValueSwitch,
    Twinlist,
  },
  props: {
    /**
     * initial values
     */
    mode: {
      type: String,
      required: false,
      default: "manual",
    },
    manualSelection: {
      type: [Object, Array, null] as PropType<TwinlistModelValue>,
      default: () => [],
    },
    pattern: {
      type: String,
      default: "",
    },
    caseSensitivePattern: {
      default: false,
      type: Boolean,
    },
    inversePattern: {
      default: false,
      type: Boolean,
    },
    withTypes: {
      type: Boolean,
      default: true,
    },
    selectedTypes: {
      type: Array as PropType<Array<string>>,
      default: () => [],
    },

    /**
     * Hiding and disabling
     */
    showMode: {
      default: true,
      type: Boolean,
    },
    // enable search in case of manual selection
    showSearch: {
      default: true,
      type: Boolean,
    },
    disabled: {
      default: false,
      type: Boolean,
    },

    /**
     * Labels
     */
    withModeLabel: {
      default: false,
      type: Boolean,
    },
    modeLabel: {
      type: String,
      required: false,
      default: "Selection mode",
    },
    withPatternLabel: {
      default: false,
      type: Boolean,
    },
    patternLabel: {
      type: String,
      required: false,
      default: "Pattern",
    },
    withTypesLabel: {
      default: false,
      type: Boolean,
    },
    typesLabel: {
      type: String,
      required: false,
      default: "Selected types",
    },
    /**
     * List of possible values. Each item must have an `id` and a `text` property
     * @example
     * [{
     *   id: 'pdf',
     *   text: 'PDF'
     * }, {
     *   id: 'XLS',
     *   text: 'Excel',
     * }]
     * For type selection, additionally, an element has to have a property `type` wich itself has properties
     * `id` and `text`, e.g.
     * [{
     *   id: 'pdf',
     *   text: 'PDF',
     *   type: {
     *     id: 'StringValue',
     *     text: 'String'
     *  }]
     */
    possibleValues: {
      type: Array as PropType<PossibleValue[]>,
      default: () => [],
    },
    /**
     * List of possible types which should be selectable but are not necessarily present in the possible values.
     */
    additionalPossibleTypes: {
      type: Array as PropType<PossibleType[]>,
      default: () => [],
    },
    compact: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    // Prop updates
    "update:manualSelection",
    "update:pattern",
    "update:selectedTypes",
    "update:mode",
    "update:caseSensitivePattern",
    "update:inversePattern",
    // Non-prop update
    "update:selected",
  ],
  setup(props) {
    const { includedValues: manuallySelected } = useTwinlistModelValue(
      toRef(props, "manualSelection"),
    );
    return { manuallySelected };
  },
  data() {
    return {
      invalidPossibleValueIds: new Set(),
    };
  },
  computed: {
    possibleValueIds() {
      return this.possibleValues.map(({ id }) => id);
    },
    possibleTypes() {
      const possibleTypes = this.possibleValues
        .map(({ type }) => type)
        .filter(Boolean) as PossibleType[];
      const possibleTypesIds = possibleTypes.map((type) => type.id);
      const additionalTypes = this.additionalPossibleTypes.filter(
        (type) => type && !possibleTypesIds.includes(type.id),
      );
      const allTypes = [...additionalTypes, ...possibleTypes];
      return allTypes
        .filter((type) => type && type.id !== "")
        .filter(
          // remove duplicates
          (val, index, self) =>
            index ===
            self.findIndex((t) => t.id === val.id && t.text === val.text),
        );
    },
    matchingValueIds() {
      return this.possibleValues
        .filter((possibleValue) => this.itemMatches(possibleValue))
        .map((possibleValue) => possibleValue.id);
    },
    twinlistModelValue() {
      return this.mode === "manual"
        ? this.manualSelection
        : this.matchingValueIds;
    },
    selectedValues() {
      return this.mode === "manual"
        ? this.manuallySelected
        : this.matchingValueIds;
    },
    selectionDisabled() {
      return this.disabled || this.mode !== "manual";
    },
    normalizedSearchTerm() {
      if (this.mode === "manual") {
        return null;
      }
      return filters[this.mode].normalize(
        this.mode === "type" ? this.selectedTypes : this.pattern,
        this.caseSensitivePattern,
      );
    },
    possibleModes() {
      let modes = Object.entries(allModes).map(([id, text]) => ({ id, text }));
      if (!this.withTypes) {
        modes = modes.filter((mode) => mode.id !== "type");
      }
      return modes;
    },
  },
  watch: {
    selectedValues: {
      immediate: true,
      handler(newVal: Id[] | null, oldVal: Id[] | null | undefined) {
        if (!oldVal || newVal === null) {
          return;
        }
        if (
          newVal.length !== oldVal.length ||
          oldVal.some((item, i) => item !== newVal[i])
        ) {
          this.$emit("update:selected", this.selectedValues);
        }
      },
    },
  },
  methods: {
    onManualInput(value: TwinlistModelValue) {
      if (this.mode === "manual") {
        this.$emit("update:manualSelection", value);
      }
    },
    onPatternInput(value: string) {
      this.$emit("update:pattern", value);
    },
    onTypeInput(value: string[]) {
      this.$emit("update:selectedTypes", value, this.possibleTypes);
    },
    onModeChange(value: keyof typeof allModes) {
      this.$emit("update:mode", value);
    },
    onToggleCaseSensitivePattern(value: boolean) {
      this.$emit("update:caseSensitivePattern", value);
    },
    onToggleInversePattern(value: boolean) {
      this.$emit("update:inversePattern", value);
    },
    validate() {
      return (this.$refs.twinlist as any).validate();
    },
    hasSelection() {
      return Boolean(this.selectedValues?.length);
    },
    itemMatches(item: PossibleValue) {
      const mode = filters[this.mode];
      return mode.test(
        this.mode === "type" ? item.type?.id : item.text,
        this.normalizedSearchTerm,
        this.caseSensitivePattern,
        this.inversePattern,
      );
    },
  },
};
</script>

<template>
  <div class="multi-mode-twinlist" :class="{ disabled }">
    <Label
      v-if="showMode"
      #default="{ labelForId }"
      :active="withModeLabel"
      :text="modeLabel"
      class="label"
    >
      <ValueSwitch
        :id="labelForId"
        ref="mode"
        :compact="compact"
        :model-value="mode"
        :disabled="disabled"
        :possible-values="possibleModes"
        @update:model-value="onModeChange"
      />
    </Label>
    <Label
      v-if="mode === 'regex' || mode === 'wildcard'"
      #default="{ labelForId }"
      :active="withPatternLabel"
      :text="patternLabel"
      class="label"
    >
      <SearchInput
        :id="labelForId"
        ref="search"
        :model-value="pattern"
        :label="patternLabel"
        :initial-case-sensitive-search="caseSensitivePattern"
        :initial-inverse-search="inversePattern"
        placeholder="Pattern"
        show-case-sensitive-search-button
        show-inverse-search-button
        :disabled="disabled"
        :tooltips="{
          inverseSearch: 'Move matching to other side',
        }"
        :compact="compact"
        @update:model-value="onPatternInput"
        @toggle-case-sensitive-search="onToggleCaseSensitivePattern"
        @toggle-inverse-search="onToggleInversePattern"
      >
        <template #icon>
          <FilterIcon />
        </template>
      </SearchInput>
    </Label>
    <Label
      v-if="mode === 'type' && possibleTypes.length > 0"
      :active="withTypesLabel"
      :text="typesLabel"
      class="label"
    >
      <Checkboxes
        :model-value="selectedTypes"
        :possible-values="possibleTypes"
        :disabled="disabled"
        @update:model-value="onTypeInput"
      />
    </Label>
    <Twinlist
      v-bind="$attrs"
      ref="twinlist"
      :disabled="selectionDisabled"
      :show-search="mode === 'manual' && showSearch"
      :model-value="twinlistModelValue"
      :possible-values="possibleValues"
      :compact="compact"
      @update:model-value="onManualInput"
    />
  </div>
</template>

<style lang="postcss" scoped>
.multi-mode-twinlist {
  display: flex;
  align-items: stretch;
  flex-direction: column;

  &.disabled {
    opacity: 0.5;
  }

  & .label {
    margin-bottom: 10px;
  }
}
</style>
