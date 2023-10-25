<script>
import Label from "./Label.vue";
import SearchInput from "./SearchInput.vue";
import Checkboxes from "./Checkboxes.vue";
import ValueSwitch from "./ValueSwitch.vue";
import Twinlist from "./Twinlist.vue";
import FilterIcon from "../../assets/img/icons/filter.svg";
import { filters } from "../../../util/filters";

const allModes = {
  manual: "Manual",
  wildcard: "Wildcard",
  regex: "Regex",
  type: "Type",
};

export default {
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
    initialMode: {
      type: String,
      required: false,
      default: "manual",
    },
    initialManuallySelected: {
      type: Array,
      default: () => [],
    },
    initialIncludeUnknownValues: {
      type: Boolean,
      default: false,
    },
    initialPattern: {
      type: String,
      default: "",
    },
    initialCaseSensitivePattern: {
      default: false,
      type: Boolean,
    },
    initialInversePattern: {
      default: false,
      type: Boolean,
    },
    withTypes: {
      type: Boolean,
      default: true,
    },
    initialSelectedTypes: {
      type: Array,
      default: () => [],
    },

    /**
     * Hiding and disabling
     */
    showMode: {
      default: false,
      type: Boolean,
    },
    showUnknownValues: {
      default: false,
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
      type: Array,
      default: () => [],
      validator(values) {
        if (!Array.isArray(values)) {
          return false;
        }
        return values.every(
          (item) => item.hasOwnProperty("id") && item.hasOwnProperty("text"),
        );
      },
    },
    /**
     * List of possible types which should be selectable but are not necessarily present in the possible values.
     */
    additionalPossibleTypes: {
      type: Array,
      default: () => [],
      validator(values) {
        if (!Array.isArray(values)) {
          return false;
        }
        return values.every(
          (item) => item.hasOwnProperty("id") && item.hasOwnProperty("text"),
        );
      },
    },
  },
  emits: [
    "input",
    "includeUnknownValuesInput",
    "patternInput",
    "typesInput",
    "modeInput",
    "caseSensitivePatternInput",
    "inversePatternInput",
  ],
  data() {
    return {
      chosenValues: this.initialManuallySelected,
      chosenPattern: this.initialPattern,
      chosenTypes: this.initialSelectedTypes,
      invalidPossibleValueIds: new Set(),
      mode: this.initialMode,
      caseSensitivePattern: this.initialCaseSensitivePattern,
      inversePattern: this.initialInversePattern,
      includeUnknownValues: this.initialIncludeUnknownValues,
      isFirstInput: true,
    };
  },
  computed: {
    possibleValueMap() {
      // convert [{id: "key1", text: "asdf"}, ...] to {"key1": {id:"key1", text: "asdf"} ... }
      return Object.assign(
        {},
        ...this.possibleValues.map((obj) => ({ [obj.id]: obj })),
      );
    },
    possibleValueIds() {
      return this.possibleValues.map(({ id }) => id);
    },
    possibleTypes() {
      const possibleTypes = this.possibleValues
        .map((x) => x.type)
        .filter((type) => type);
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
    selectedValues() {
      return this.mode === "manual" ? this.chosenValues : this.matchingValueIds;
    },
    deselectedValues() {
      const selectedValuesSet = new Set(this.selectedValues);
      return this.possibleValueIds.filter((id) => !selectedValuesSet.has(id));
    },
    selectionDisabled() {
      return this.disabled || this.mode !== "manual";
    },
    normalizedSearchTerm() {
      if (this.mode === "manual") {
        return null;
      }
      return filters[this.mode].normalize(
        this.mode === "type" ? this.chosenTypes : this.chosenPattern,
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
    possibleModeIds() {
      return this.possibleModes.map((mode) => mode.id);
    },
    unknownValuesVisible() {
      return this.showUnknownValues && this.mode === "manual";
    },
  },
  watch: {
    selectedValues: {
      immediate: true,
      handler(newVal, oldVal) {
        if (
          !oldVal ||
          newVal.length !== oldVal.length ||
          oldVal.some((item, i) => item !== newVal[i])
        ) {
          const isManual = this.mode === "manual";
          /**
           * TODO: UIEXT-1122 remove isFirstInput once it is not used anymore
           * */
          const isFirstInput = this.isFirstInput;
          const event = {
            selected: this.selectedValues,
            isManual,
            isFirstInput,
          };
          if (isManual) {
            event.deselected = this.deselectedValues;
          }
          this.$emit("input", event);
          this.isFirstInput = false;
        }
      },
    },
    includeUnknownValues(newVal) {
      this.$emit("includeUnknownValuesInput", newVal);
    },
  },
  methods: {
    onManualInput(value) {
      if (this.mode === "manual") {
        this.chosenValues = value;
      }
    },
    onPatternInput(value) {
      this.chosenPattern = value;
      this.$emit("patternInput", value);
    },
    onTypeInput(value) {
      this.chosenTypes = value;
      this.$emit("typesInput", value, this.possibleTypes);
    },
    onModeChange(value) {
      if (this.possibleModeIds.indexOf(value) !== -1) {
        this.mode = value;
        this.$emit("modeInput", value);
      }
    },
    onToggleCaseSensitivePattern(value) {
      this.caseSensitivePattern = value;
      this.$emit("caseSensitivePatternInput", value);
    },
    onToggleInvsersePattern(value) {
      this.inversePattern = value;
      this.$emit("inversePatternInput", value);
    },
    onUnkownColumnsInput(value) {
      this.includeUnknownValues = value;
    },
    validate() {
      return this.$refs.twinlist.validate();
    },
    hasSelection() {
      return this.selectedValues.length > 0;
    },
    itemMatches(item) {
      const mode = filters[this.mode];
      // Needed as optional chaining is currently not supported, should be removed after the switch to vue3
      // eslint-disable-next-line no-undefined
      const optionalItemType = item.type ? item.type.id : undefined;
      return mode.test(
        this.mode === "type" ? optionalItemType : item.text,
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
        :model-value="chosenPattern"
        :label="patternLabel"
        :initial-case-sensitive-search="initialCaseSensitivePattern"
        :initial-inverse-search="initialInversePattern"
        placeholder="Pattern"
        show-case-sensitive-search-button
        show-inverse-search-button
        :disabled="disabled"
        @update:model-value="onPatternInput"
        @toggle-case-sensitive-search="onToggleCaseSensitivePattern"
        @toggle-inverse-search="onToggleInvsersePattern"
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
        :model-value="chosenTypes"
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
      :model-value="selectedValues"
      :possible-values="possibleValues"
      :show-unknown-values="unknownValuesVisible"
      :initial-include-unknown-values="includeUnknownValues"
      @update:model-value="onManualInput"
      @include-unknown-values-input="onUnkownColumnsInput"
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
