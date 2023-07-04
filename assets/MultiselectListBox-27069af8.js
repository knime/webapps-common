import{C as h}from"./CodeExample-72dd01e8.js";import{M as m}from"./MultiselectListBox-31349328.js";import{_ as x,r as a,o as f,c as b,b as e,d as s,t as o,w as r,e as c,a as p}from"./index-85207604.js";import"./StyledListItem-76f350fd.js";const v=`<script>
import debounce from "../../../util/debounce";
import StyledListItem from "../StyledListItem.vue";

let count = 0;
const CLICK_META_KEY_TIMEOUT = 250; // ms

export default {
  components: { StyledListItem },
  props: {
    id: {
      type: String,
      default() {
        return \`MultiselectListBox-\${count++}\`;
      },
    },
    modelValue: {
      type: Array,
      default: () => [],
    },
    disabled: {
      default: false,
      type: Boolean,
    },
    withIsEmptyState: {
      default: false,
      type: Boolean,
    },
    emptyStateLabel: {
      default: "No entries in this list",
      type: String,
    },
    /**
     * If enabled the single click will allow the user to select multiple items, otherwise this only works with
     * CTRL + Click (similar to <select> html widgets)
     */
    multiselectByClick: {
      type: Boolean,
      default: false,
    },
    /**
     * Bottom values
     */
    withBottomValue: {
      type: Boolean,
      default: false,
    },
    bottomValue: {
      type: Object,
      default: () => ({ id: "bottom", text: "Other" }),
      validator(value) {
        return value.hasOwnProperty("id") && value.hasOwnProperty("text");
      },
    },
    /**
     * Controls the size of the list. Number of visible items (for others user need to scroll)
     * 0 means all
     */
    size: {
      type: Number,
      default: 0,
      validator(value) {
        return value >= 0;
      },
    },
    isValid: {
      default: true,
      type: Boolean,
    },
    ariaLabel: {
      type: String,
      required: true,
    },
    /**
     * List of possible values. Each item must have an \`id\` and a \`text\` property
     * @example
     * [{
     *   id: 'pdf',
     *   text: 'PDF'
     * }, {
     *   id: 'XLS',
     *   text: 'Excel',
     * }]
     */
    possibleValues: {
      type: Array,
      default: () => [],
      validator(values) {
        if (!Array.isArray(values)) {
          return false;
        }
        return values.every(
          (item) => item.hasOwnProperty("id") && item.hasOwnProperty("text")
        );
      },
    },
  },
  emits: [
    "update:modelValue",
    "doubleClickOnItem",
    "doubleClickShift",
    "keyArrowLeft",
    "keyArrowRight",
  ],
  data() {
    return {
      selectedValues: this.modelValue,
      // indices for mouse and keyboard nav
      currentKeyNavIndex: 0,
      shiftStartIndex: -1,
      draggingStartIndex: -1,
      draggingInverseMode: false,
      // visual
      optionLineHeight: 22,
    };
  },
  computed: {
    cssStyleSize() {
      // add two pixel to prevent scrollbar bugs
      const pxSize = \`\${this.size * this.optionLineHeight + 2}px\`;
      return this.size > 0 ? { height: pxSize } : {};
    },
    possibleValuesWithBottom() {
      return [
        ...this.possibleValues,
        ...(this.withBottomValue ? [this.bottomValue] : []),
      ];
    },
    bottomIndex() {
      return this.possibleValues.length;
    },
    showEmptyState() {
      return this.withIsEmptyState && this.possibleValues.length === 0;
    },
  },
  watch: {
    modelValue: {
      handler(newValue) {
        this.selectedValues = newValue;
      },
      deep: true,
    },
  },
  mounted() {
    window.addEventListener("mouseup", this.onStopDrag);
    // set key nav index to last value
    if (this.modelValue.length > 0) {
      const lastItem = this.modelValue[this.modelValue.length - 1];
      this.currentKeyNavIndex = this.possibleValues
        .map((x) => x.id)
        .indexOf(lastItem);
    }
  },
  beforeUnmount() {
    window.removeEventListener("mouseup", this.onStopDrag);
  },
  created() {
    // the mac emits the click event  multiple times when the metaKey (cmd/command) is hold
    // this does not work well with the toggling of selected items, therefore we debounce it
    this.debouncedHandleCtrlClick = debounce(
      this.handleCtrlClick,
      CLICK_META_KEY_TIMEOUT
    );
  },
  methods: {
    isCurrentValue(candidate) {
      return this.selectedValues.includes(candidate);
    },
    handleCtrlClick(value, index) {
      this.currentKeyNavIndex = index;
      this.toggleSelection(value);
    },
    handleShiftClick(value, clickedIndex) {
      this.setSelected(
        this.getPossibleValuesInSection(this.currentKeyNavIndex, clickedIndex)
      );
    },
    /**
     * Returns all value ids (String) for two indices no matter which one is the start/end index
     * @param {Number} firstIndex - index a
     * @param {Number} secondIndex - index b
     * @returns {String[]}
     */
    getPossibleValuesInSection(firstIndex, secondIndex) {
      const start = firstIndex > secondIndex ? secondIndex : firstIndex;
      const end = firstIndex > secondIndex ? firstIndex : secondIndex;
      return this.possibleValuesWithBottom
        .slice(start, end + 1)
        .map((x) => x.id);
    },
    onStartDrag(e, isBottom = false) {
      if (this.disabled) {
        return;
      }
      // do not start drag if we press shift
      if (e.shiftKey) {
        return;
      }
      // enable inverse mode on ctrl key
      if (e.ctrlKey || e.metaKey) {
        this.draggingInverseMode = true;
      }
      const index = isBottom
        ? this.bottomIndex
        : e.target.getAttribute("data-option-index");
      if (index) {
        this.draggingStartIndex = Number(index);
      }
    },
    onDrag(e) {
      if (this.draggingStartIndex !== -1) {
        const dataIndex = e.target.getAttribute("data-option-index");
        if (!dataIndex) {
          return;
        }
        const index = Number(dataIndex);
        let sectionValues = this.getPossibleValuesInSection(
          this.draggingStartIndex,
          index
        );
        // inverse mode means we remove all selected values from the current selection
        if (this.draggingInverseMode) {
          sectionValues = this.selectedValues.filter(
            (x) => !sectionValues.includes(x)
          );
        }
        this.setSelected(sectionValues);
      }
    },
    onBottomStartDrag(e) {
      this.focus();
      this.onStartDrag(e);
    },
    onBottomDrag(e) {
      this.focus();
      this.onDrag(e);
    },
    onStopDrag() {
      this.draggingStartIndex = -1;
      this.draggingInverseMode = false;
    },
    handleClick($event, value, index) {
      if (this.disabled) {
        return;
      }
      $event.preventDefault();
      if ($event.metaKey) {
        // mac requires debouncing
        this.debouncedHandleCtrlClick(value, index);
        return; // end here
      }
      if ($event.ctrlKey) {
        this.handleCtrlClick(value, index);
        return; // end here
      }
      if ($event.shiftKey) {
        this.handleShiftClick(value, index);
        return; // end here
      }
      // regular click
      if (!this.multiselectByClick) {
        this.selectedValues = [];
      }
      this.currentKeyNavIndex = index;
      this.toggleSelection(value);
    },
    handleDblClick(id, index) {
      if (this.disabled) {
        return;
      }
      this.$emit("doubleClickOnItem", id, index);
    },
    handleBottomClick($event) {
      this.handleClick($event, this.bottomValue.id, this.bottomIndex);
      this.focus();
    },
    handleBottomDblClick() {
      this.handleDblClick(this.bottomValue.id, this.bottomIndex);
    },
    handleShiftDblClick() {
      if (this.disabled) {
        return;
      }
      this.$emit("doubleClickShift", this.selectedValues);
    },
    addToSelection(value) {
      let added = false;
      const selectedValues = this.selectedValues;
      if (!selectedValues.includes(value)) {
        selectedValues.push(value);
        added = true;
      }
      this.setSelected(selectedValues);
      return added;
    },
    removeFromSelection(value) {
      let removed = false;
      const selectedValues = this.selectedValues;
      if (selectedValues.includes(value)) {
        selectedValues.splice(selectedValues.indexOf(value), 1);
        removed = true;
      }
      this.setSelected(selectedValues);
      return removed;
    },
    toggleSelection(value) {
      if (this.selectedValues.includes(value)) {
        this.removeFromSelection(value);
      } else {
        this.addToSelection(value);
      }
    },
    setSelectedNoShiftReset(values) {
      consola.trace("MultiselectListBox setSelected on", values);
      this.selectedValues = values;
      this.$emit("update:modelValue", values);
    },
    setSelected(values) {
      // reset shift start index on every change to selected values but shift operations itself
      this.shiftStartIndex = -1;
      this.setSelectedNoShiftReset(values);
    },
    setSelectedToIndex(index) {
      const item = this.possibleValuesWithBottom[index];
      if (item && item.id) {
        this.setSelected([item.id]);
      }
    },
    scrollToCurrent() {
      if (this.currentKeyNavIndex === this.bottomIndex) {
        return;
      }
      const listBoxNode = this.$refs.ul;
      if (listBoxNode.scrollHeight > listBoxNode.clientHeight) {
        // Vue does not guarantee the correct oder of $refs arrays defined in v-for.
        // See: https://github.com/vuejs/vue/issues/4952#issuecomment-280661367
        // To prevent this bug we use the DOM children of the parent to find the correct element.
        const element = this.$refs.ul.children[this.currentKeyNavIndex];
        const scrollBottom = listBoxNode.clientHeight + listBoxNode.scrollTop;
        const elementBottom = element.offsetTop + element.offsetHeight;
        if (elementBottom > scrollBottom) {
          listBoxNode.scrollTop = elementBottom - listBoxNode.clientHeight;
        } else if (element.offsetTop < listBoxNode.scrollTop) {
          listBoxNode.scrollTop = element.offsetTop;
        }
      }
    },
    isOutOfRange(index) {
      if (index < 0) {
        return true;
      }
      if (this.withBottomValue) {
        return index > this.bottomIndex;
      } else {
        return index >= this.bottomIndex;
      }
    },
    onArrowDown() {
      if (this.disabled) {
        return;
      }
      const next = this.currentKeyNavIndex + 1;
      if (this.isOutOfRange(next)) {
        return;
      }
      this.setSelectedToIndex(next);
      this.currentKeyNavIndex = next;
      this.scrollToCurrent();
    },
    onArrowUp() {
      if (this.disabled) {
        return;
      }
      const next = this.currentKeyNavIndex - 1;
      if (this.isOutOfRange(next)) {
        return;
      }
      this.setSelectedToIndex(next);
      this.currentKeyNavIndex = next;
      this.scrollToCurrent();
    },
    onArrowDownShift() {
      if (this.disabled) {
        return;
      }
      // set start index if this is the first shift up/down op
      if (this.shiftStartIndex === -1) {
        this.shiftStartIndex = this.currentKeyNavIndex;
      }
      const next = this.currentKeyNavIndex + 1;
      if (this.isOutOfRange(next)) {
        return;
      }
      this.setSelectedNoShiftReset(
        this.getPossibleValuesInSection(this.shiftStartIndex, next)
      );
      this.currentKeyNavIndex = next;
      this.scrollToCurrent();
    },
    onArrowUpShift() {
      if (this.disabled) {
        return;
      }
      // set start index if this is the first shift up/down op
      if (this.shiftStartIndex === -1) {
        this.shiftStartIndex = this.currentKeyNavIndex;
      }
      const next = this.currentKeyNavIndex - 1;
      if (this.isOutOfRange(next)) {
        return;
      }
      this.setSelectedNoShiftReset(
        this.getPossibleValuesInSection(this.shiftStartIndex, next)
      );
      this.currentKeyNavIndex = next;
      this.scrollToCurrent();
    },
    onEndKey() {
      const next = this.possibleValues.length - 1;
      this.setSelectedToIndex(next);
      this.currentKeyNavIndex = next;
      this.$refs.ul.scrollTop = this.$refs.ul.scrollHeight;
    },
    onHomeKey() {
      const next = 0;
      this.setSelectedToIndex(next);
      this.currentKeyNavIndex = next;
      this.$refs.ul.scrollTop = 0;
    },
    onArrowLeft() {
      if (this.disabled) {
        return;
      }
      this.$emit("keyArrowLeft", this.selectedValues);
    },
    onArrowRight() {
      if (this.disabled) {
        return;
      }
      this.$emit("keyArrowRight", this.selectedValues);
    },
    onCtrlA() {
      if (this.disabled) {
        return;
      }
      // select all
      this.setSelected(this.possibleValuesWithBottom.map((x) => x.id));
    },
    hasSelection() {
      return this.selectedValues.length > 0;
    },
    getCurrentKeyNavItem() {
      try {
        return this.possibleValues[this.currentKeyNavIndex];
      } catch (e) {
        return {
          id: "",
          text: "",
        };
      }
    },
    generateOptionId(item) {
      if (!item) {
        return "";
      }
      const id = typeof item.id === "symbol" ? item.id.description : item.id;
      const cleanId = id.replace(/[^\\w]/gi, "");
      return \`option-\${this.id}-\${cleanId}\`;
    },
    focus() {
      if (this.disabled) {
        return;
      }
      this.$refs.ul.focus();
    },
    clearSelection() {
      if (this.disabled) {
        return;
      }
      this.setSelected([]);
    },
  },
};
<\/script>

<template>
  <div
    :class="['multiselect-list-box', { invalid: !isValid, disabled }]"
    :style="cssStyleSize"
  >
    <div class="box">
      <ul
        :id="id"
        ref="ul"
        role="listbox"
        tabindex="0"
        :class="{ disabled, 'empty-box': showEmptyState }"
        :aria-label="ariaLabel"
        :aria-activedescendant="generateOptionId(getCurrentKeyNavItem())"
        @keydown.ctrl.a.prevent.exact="onCtrlA"
        @keydown.up.prevent.exact="onArrowUp"
        @keydown.down.prevent.exact="onArrowDown"
        @keydown.shift.up.prevent.exact="onArrowUpShift"
        @keydown.shift.down.prevent.exact="onArrowDownShift"
        @keydown.left.prevent.exact="onArrowLeft"
        @keydown.right.prevent.exact="onArrowRight"
        @keydown.home.prevent.exact="onHomeKey"
        @keydown.end.prevent.exact="onEndKey"
        @mousedown="onStartDrag"
        @mousemove="onDrag"
      >
        <StyledListItem
          v-for="(item, index) of possibleValues"
          :id="generateOptionId(item)"
          :key="\`listbox-\${item.id}\`"
          :text="item.text"
          :data-option-index="index"
          :line-height="optionLineHeight"
          :selected="isCurrentValue(item.id)"
          :invalid="item.invalid"
          :disabled="disabled"
          @click="handleClick($event, item.id, index)"
          @dblclick-shift="handleShiftDblClick()"
          @dblclick-exact="handleDblClick(item.id, index)"
        />
      </ul>
      <div v-if="showEmptyState" class="empty-state">
        <span>
          {{ emptyStateLabel }}
        </span>
      </div>
      <div v-if="withBottomValue" role="bottom-box">
        <StyledListItem
          :id="generateOptionId(bottomValue)"
          special
          :text="bottomValue.text"
          :data-option-index="bottomIndex"
          :selected="isCurrentValue(bottomValue.id)"
          :disabled="disabled"
          @click="handleBottomClick"
          @dblclick-shift="handleShiftDblClick()"
          @dblclick-exact="handleBottomDblClick"
          @mousedown="onBottomStartDrag"
          @mousemove="onBottomDrag"
        />
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.multiselect-list-box {
  position: relative; /* required by .invalid::after */
  isolation: isolate;
  display: flex;
  align-items: stretch;
  flex-direction: column;

  &.invalid {
    &::after {
      content: "";
      position: absolute;
      width: 3px;
      left: 0;
      margin: 0;
      top: 0;
      bottom: 0;
      background-color: var(--theme-color-error);
    }
  }

  & .box {
    height: 100%;
    width: 100%;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    font-size: 14px;
    min-height: 22px;
    border: 1px solid var(--knime-stone-gray);

    &:has(:focus:not(.disabled)) {
      border-color: var(--knime-masala);
    }

    & [role="bottom-box"] {
      border-top: 1px solid var(--knime-silver-sand);
      background: var(--theme-multiselect-listbox-background-color);
      flex-grow: 0;
      flex-shrink: 0;
    }
  }

  /* this selector is required to override some * rules which interfere - so do not simplify */
  & ul[role="listbox"] {
    background: var(--theme-multiselect-listbox-background-color);
    overflow-y: auto;
    position: relative;
    padding: 0;
    margin: 0;
    flex-grow: 1;

    &.empty-box {
      background: var(--theme-empty-multiselect-listbox-background-color);
    }

    &:focus {
      outline: none;
    }
  }

  & .empty-state {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    & span {
      color: var(--theme-dropdown-foreground-color);
      font-style: italic;
      font-size: 10px;
    }
  }

  &.disabled {
    opacity: 0.5;
  }
}
</style>
`,g=`<MultiselectListBox
  v-model="selected"
  :size="4"
  aria-label="Select stuff here!"
  :possible-values="[{
    id: 'foo',
    text: 'Foo'
  }, {
    id: 'bar',
    text: 'Bar'
  }, {
    id: 'baz',
    text: 'Baz'
  }]"
/>`,y={components:{MultiselectListBox:m,CodeExample:h},data(){return{codeExample:g,selected:[],disabledSelected:[],selected2:[],disabledSelected2:[],bottomValueSymbol:Symbol("bottom value")}},computed:{code(){return v}}},S=p('<div class="grid-container"><div class="grid-item-12"><p> A list box for selecting multiple items. It acts as a form element, so it emits an <code>input</code> event when something is (de-)selected, and it has a <code>value</code>. It has keyboard navigation with <code>Up</code>, <code>Down</code>, <code>Home</code>, <code>End</code>. It is possible to multi select via keyboard with <code>Shift+Up</code> and <code>Shift+Down</code>. Selective multi select is possible by <code>Ctrl+Click</code> or <code>Shift+Click</code>. Also multi select by dragging is supported. </p></div></div>',1),I={class:"grid-container"},w={class:"grid-item-6"},V={class:"grid-item-6"},B=e("br",null,null,-1),k={class:"grid-container"},z={class:"grid-item-6"},C={class:"grid-item-6"},_=e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null," The MulitselectListBox can display a bottom element (visually different but funcionally equivalent to an element lying below all other elements). The total size of the box does not depend on the bottom element (i.e. less elements are shown instead). ")])],-1),N={class:"grid-container"},K={class:"grid-item-6"},D={class:"grid-item-6"},L=e("br",null,null,-1),T={class:"grid-container"},A={class:"grid-item-6"},O={class:"grid-item-6"},E={class:"grid-container"},M={class:"grid-item-12"};function R(H,n,$,U,t,u){const l=a("MultiselectListBox",!0),d=a("CodeExample");return f(),b("div",null,[e("section",null,[S,e("div",I,[e("div",w,[s(l,{modelValue:t.selected,"onUpdate:modelValue":n[0]||(n[0]=i=>t.selected=i),size:4,"aria-label":"Select stuff here!","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"}]},null,8,["modelValue"])]),e("div",V,"selected ids: "+o(t.selected),1)]),B,e("div",k,[e("div",z,[s(l,{modelValue:t.disabledSelected,"onUpdate:modelValue":n[1]||(n[1]=i=>t.disabledSelected=i),size:4,"aria-label":"Disabled...","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"}],disabled:""},null,8,["modelValue"])]),e("div",C,"selected ids: "+o(t.disabledSelected),1)]),_,e("div",N,[e("div",K,[s(l,{modelValue:t.selected2,"onUpdate:modelValue":n[2]||(n[2]=i=>t.selected2=i),size:4,"aria-label":"Select stuff here!","with-bottom-value":"","bottom-value":{id:t.bottomValueSymbol,text:"Custom text"},"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"}]},null,8,["modelValue","bottom-value"])]),e("div",D,"selected ids: "+o(t.selected2),1)]),L,e("div",T,[e("div",A,[s(l,{modelValue:t.disabledSelected2,"onUpdate:modelValue":n[3]||(n[3]=i=>t.disabledSelected2=i),size:4,"aria-label":"Disabled...","with-bottom-value":"","bottom-value":{id:t.bottomValueSymbol,text:"Custom text"},"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"}],disabled:""},null,8,["modelValue","bottom-value"])]),e("div",O,"selected ids: "+o(t.disabledSelected2),1)])]),e("section",null,[e("div",E,[e("div",M,[s(d,{summary:"Show usage example"},{default:r(()=>[c(o(t.codeExample),1)]),_:1}),s(d,{summary:"Show MultiselectListBox.vue source code"},{default:r(()=>[c(o(u.code),1)]),_:1})])])])])}const W=x(y,[["render",R]]);export{W as default};
