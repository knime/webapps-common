import{C as y}from"./CodeExample-738e588d.js";import{_ as g,o as u,c as h,b as s,F as V,g as I,h as x,n as m,t as p,d as c,w as f,e as v,a as w,r as b}from"./index-960bb2c1.js";let _=0;const B=40,S=38,C=36,k=35,E={props:{id:{type:String,default(){return`ListBox-${_++}`}},modelValue:{type:String,default:""},size:{type:Number,default:0,validator(e){return e>=0}},isValid:{default:!0,type:Boolean},ariaLabel:{type:String,required:!0},possibleValues:{type:Array,default:()=>[],validator(e){return Array.isArray(e)?e.every(t=>t.hasOwnProperty("id")&&t.hasOwnProperty("text")):!1}}},emits:["update:modelValue"],data(){return{selectedIndex:-1,invalidPossibleValueIds:[],optionLineHeight:22}},computed:{ulSizeStyle(){const e=t=>`${t*this.optionLineHeight+2}px`;return this.size>0?{height:e(this.size)}:{minHeight:e(2)}},selectableValues(){return[...this.invalidPossibleValueIds.map(e=>this.generateInvalidItem(e)),...this.possibleValues]}},watch:{modelValue(e){this.updateSelectedIndexAndInvalidValue(e)}},mounted(){this.updateSelectedIndexAndInvalidValue(this.modelValue)},methods:{updateSelectedIndexAndInvalidValue(e){const t=this.selectableValues.findIndex(i=>i.id===e);t===-1&&e?(this.invalidPossibleValueIds.includes(e)||this.invalidPossibleValueIds.push(e),this.selectedIndex=this.selectableValues.findIndex(i=>i.id===e)):this.selectedIndex=t},isCurrentValue(e){return this.modelValue===e},setSelected(e,t){consola.trace("ListBox setSelected on",e),this.selectedIndex=t,this.$emit("update:modelValue",e)},scrollToCurrent(){let e=this.$refs.ul;if(e.scrollHeight>e.clientHeight){let t=this.$refs.options[this.selectedIndex],i=e.clientHeight+e.scrollTop,r=t.offsetTop+t.offsetHeight;r>i?e.scrollTop=r-e.clientHeight:t.offsetTop<e.scrollTop&&(e.scrollTop=t.offsetTop)}},onArrowDown(){let e=this.selectedIndex+1;e>=this.selectableValues.length||(this.setSelected(this.selectableValues[e].id,e),this.scrollToCurrent())},onArrowUp(){let e=this.selectedIndex-1;e<0||(this.setSelected(this.selectableValues[e].id,e),this.scrollToCurrent())},onEndKey(){let e=this.selectableValues.length-1;this.setSelected(this.selectableValues[e].id,e),this.$refs.ul.scrollTop=this.$refs.ul.scrollHeight},onHomeKey(){let e=0;this.setSelected(this.selectableValues[e].id,e),this.$refs.ul.scrollTop=0},handleKeyDown(e){e.keyCode===B&&(this.onArrowDown(),e.preventDefault()),e.keyCode===S&&(this.onArrowUp(),e.preventDefault()),e.keyCode===k&&(this.onEndKey(),e.preventDefault()),e.keyCode===C&&(this.onHomeKey(),e.preventDefault())},hasSelection(){return this.selectedIndex>=0},validate(){return{isValid:!this.getCurrentItem().invalid,errorMessage:null}},getCurrentItem(){return this.selectableValues[this.selectedIndex]||{id:"",text:""}},generateInvalidItem(e){return{id:e,text:`(MISSING) ${e}`,invalid:!0}},generateOptionId(e){if(!e||!e.id)return"";let t=e.id.replace(/[^\w]/gi,"");return`option-${this.id}-${t}`}}},T=["id","aria-label","aria-activedescendant"],L=["id","title","aria-selected","onClick","onFocus"];function H(e,t,i,r,o,l){return u(),h("div",{class:m(["list-box",{invalid:!i.isValid}])},[s("ul",{id:i.id,ref:"ul",role:"listbox",tabindex:"0","aria-label":i.ariaLabel,style:x(l.ulSizeStyle),"aria-activedescendant":l.generateOptionId(l.getCurrentItem()),onKeydown:t[0]||(t[0]=(...n)=>l.handleKeyDown&&l.handleKeyDown(...n))},[(u(!0),h(V,null,I(l.selectableValues,(n,a)=>(u(),h("li",{id:l.generateOptionId(n),key:`listbox-${n.id}`,ref_for:!0,ref:"options",role:"option",style:x({"line-height":`${o.optionLineHeight}px`}),title:n.text,class:m({focused:l.isCurrentValue(n.id),noselect:!0,invalid:n.invalid,empty:n.text.trim()===""}),"aria-selected":l.isCurrentValue(n.id),onClick:d=>l.setSelected(n.id,a),onFocus:d=>l.setSelected(n.id,a)},p(n.text),47,L))),128))],44,T)],2)}const D=g(E,[["render",H],["__scopeId","data-v-ed9a2d0a"]]),K=`<script>
let count = 0;
const KEY_DOWN = 40;
const KEY_UP = 38;
const KEY_HOME = 36;
const KEY_END = 35;

export default {
    props: {
        id: {
            type: String,
            default() {
                return \`ListBox-\${count++}\`;
            }
        },
        modelValue: {
            type: String,
            default: ''
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
            }
        },
        isValid: {
            default: true,
            type: Boolean
        },
        ariaLabel: {
            type: String,
            required: true
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
                return values.every(item => item.hasOwnProperty('id') && item.hasOwnProperty('text'));
            }
        }
    },
    emits: ['update:modelValue'],
    data() {
        return {
            selectedIndex: -1,
            invalidPossibleValueIds: [],
            optionLineHeight: 22
        };
    },
    computed: {
        ulSizeStyle() {
            // add two pixel to prevent scrollbar bugs
            const numToPixel = n => \`\${n * this.optionLineHeight + 2}px\`;
            return this.size > 0 ? { height: numToPixel(this.size) } : { minHeight: numToPixel(2) };
        },
        selectableValues() {
            return [...this.invalidPossibleValueIds.map(x => this.generateInvalidItem(x)), ...this.possibleValues];
        }
    },
    watch: {
        modelValue(newValue) {
            this.updateSelectedIndexAndInvalidValue(newValue);
        }
    },
    mounted() {
        this.updateSelectedIndexAndInvalidValue(this.modelValue);
    },
    methods: {
        updateSelectedIndexAndInvalidValue(value) {
            // update the selected index on start
            const idx = this.selectableValues.findIndex((item) => item.id === value);
            // not found? but the value is truthy ?
            if (idx === -1 && value) {
                // generate and add invalid value
                if (!this.invalidPossibleValueIds.includes(value)) {
                    this.invalidPossibleValueIds.push(value);
                }
                // select invalid value
                this.selectedIndex = this.selectableValues.findIndex((item) => item.id === value);
            } else {
                this.selectedIndex = idx;
            }
        },
        isCurrentValue(candidate) {
            return this.modelValue === candidate;
        },
        setSelected(value, index) {
            consola.trace('ListBox setSelected on', value);
            this.selectedIndex = index;

            /**
             * Fired when the selection changes.
             */
            this.$emit('update:modelValue', value);
        },
        scrollToCurrent() {
            let listBoxNode = this.$refs.ul;
            if (listBoxNode.scrollHeight > listBoxNode.clientHeight) {
                let element = this.$refs.options[this.selectedIndex];
                let scrollBottom = listBoxNode.clientHeight + listBoxNode.scrollTop;
                let elementBottom = element.offsetTop + element.offsetHeight;
                if (elementBottom > scrollBottom) {
                    listBoxNode.scrollTop = elementBottom - listBoxNode.clientHeight;
                } else if (element.offsetTop < listBoxNode.scrollTop) {
                    listBoxNode.scrollTop = element.offsetTop;
                }
            }
        },
        onArrowDown() {
            let next = this.selectedIndex + 1;
            if (next >= this.selectableValues.length) {
                return;
            }
            this.setSelected(this.selectableValues[next].id, next);
            this.scrollToCurrent();
        },
        onArrowUp() {
            let next = this.selectedIndex - 1;
            if (next < 0) {
                return;
            }
            this.setSelected(this.selectableValues[next].id, next);
            this.scrollToCurrent();
        },
        onEndKey() {
            let next = this.selectableValues.length - 1;
            this.setSelected(this.selectableValues[next].id, next);
            this.$refs.ul.scrollTop = this.$refs.ul.scrollHeight;
        },
        onHomeKey() {
            let next = 0;
            this.setSelected(this.selectableValues[next].id, next);
            this.$refs.ul.scrollTop = 0;
        },
        handleKeyDown(e) {
            /* NOTE: we use a single keyDown method because @keydown.up bindings are not testable. */
            if (e.keyCode === KEY_DOWN) {
                this.onArrowDown();
                e.preventDefault();
            }
            if (e.keyCode === KEY_UP) {
                this.onArrowUp();
                e.preventDefault();
            }
            if (e.keyCode === KEY_END) {
                this.onEndKey();
                e.preventDefault();
            }
            if (e.keyCode === KEY_HOME) {
                this.onHomeKey();
                e.preventDefault();
            }
        },
        hasSelection() {
            return this.selectedIndex >= 0;
        },
        validate() {
            return { isValid: !this.getCurrentItem().invalid, errorMessage: null };
        },
        getCurrentItem() {
            // selectedIndex might be -1 if value is null for example, we always return an object here
            return this.selectableValues[this.selectedIndex] || { id: '', text: '' };
        },
        generateInvalidItem(id) {
            return {
                id,
                text: \`(MISSING) \${id}\`,
                invalid: true
            };
        },
        generateOptionId(item) {
            if (!item || !item.id) {
                return '';
            }
            let cleanId = item.id.replace(/[^\\w]/gi, '');
            return \`option-\${this.id}-\${cleanId}\`;
        }
    }
};
<\/script>

<template>
  <div :class="['list-box', { 'invalid': !isValid }]">
    <ul
      :id="id"
      ref="ul"
      role="listbox"
      tabindex="0"
      :aria-label="ariaLabel"
      :style="ulSizeStyle"
      :aria-activedescendant="generateOptionId(getCurrentItem())"
      @keydown="handleKeyDown"
    >
      <li
        v-for="(item, index) of selectableValues"
        :id="generateOptionId(item)"
        :key="\`listbox-\${item.id}\`"
        ref="options"
        role="option"
        :style="{ 'line-height': \`\${optionLineHeight}px\` }"
        :title="item.text"
        :class="{
          'focused': isCurrentValue(item.id),
          'noselect': true,
          'invalid': item.invalid,
          'empty': item.text.trim() === ''
        }"
        :aria-selected="isCurrentValue(item.id)"
        @click="setSelected(item.id, index)"
        @focus="setSelected(item.id, index)"
      >
        {{ item.text }}
      </li>
    </ul>
  </div>
</template>

<style lang="postcss" scoped>
.list-box {
  position: relative;
  isolation: isolate;

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

  & [role="listbox"] {
    font-size: 14px;
    min-height: 22px;
    padding: 0;
    margin: 0;
    background: var(--theme-listbox-background-color);
    border: 1px solid var(--knime-stone-gray);

    &:focus {
      outline: none;
      border-color: var(--knime-masala);
    }
  }

  & [role="option"] {
    display: block;
    padding: 0 10px;
    line-height: 22px;
    position: relative;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    background-color: var(--theme-dropdown-background-color);
    color: var(--theme-dropdown-foreground-color);
    cursor: pointer;

    &.empty {
      white-space: pre-wrap;
    }

    &:hover {
      background: var(--theme-dropdown-background-color-hover);
      color: var(--theme-dropdown-foreground-color-hover);
    }

    &.focused {
      background: var(--theme-dropdown-background-color-selected);
      color: var(--theme-dropdown-foreground-color-selected);
    }

    /* invalid values */

    &.invalid {
      color: var(--theme-color-error);

      &.focused {
        background: var(--theme-color-error);
        color: var(--theme-dropdown-foreground-color-selected);
      }
    }
  }

  & ul[role="listbox"] {
    overflow-y: auto;
    position: relative;
  }

  & .noselect {
    user-select: none;
  }
}
</style>
`,N=`<ListBox
  v-model="selected"
  aria-label="List"
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
/>`,z={components:{ListBox:D,CodeExample:y},data(){return{codeExample:N,selected:"bar"}},computed:{code(){return K}}},A=w('<div class="grid-container"><div class="grid-item-12"><h2>ListBox</h2><p> A list of choices the user must choose one of them, so it emits an <code>input</code> event when something is selected, and it has a <code>value</code>. It can have a <code>size</code> which defines the visible items. Keyboard navigation works (<code>Up</code>/<code>Down</code> and <code>Home</code>/<code>End</code>). Second ListBox demonstrates invalid state (<code>isValid=false</code>) and has a scrollbar because it has a size of 3 elements. </p></div></div>',1),P={class:"grid-container"},$={class:"grid-item-5"},O={class:"grid-item-5"},Y={class:"grid-item-2"},U={class:"grid-container"},F={class:"grid-item-12"};function M(e,t,i,r,o,l){const n=b("ListBox",!0),a=b("CodeExample");return u(),h("div",null,[s("section",null,[A,s("div",P,[s("div",$,[c(n,{modelValue:o.selected,"onUpdate:modelValue":t[0]||(t[0]=d=>o.selected=d),"aria-label":"A List","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),s("div",O,[c(n,{modelValue:o.selected,"onUpdate:modelValue":t[1]||(t[1]=d=>o.selected=d),"aria-label":"A limited list","is-valid":!1,size:3,"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"bar2",text:"Bar 2"},{id:"bar3",text:"Bar 3"},{id:"bar4",text:"Bar 4"},{id:"bar5",text:"Bar 5"},{id:"bar6",text:"Bar 6"},{id:"bar7",text:"Bar 7"},{id:"bar8",text:"Bar 8"},{id:"bar9",text:"Bar 9"},{id:"bar10",text:"Bar 10"},{id:"bar11",text:"Bar 11"},{id:"bar12",text:"Bar 12"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),s("div",Y," selected id: "+p(o.selected),1)])]),s("section",null,[s("div",U,[s("div",F,[c(a,{summary:"Show usage example"},{default:f(()=>[v(p(o.codeExample),1)]),_:1}),c(a,{summary:"Show ListBox.vue source code"},{default:f(()=>[v(p(l.code),1)]),_:1})])])])])}const G=g(z,[["render",M]]);export{G as default};
