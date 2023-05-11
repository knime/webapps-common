import{C as b}from"./CodeExample-1122a323.js";import{_ as h,I as f,o as _,c as x,b as e,d as t,w as a,e as l,t as c,r as s,p as I,f as v}from"./index-c99bab3b.js";import{L as g}from"./Label-aeebddf1.js";const y=`<script>
let labelForId = 0;
/**
 * Default label component
 * It provides a \`labelForId\` property that can be used via slot prop destructuring to associate it with a form element
 * like so:
 *
 * @example
 *   <Label #default="{ labelForId }">
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
        },
        /**
         * Whether to show the label or only its content.
         */
        active: {
            type: Boolean,
            default: true
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
      v-if="active"
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
`;const F=`<!-- The labelForId syntax is used to associate the label with the form field -->
<Label
  #default="{ labelForId }"
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
  #default="{ labelForId }"
  text="Compact label for a field"
  compact
>
  <InputField
    :id="labelForId"
    type="text"
    placeholder="I'm a placeholder"
  />
</Label>
<Label
  :active="false"
  #default="{ labelForId }"
  text="Hidden label for a field"
>
  <InputField
    :id="labelForId"
    type="text"
    placeholder="I'm a placeholder"
  />
</Label>`,w={components:{InputField:f,Label:g,CodeExample:b},data(){return{codeExample:F}},computed:{code(){return y}}},p=o=>(I("data-v-766fed4e"),o=o(),v(),o),L=p(()=>e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("h2",null,"Label"),e("p",null,[l(" Labels for form fields. Beside their default size, they come with a smaller one as well which can be enabled by setting the "),e("code",null,"compact"),l(" prop or "),e("a",{href:"https://vuejs.org/v2/guide/components-edge-cases.html#Dependency-Injection"},"providing"),l("  "),e("code",null,"compactLabels: true"),l(". ")])])],-1)),C={class:"grid-container"},S={class:"grid-item-6"},B={class:"grid-item-6"},E=p(()=>e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null," The components the label is for can also be rendered without the label itself. This allows disabling label use more conveniently in more compact layouts. ")])],-1)),T={class:"grid-container"},$={class:"grid-item-6"},k={class:"grid-container"},z={class:"grid-item-12"};function D(o,N,j,H,m,u){const d=s("InputField"),i=s("Label",!0),r=s("CodeExample");return _(),x("div",null,[e("section",null,[L,e("div",C,[e("div",S,[t(i,{text:"Label for a field"},{default:a(({labelForId:n})=>[t(d,{id:n,type:"text",placeholder:"I'm a placeholder"},null,8,["id"])]),_:1})]),e("div",B,[t(i,{text:"Compact label for a field",compact:""},{default:a(({labelForId:n})=>[t(d,{id:n,type:"text",placeholder:"I'm a placeholder"},null,8,["id"])]),_:1})])]),E,e("div",T,[e("div",$,[t(i,{active:!1,text:"Hidden label for a field"},{default:a(({labelForId:n})=>[t(d,{id:n,type:"text",placeholder:"I'm a placeholder"},null,8,["id"])]),_:1})])])]),e("section",null,[e("div",k,[e("div",z,[t(r,{summary:"Show usage example"},{default:a(()=>[l(c(m.codeExample),1)]),_:1}),t(r,{summary:"Show Label.vue source code"},{default:a(()=>[l(c(u.code),1)]),_:1})])])])])}const M=h(w,[["render",D],["__scopeId","data-v-766fed4e"]]);export{M as default};
