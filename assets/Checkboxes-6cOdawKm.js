import{C as m}from"./CodeExample-FV2ERm66.js";import{C as p}from"./Checkboxes-oQu9F9V2.js";import{_ as h,r as c,o as x,c as f,b as e,d as l,t as d,w as r,e as s}from"./index-c-jRl9ul.js";import"./Checkbox-hcnitjxD.js";const b=`<script>
import Checkbox from "../forms/Checkbox.vue";

export default {
  components: {
    Checkbox,
  },
  props: {
    /**
     * List of possible values. Each item must have an \`id\` and a \`text\` property.
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
          (item) => item.hasOwnProperty("id") && item.hasOwnProperty("text"),
        );
      },
    },
    /**
     * Controls the alignment
     */
    alignment: {
      type: String,
      default: "horizontal",
      validator(value) {
        return ["horizontal", "vertical"].includes(value);
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    /**
     * selected value (which is a list of ids of entries)
     */
    modelValue: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["update:modelValue"],
  methods: {
    onUpdateModelValue(value, toggled) {
      let checkedValue = Array.from(this.modelValue);
      if (toggled) {
        if (checkedValue.indexOf(value) === -1) {
          checkedValue.push(value);
        }
      } else {
        checkedValue = checkedValue.filter((x) => x !== value);
      }
      consola.trace("Checkboxes value changed to", checkedValue);

      /**
       * Fired when the selection changes.
       *
       * @event input
       * @type {Array}
       */
      this.$emit("update:modelValue", checkedValue);
    },
    /**
     * Is at least one checkbox checked?
     * @returns {boolean}
     */
    hasSelection() {
      return this.$refs.boxes.some((x) => x.isChecked());
    },
  },
};
<\/script>

<template>
  <div :class="['checkboxes', alignment]">
    <Checkbox
      v-for="item of possibleValues"
      ref="boxes"
      :key="\`checkboxes-\${item.id}\`"
      :model-value="modelValue.indexOf(item.id) > -1"
      :title="item.text"
      :disabled="disabled"
      class="box"
      @update:model-value="onUpdateModelValue(item.id, $event)"
    >
      {{ item.text }}
    </Checkbox>
  </div>
</template>

<style scoped lang="postcss">
.checkboxes {
  overflow: hidden;

  &.horizontal {
    display: flex;
    flex-flow: row wrap;

    & :deep(label) {
      text-overflow: ellipsis;

      &:not(:last-of-type) {
        padding-right: 12px;
      }
    }
  }

  /* root of Checkbox which is a <label> */
  & .box {
    /* display block makes it vertical by default */
    display: block;
    overflow: hidden;
    width: max-content;
  }
}
</style>
`,v=`<Checkboxes
  v-model="selected"
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
/>`,k={components:{Checkboxes:p,CodeExample:m},data(){return{codeExample:v,selected:["bar","baz"]}},computed:{code(){return b}}},_=e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[s(" A list of choices to choose of. It emits an "),e("code",null,"input"),s(" event when something is selected, and it has a "),e("code",null,"value"),s(". ")])])],-1),V={class:"grid-container"},g={class:"grid-item-5"},y=e("span",null,"Horizontal",-1),C={class:"grid-item-5"},w=e("span",null,"Vertical",-1),z={class:"grid-item-5"},B=e("span",null,"Disabled",-1),E={class:"grid-item-2"},S={class:"grid-container"},A={class:"grid-item-12"};function F(U,t,O,D,n,u){const a=c("Checkboxes",!0),i=c("CodeExample");return x(),f("div",null,[e("section",null,[_,e("div",V,[e("div",g,[y,l(a,{modelValue:n.selected,"onUpdate:modelValue":t[0]||(t[0]=o=>n.selected=o),placeholder:"Select stuff here!","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",C,[w,l(a,{modelValue:n.selected,"onUpdate:modelValue":t[1]||(t[1]=o=>n.selected=o),alignment:"vertical",placeholder:"Select stuff here vertical!","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",z,[B,l(a,{modelValue:n.selected,"onUpdate:modelValue":t[2]||(t[2]=o=>n.selected=o),disabled:"","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",E,"selected ids: "+d(n.selected),1)])]),e("section",null,[e("div",S,[e("div",A,[l(i,{summary:"Show usage example"},{default:r(()=>[s(d(n.codeExample),1)]),_:1}),l(i,{summary:"Show Checkboxes.vue source code"},{default:r(()=>[s(d(u.code),1)]),_:1})])])])])}const M=h(k,[["render",F]]);export{M as default};
