import{C as k}from"./CodeExample-af46618b.js";import{C as O}from"./Checkbox-18e8feaf.js";import{D as E}from"./arrow-dropdown-68d58b26.js";import{_ as y,r as f,o as h,c as v,b as e,t as i,n as x,x as m,y as c,d as a,R as M,S as I,F as T,g as C,j as U,w as b,e as r,u as S}from"./index-be5f8b0e.js";const g=1,B={components:{Checkbox:O,DropdownIcon:E},props:{possibleValues:{type:Array,default:()=>[],validator(n){return Array.isArray(n)?n.every(t=>t.hasOwnProperty("id")&&t.hasOwnProperty("text")):!1}},modelValue:{type:Array,default:()=>[]},placeholder:{type:String,default:null},isValid:{type:Boolean,default:!0},separator:{type:String,default:", "},summaryMaxItemCount:{type:Number,default:1/0},summaryName:{type:String,default:null}},emits:["update:modelValue"],data(){return{checkedValue:this.modelValue,collapsed:!0}},computed:{focusOptions(){return this.$refs.option.map(n=>n.$el&&n.$el.firstChild)},summary(){return this.checkedValue.length===0?this.placeholder:this.checkedValue.length>this.summaryMaxItemCount?`${this.checkedValue.length} ${this.summaryName}`:this.possibleValues.filter(({id:n})=>this.checkedValue.indexOf(n)>-1).map(({text:n,selectedText:t=n})=>t).join(this.separator)}},watch:{modelValue:{handler(n){this.checkedValue=n},deep:!0}},methods:{getNextElement(n){return this.focusOptions[this.focusOptions.indexOf(document.activeElement)+n]||(n<0?this.focusOptions[this.focusOptions.length-1]:this.focusOptions[0])},onUpdateModelValue(n,t){t?this.checkedValue.indexOf(n)===-1&&this.checkedValue.push(n):this.checkedValue=this.checkedValue.filter(u=>u!==n),consola.trace("Multiselect value changed to",this.checkedValue),this.$emit("update:modelValue",this.checkedValue)},toggle(){this.collapsed=!this.collapsed,setTimeout(()=>{this.$refs.toggle.focus()},g)},isChecked(n){return this.checkedValue.includes(n)},closeOptions(n=!0){this.collapsed=!0,n&&setTimeout(()=>{this.$refs.toggle.focus()},g)},onUp(){document.activeElement!==this.$refs.toggle&&this.getNextElement(-1).focus()},onDown(){this.getNextElement(1).focus()},onFocusOut(){setTimeout(()=>{this.focusOptions.includes(document.activeElement)||this.closeOptions(!1)},g)},onMousedown(n){n.preventDefault(),n.stopPropagation(),n.stopImmediatePropagation()}}},D={class:"options"};function N(n,t,u,_,o,l){const d=f("DropdownIcon"),p=f("Checkbox");return h(),v("div",{class:x(["multiselect",{collapsed:o.collapsed,invalid:!u.isValid}]),onKeydown:[t[2]||(t[2]=m(c((...s)=>l.closeOptions&&l.closeOptions(...s),["stop","prevent"]),["esc"])),t[3]||(t[3]=m(c((...s)=>l.onUp&&l.onUp(...s),["stop","prevent"]),["up"])),t[4]||(t[4]=m(c((...s)=>l.onDown&&l.onDown(...s),["stop","prevent"]),["down"]))],onFocusout:t[5]||(t[5]=c((...s)=>l.onFocusOut&&l.onFocusOut(...s),["stop"])),onMousedown:t[6]||(t[6]=(...s)=>l.onMousedown&&l.onMousedown(...s))},[e("div",{ref:"toggle",role:"button",tabindex:"0",class:x({placeholder:!o.checkedValue.length}),onClick:t[0]||(t[0]=(...s)=>l.toggle&&l.toggle(...s)),onKeydown:t[1]||(t[1]=m(c((...s)=>l.toggle&&l.toggle(...s),["prevent"]),["space"]))},i(l.summary),35),a(d,{class:"icon"}),M(e("div",D,[(h(!0),v(T,null,C(u.possibleValues,s=>(h(),U(p,{ref_for:!0,ref:"option",key:`multiselect-${s.id}`,"model-value":l.isChecked(s.id),disabled:s.disabled,class:"boxes","onUpdate:modelValue":w=>l.onUpdateModelValue(s.id,w)},{default:b(()=>[r(i(s.text),1)]),_:2},1032,["model-value","disabled","onUpdate:modelValue"]))),128)),S(n.$slots,"selectAction",{},void 0,!0)],512),[[I,!o.collapsed]])],34)}const z=y(B,[["render",N],["__scopeId","data-v-4db958fa"]]),A=`<script>
import Checkbox from '../forms/Checkbox.vue';
import DropdownIcon from '../../assets/img/icons/arrow-dropdown.svg';

const BLUR_TIMEOUT = 1;

export default {
    components: {
        Checkbox,
        DropdownIcon
    },
    props: {
        /**
         * List of possible values. Each item must have an \`id\` and a \`text\` property. Optionally it can have:
         * - \`selectedText\` property that is used for displaying the list of selected items.
         *   If it is omitted, \`text\` is used instead.
         * - \`disabled\` property for disabling the corresponding checkbox so that the user can not change the value.
         * @example
         * [{
         *   id: 'pdf',
         *   text: 'PDF'
         * }, {
         *   id: 'XLS',
         *   text: 'Excel',
         *   selectedText: '.xls'
         * }]
         */
        possibleValues: {
            type: Array,
            default: () => [],
            validator(values) {
                if (!Array.isArray(values)) {
                    return false;
                }
                return values.every(item => item.hasOwnProperty('id') && item.hasOwnProperty('text'));
            }
        },
        /**
         * selected value (which is a list of ids of entries)
         */
        modelValue: {
            type: Array,
            default: () => []
        },
        /**
         * placeholder to be displayed when nothing is selected
         */
        placeholder: {
            type: String,
            default: null
        },
        isValid: {
            type: Boolean,
            default: true
        },
        /**
         * Seperator which seperates selected items in the summary.
         */
        separator: {
            type: String,
            default: ', '
        },
        /**
         * Max number of items that will be displayed in the summary.
         */
        summaryMaxItemCount: {
            type: Number,
            default: Infinity
        },
        /**
         * Name that will be used if summaryMaxItemCount is exceeded.
         */
        summaryName: {
            type: String,
            default: null
        }
    },
    emits: ['update:modelValue'],
    data() {
        return {
            checkedValue: this.modelValue,
            collapsed: true
        };
    },
    computed: {
        /**
         * @returns {Array<Element>} - HTML Elements to use for focus and events.
         */
        focusOptions() {
            return this.$refs.option.map(el => el.$el && el.$el.firstChild);
        },
        summary() {
            if (this.checkedValue.length === 0) {
                return this.placeholder;
            }

            if (this.checkedValue.length > this.summaryMaxItemCount) {
                return \`\${this.checkedValue.length} \${this.summaryName}\`;
            }

            return this.possibleValues
                .filter(({ id }) => this.checkedValue.indexOf(id) > -1)
                .map(({ text, selectedText = text }) => selectedText)
                .join(this.separator);
        }
    },
    watch: {
        modelValue: {
            handler(newValue) {
                this.checkedValue = newValue;
            },
            deep: true
        }
    },
    methods: {
        /**
         * Returns the next HTML Element from the list of items. If the current focused Element is at the top or bottom
         * of the list, this method will return the opposite end.
         *
         * @param {Number} changeInd - the positive or negative index shift for the next Element (usually 1 || -1).
         * @returns {Element} - the next option Element in the list of options.
         */
        getNextElement(changeInd) {
            return this.focusOptions[this.focusOptions.indexOf(document.activeElement) + changeInd] || (changeInd < 0
                ? this.focusOptions[this.focusOptions.length - 1]
                : this.focusOptions[0]);
        },
        onUpdateModelValue(value, toggled) {
            if (toggled) {
                if (this.checkedValue.indexOf(value) === -1) {
                    this.checkedValue.push(value);
                }
            } else {
                this.checkedValue = this.checkedValue.filter(x => x !== value);
            }
            consola.trace('Multiselect value changed to', this.checkedValue);

            /**
             * Fired when the selection changes.
             */
            this.$emit('update:modelValue', this.checkedValue);
        },
        toggle() {
            this.collapsed = !this.collapsed;
            setTimeout(() => {
                this.$refs.toggle.focus();
            }, BLUR_TIMEOUT);
        },
        isChecked(itemId) {
            return this.checkedValue.includes(itemId);
        },
        /**
         * Handle closing the options.
         *
         * @param {Boolean} [refocusToggle = true] - if the toggle button should be re-focused after closing.
         * @return {undefined}
         */
        closeOptions(refocusToggle = true) {
            this.collapsed = true;
            if (refocusToggle) {
                setTimeout(() => {
                    this.$refs.toggle.focus();
                }, BLUR_TIMEOUT);
            }
        },
        /* Handle arrow key "up" events. */
        onUp() {
            if (document.activeElement === this.$refs.toggle) {
                return;
            }
            this.getNextElement(-1).focus();
        },
        /* Handle arrow key "down" events. */
        onDown() {
            this.getNextElement(1).focus();
        },
        /* Handle focus leaving events.
         *
         * NOTE: focusout bubbles, so we can use this event to close options.
         */
        onFocusOut() {
            setTimeout(() => {
                if (!this.focusOptions.includes(document.activeElement)) {
                    this.closeOptions(false);
                }
            }, BLUR_TIMEOUT);
        },
        /*
         * Manually prevents default event bubbling and propagation for mousedown which can fire blur events that
         * interfere with the refocusing behavior. This allows the timeout to be set extremely low.
         */
        onMousedown(event) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
        }
    }
};
<\/script>

<template>
  <div
    :class="['multiselect', { collapsed, invalid: !isValid }]"
    @keydown.esc.stop.prevent="closeOptions"
    @keydown.up.stop.prevent="onUp"
    @keydown.down.stop.prevent="onDown"
    @focusout.stop="onFocusOut"
    @mousedown="onMousedown"
  >
    <div
      ref="toggle"
      role="button"
      tabindex="0"
      :class="{ placeholder: !checkedValue.length }"
      @click="toggle"
      @keydown.space.prevent="toggle"
    >
      {{ summary }}
    </div>
    <DropdownIcon class="icon" />
    <div
      v-show="!collapsed"
      class="options"
    >
      <Checkbox
        v-for="item of possibleValues"
        ref="option"
        :key="\`multiselect-\${item.id}\`"
        :model-value="isChecked(item.id)"
        :disabled="item.disabled"
        class="boxes"
        @update:model-value="onUpdateModelValue(item.id, $event)"
      >
        {{ item.text }}
      </Checkbox>
      <slot name="selectAction" />
    </div>
  </div>
</template>

<style scoped lang="postcss">
.multiselect {
  position: relative;

  &.invalid::after {
    content: "";
    position: absolute;
    width: 3px;
    left: 0;
    margin: 0;
    top: 0;
    bottom: 0;
    background-color: var(--theme-color-error);
  }

  & [role="button"] {
    margin: 0;
    border: 1px solid var(--knime-stone-gray);
    padding: 0 38px 0 10px;
    font-size: 13px;
    font-weight: 300;
    height: 40px;
    line-height: 40px; /* to center text vertically */
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &.placeholder {
      color: var(--knime-dove-gray);
    }

    &:focus {
      outline: none;
      border-color: var(--knime-masala);
    }
  }

  &:not(.collapsed) [role="button"] {
    border-color: var(--knime-masala);
  }

  &.collapsed:hover {
    background: var(--theme-multiselect-background-color-hover);
  }

  & .icon {
    width: 18px;
    height: 18px;
    stroke-width: calc(32px / 18);
    stroke: var(--knime-masala);
    position: absolute;
    right: 10px;
    top: 11px;
    pointer-events: none;
    transition: transform 0.2s ease-in-out;
  }

  &:not(.collapsed) .icon {
    transform: scaleY(-1);
  }

  & .options {
    position: absolute;
    z-index: var(--z-index-common-multiselect-expanded, 2);
    width: 100%;
    padding: 5px 10px;
    margin-top: -1px;
    background: var(--theme-multiselect-background-color);
    box-shadow: 0 1px 4px 0 var(--knime-gray-dark-semi);

    & .boxes {
      display: block;
    }
  }
}

</style>
`,L=`<Multiselect
  v-model="selected"
  placeholder="Select stuff here!"
  :possible-values="[{
    id: 'foo',
    text: 'Foo'
  }, {
    id: 'bar',
    text: 'Bar',
    disabled: true
  }, {
    id: 'baz',
    text: 'Baz',
    selectedText: 'Baz!!'
  }]"
  separator=" & "
  :summary-max-item-count="2"
  summary-name="users"
/>`,V=[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz",selectedText:"Baz!!"}],F=[{id:"buzz",text:"Buzz",disabled:!0},...V],P={components:{Multiselect:z,CodeExample:k},data(){return{codeExample:L,selected:[[],[],["foo","bar","baz"],["foo","bar","baz"],["foo","bar","baz"]],possibleValues:V,possibleValuesWithDisabled:F}},computed:{code(){return A}}},H=e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("h2",null,"Multiselect"),e("p",null,[r(" A dropdown for selecting multiple items. It acts as a form element, so it emits an "),e("code",null,"input"),r(" event when something is (de-)selected, and it has a "),e("code",null,"value"),r(". ")])])],-1),R={class:"grid-container"},j=e("div",{class:"grid-item-3"}," default ",-1),K={class:"grid-item-5"},W={class:"grid-item-3"},X=e("br",null,null,-1),Y={class:"grid-container"},q=e("div",{class:"grid-item-3"}," placeholder ",-1),G={class:"grid-item-5"},J={class:"grid-item-3"},Q=e("br",null,null,-1),Z={class:"grid-container"},$=e("div",{class:"grid-item-3"}," disabled items ",-1),ee={class:"grid-item-5"},te={class:"grid-item-3"},ne=e("br",null,null,-1),se={class:"grid-container"},oe=e("div",{class:"grid-item-3"}," custom separator ",-1),le={class:"grid-item-5"},ie={class:"grid-item-3"},ae=e("br",null,null,-1),de={class:"grid-container"},re=e("div",{class:"grid-item-3"}," summaryMaxItemCount & summaryName ",-1),ue={class:"grid-item-5"},ce={class:"grid-item-3"},pe=e("br",null,null,-1),me={class:"grid-container"},he={class:"grid-item-12"};function fe(n,t,u,_,o,l){const d=f("Multiselect",!0),p=f("CodeExample");return h(),v("div",null,[e("section",null,[H,e("div",R,[j,e("div",K,[a(d,{modelValue:o.selected[0],"onUpdate:modelValue":t[0]||(t[0]=s=>o.selected[0]=s),"possible-values":o.possibleValues},null,8,["modelValue","possible-values"])]),e("div",W," selected ids: "+i(o.selected[0]),1)]),X,e("div",Y,[q,e("div",G,[a(d,{modelValue:o.selected[1],"onUpdate:modelValue":t[1]||(t[1]=s=>o.selected[1]=s),placeholder:"Select stuff here!","possible-values":o.possibleValues},null,8,["modelValue","possible-values"])]),e("div",J," selected ids: "+i(o.selected[1]),1)]),Q,e("div",Z,[$,e("div",ee,[a(d,{modelValue:o.selected[2],"onUpdate:modelValue":t[2]||(t[2]=s=>o.selected[2]=s),placeholder:"Select stuff here!","possible-values":o.possibleValuesWithDisabled},null,8,["modelValue","possible-values"])]),e("div",te," selected ids: "+i(o.selected[2]),1)]),ne,e("div",se,[oe,e("div",le,[a(d,{modelValue:o.selected[3],"onUpdate:modelValue":t[3]||(t[3]=s=>o.selected[3]=s),placeholder:"Select stuff here!","possible-values":o.possibleValues,separator:" & "},null,8,["modelValue","possible-values"])]),e("div",ie," selected ids: "+i(o.selected[3]),1)]),ae,e("div",de,[re,e("div",ue,[a(d,{modelValue:o.selected[4],"onUpdate:modelValue":t[4]||(t[4]=s=>o.selected[4]=s),placeholder:"Select stuff here!","possible-values":o.possibleValues,"summary-max-item-count":2,"summary-name":"users"},null,8,["modelValue","possible-values"])]),e("div",ce," selected ids: "+i(o.selected[4]),1)]),pe]),e("section",null,[e("div",me,[e("div",he,[a(p,{summary:"Show usage example"},{default:b(()=>[r(i(o.codeExample),1)]),_:1}),a(p,{summary:"Show Multiselect.vue source code"},{default:b(()=>[r(i(l.code),1)]),_:1})])])])])}const ye=y(P,[["render",fe]]);export{ye as default};
