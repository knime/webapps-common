import{C as u}from"./CodeExample-7b407f07.js";import{_ as b,I as h,r as d,o as f,c as x,b as e,d as t,w as a,e as n,t as c,p as _,f as I}from"./index-0daf2d62.js";import{L as g}from"./Label-d076717b.js";const v=`<script>
let labelForId = 0;
/**
 * Default label component
 * It provides a \`labelForId\` property that can be used via slot prop destructuring to associate it with a form element
 * like so:
 *
 * @example
 *   <Label v-slot="{ labelForId }">
 *     <input :id="labelForId">
 *   </Label>
 *
 * Now, the labelForId is guaranteed to be a unique id, and when the \`label\` HTML element's \`for\` attribute is the same
 * as the input's \`id\`.
 */
export default {
    inject: {
        compactLabels: { // provided e.g. by Fieldset.vue
            default: false
        }
    },
    props: {
        generateId: {
            type: Boolean,
            default: true
        },
        idPrefix: {
            type: String,
            default: 'comp'
        },
        text: {
            default: '',
            type: String
        },
        /**
         * smaller font size and margin
         */
        compact: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        labelFor() {
            if (this.generateId) {
                return \`\${this.idPrefix}-\${this.labelForId}\`;
            }
            return null;
        },
        labelId() {
            if (this.generateId) {
                return \`label-\${this.labelFor}\`;
            }
            return null;
        },
        isCompact() {
            return this.compact || this.compactLabels;
        }
    },
    beforeCreate() {
        labelForId += 1;
        this.labelForId = labelForId;
    }
};
<\/script>

<template>
  <div class="label-wrapper">
    <label
      :id="labelId"
      :for="labelFor"
      :class="['label-text', {compact: isCompact}]"
      v-text="text"
    />
    <slot :label-for-id="labelFor" />
  </div>
</template>

<style lang="postcss" scoped>
.label-wrapper {
  margin-top: 0;
}

.label-text {
  font-weight: 700;
  font-size: 16px;
  font-family: var(--theme-text-bold-font-family);
  color: var(--theme-text-bold-color);
  line-height: 20px;
  display: block;
  width: max-content;
  margin-bottom: 10px;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 100%;

  &.compact {
    font-weight: 500;
    font-size: 13px;
    font-family: var(--theme-text-medium-font-family);
    color: var(--theme-text-medium-color);
    line-height: 18px;
    margin-bottom: 3px;
  }
}
</style>
`;const y=`<!-- The labelForId syntax is used to associate the label with the form field -->
<Label
  v-slot="{ labelForId }"
  text="Label for a field"
>
    <!-- The id attribute will be replaced with a generated unique ID -->
    <InputField
      :id="labelForId"
      type="text"
      placeholder="I'm a placeholder"
    />
</Label>
<Label
  v-slot="{ labelForId }"
  text="Compact label for a field"
  compact
>
  <InputField
    :id="labelForId"
    type="text"
    placeholder="I'm a placeholder"
  />
</Label>`,F={components:{InputField:h,Label:g,CodeExample:u},data(){return{codeExample:y}},computed:{code(){return v}}},w=l=>(_("data-v-0a02e987"),l=l(),I(),l),L=w(()=>e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("h2",null,"Label"),e("p",null,[n(" Labels for form fields. Beside their default size, they come with a smaller one as well which can be enabled by setting the "),e("code",null,"compact"),n(" prop or "),e("a",{href:"https://vuejs.org/v2/guide/components-edge-cases.html#Dependency-Injection"},"providing"),n("  "),e("code",null,"compactLabels: true"),n(". ")])])],-1)),C={class:"grid-container"},S={class:"grid-item-6"},B={class:"grid-item-6"},E={class:"grid-container"},$={class:"grid-item-12"};function k(l,z,D,N,p,m){const i=d("InputField"),r=d("Label",!0),s=d("CodeExample");return f(),x("div",null,[e("section",null,[L,e("div",C,[e("div",S,[t(r,{text:"Label for a field"},{default:a(({labelForId:o})=>[t(i,{id:o,type:"text",placeholder:"I'm a placeholder"},null,8,["id"])]),_:1})]),e("div",B,[t(r,{text:"Compact label for a field",compact:""},{default:a(({labelForId:o})=>[t(i,{id:o,type:"text",placeholder:"I'm a placeholder"},null,8,["id"])]),_:1})])])]),e("section",null,[e("div",E,[e("div",$,[t(s,{summary:"Show usage example"},{default:a(()=>[n(c(p.codeExample),1)]),_:1}),t(s,{summary:"Show Label.vue source code"},{default:a(()=>[n(c(m.code),1)]),_:1})])])])])}const q=b(F,[["render",k],["__scopeId","data-v-0a02e987"]]);export{q as default};
