import{C as u}from"./CodeExample-VXL4AQMY.js";import{_ as m,I as f,r,o as g,c as x,b as e,d as t,w as a,e as l,t as c,p as I,f as _}from"./index-WZR4XGnU.js";import{L as v}from"./Label-8X28oURx.js";const y=`<script>
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
    largeLabels: {
      // provided e.g. by Fieldset.vue
      default: false,
    },
  },
  props: {
    generateId: {
      type: Boolean,
      default: true,
    },
    idPrefix: {
      type: String,
      default: "comp",
    },
    text: {
      default: "",
      type: String,
    },
    /**
     * smaller font size and margin
     */
    large: {
      type: Boolean,
      default: false,
    },
    /**
     * Whether to show the label or only its content.
     */
    active: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["labelForId"],
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
    isLarge() {
      return this.large || this.largeLabels;
    },
  },
  beforeCreate() {
    labelForId += 1;
    this.labelForId = labelForId;
  },
  mounted() {
    this.$emit("labelForId", this.labelFor);
  },
};
<\/script>

<template>
  <div class="label-wrapper">
    <label
      v-if="active"
      :id="labelId"
      :for="labelFor"
      :class="['label-text', { large: isLarge }]"
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
  font-weight: 500;
  font-size: 13px;
  font-family: var(--theme-text-medium-font-family);
  color: var(--theme-text-medium-color);
  line-height: 18px;
  display: block;
  width: max-content;
  margin-bottom: 3px;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 100%;

  &.large {
    font-weight: 700;
    font-size: 16px;
    font-family: var(--theme-text-bold-font-family);
    color: var(--theme-text-bold-color);
    line-height: 20px;
    margin-bottom: 10px;
  }
}
</style>
`,F=`<!-- The labelForId syntax is used to associate the label with the form field -->
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
  text="Large label for a field"
  large
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
</Label>`,L={components:{InputField:f,Label:v,CodeExample:u},data(){return{codeExample:F}},computed:{code(){return y}}},p=o=>(I("data-v-8237dfe1"),o=o(),_(),o),w=p(()=>e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[l(" Labels for form fields. Beside their default size, they come with a larger one as well which can be enabled by setting the "),e("code",null,"large"),l(" prop or "),e("a",{href:"https://vuejs.org/v2/guide/components-edge-cases.html#Dependency-Injection"},"providing"),l("  "),e("code",null,"largeLabels: true"),l(". ")])])],-1)),S={class:"grid-container"},B={class:"grid-item-6"},C={class:"grid-item-6"},$=p(()=>e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null," The components the label is for can also be rendered without the label itself. This allows disabling label use more conveniently in more compact layouts. ")])],-1)),E={class:"grid-container"},T={class:"grid-item-6"},k={class:"grid-container"},z={class:"grid-item-12"};function D(o,N,j,H,b,h){const i=r("InputField"),d=r("Label",!0),s=r("CodeExample");return g(),x("div",null,[e("section",null,[w,e("div",S,[e("div",B,[t(d,{text:"Label for a field"},{default:a(({labelForId:n})=>[t(i,{id:n,type:"text",placeholder:"I'm a placeholder"},null,8,["id"])]),_:1})]),e("div",C,[t(d,{text:"Large label for a field",large:""},{default:a(({labelForId:n})=>[t(i,{id:n,type:"text",placeholder:"I'm a placeholder"},null,8,["id"])]),_:1})])]),$,e("div",E,[e("div",T,[t(d,{active:!1,text:"Hidden label for a field"},{default:a(({labelForId:n})=>[t(i,{id:n,type:"text",placeholder:"I'm a placeholder"},null,8,["id"])]),_:1})])])]),e("section",null,[e("div",k,[e("div",z,[t(s,{summary:"Show usage example"},{default:a(()=>[l(c(b.codeExample),1)]),_:1}),t(s,{summary:"Show Label.vue source code"},{default:a(()=>[l(c(h.code),1)]),_:1})])])])])}const M=m(L,[["render",D],["__scopeId","data-v-8237dfe1"]]);export{M as default};
