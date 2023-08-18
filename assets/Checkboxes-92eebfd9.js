import{C as m}from"./CodeExample-b09c2fe6.js";import{C as p}from"./Checkboxes-005fb9f4.js";import{_ as h,r as c,o as x,c as f,b as e,d as l,t as a,w as r,e as t}from"./index-24ff27c3.js";import"./Checkbox-4c7eb094.js";const v=`<script>
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
`,b=`<Checkboxes
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
/>`,k={components:{Checkboxes:p,CodeExample:m},data(){return{codeExample:b,selected:["bar","baz"]}},computed:{code(){return v}}},g=e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[t(" A list of choices to choose of. It emits an "),e("code",null,"input"),t(" event when something is selected, and it has a "),e("code",null,"value"),t(". ")])])],-1),y={class:"grid-container"},V={class:"grid-item-5"},_={class:"grid-item-5"},C={class:"grid-item-2"},w={class:"grid-container"},z={class:"grid-item-12"};function B(E,o,S,A,n,u){const i=c("Checkboxes",!0),d=c("CodeExample");return x(),f("div",null,[e("section",null,[g,e("div",y,[e("div",V,[l(i,{modelValue:n.selected,"onUpdate:modelValue":o[0]||(o[0]=s=>n.selected=s),placeholder:"Select stuff here!","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",_,[l(i,{modelValue:n.selected,"onUpdate:modelValue":o[1]||(o[1]=s=>n.selected=s),alignment:"vertical",placeholder:"Select stuff here vertical!","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",C,"selected ids: "+a(n.selected),1)])]),e("section",null,[e("div",w,[e("div",z,[l(d,{summary:"Show usage example"},{default:r(()=>[t(a(n.codeExample),1)]),_:1}),l(d,{summary:"Show Checkboxes.vue source code"},{default:r(()=>[t(a(u.code),1)]),_:1})])])])])}const P=h(k,[["render",B]]);export{P as default};
