import{C as _}from"./CodeExample-ba2cb043.js";import{_ as p,o as m,c as f,b as e,u as b,n as w,r as h,d as i,w as c,e as l,t as g}from"./index-0dfc83cb.js";const x={props:{id:{type:String,default:null},name:{type:String,default:null},modelValue:{type:Boolean,default:!1},labelSize:{type:String,default:"regular"}},emits:["update:modelValue"],methods:{onChange(r){let{checked:n}=r.target;consola.trace("ToggleSwitch value changed to",n),this.$emit("update:modelValue",n)},isChecked(){return this.$refs.input.checked}}},k=["id","name","checked"];function y(r,n,o,v,t,d){return m(),f("label",{class:w(["toggle",o.labelSize])},[e("input",{id:o.id,ref:"input",name:o.name,type:"checkbox",checked:o.modelValue,onChange:n[0]||(n[0]=(...a)=>d.onChange&&d.onChange(...a))},null,40,k),e("span",null,[b(r.$slots,"default",{},void 0,!0)])],2)}const S=p(x,[["render",y],["__scopeId","data-v-f388e344"]]),V=`<script>
export default {
  props: {
    id: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
    /**
     * Controls the size of the label
     * supported values:
     * - regular
     * - large
     */
    labelSize: {
      type: String,
      default: "regular",
    },
  },
  emits: ["update:modelValue"],
  methods: {
    onChange($event) {
      /**
       * Fired when the toggle switch changes.
       *
       * @event input
       * @type {Boolean}
       */
      let { checked } = $event.target;
      consola.trace("ToggleSwitch value changed to", checked);
      this.$emit("update:modelValue", checked);
    },
    isChecked() {
      return this.$refs.input.checked;
    },
  },
};
<\/script>

<template>
  <label :class="['toggle', labelSize]">
    <input
      :id="id"
      ref="input"
      :name="name"
      type="checkbox"
      :checked="modelValue"
      @change="onChange"
    />
    <span>
      <slot />
    </span>
  </label>
</template>

<style lang="postcss" scoped>
.toggle {
  display: inline-block;
  position: relative;
  isolation: isolate;
  padding: 3px 0 3px 37px;
  max-width: 100%;
  cursor: pointer;
  vertical-align: middle;

  & input {
    user-select: none;
    display: flex;
    opacity: 0;
    position: absolute;
    width: 0;
    height: 0;

    & + span {
      display: inline-flex;
      align-items: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    & + span::before {
      display: inline-block;
      position: absolute;
      content: "";
      border-radius: 50px;
      transition: all 0.3s ease;
      transform-origin: 20% center;
      width: 27px;
      background: var(--theme-toggle-switch-background-color);
      border: 1px solid var(--knime-dove-gray);
      height: 10px;
      left: 0;
    }

    & + span::after {
      position: absolute;
      display: block;
      content: "";
      transition:
        all 0.3s ease,
        width 0.1s ease-in,
        left 0.3s ease;
      width: 14px;
      height: 14px;
      left: 0;
      border-radius: 9999px;
      background-color: var(--theme-toggle-switch-background-color);
      border: 1px solid var(--knime-dove-gray);
    }

    &:checked {
      & + span::before {
        background-color: var(--theme-toggle-switch-background-color-checked);
        border-color: var(--knime-masala);
      }

      & + span::after {
        left: 27px;
        transform: translateX(-100%);
        border-color: var(--knime-masala);
      }
    }

    &:hover {
      & + span::after {
        background-color: var(--theme-toggle-switch-background-color-hover);
      }
    }

    &:focus {
      & + span::after {
        background-color: var(--theme-toggle-switch-background-color-focus);
      }
    }

    &:active {
      & + span::after {
        width: 17px;
        background-color: var(--theme-toggle-switch-background-color-active);
      }
    }
  }

  /* label size */
  &.regular {
    --regular-height: 18px;

    font-size: 13px;
    font-weight: 300;
    line-height: var(--regular-height);

    & > span {
      min-height: var(--regular-height);
    }
  }

  &.large {
    --large-height: 20px;

    font-family: var(--theme-text-bold-font-family);
    color: var(--theme-text-bold-color);
    font-size: 16px;
    font-weight: 700;
    line-height: var(--large-height);

    & > span {
      min-height: var(--large-height);
      max-width: 100%;
    }
  }
}
</style>
`,C=`<ToggleSwitch />
<ToggleSwitch value="true" />`,T={components:{ToggleSwitch:S,CodeExample:_},data(){return{codeExample:C,selected:!1,selectedLarge:!0}},computed:{code(){return V}}},z=e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[l(" A toggle switch component. It acts as a form element, so it emits an "),e("code",null,"input"),l(" event when (de-)selected, and it has a "),e("code",null,"value"),l(". ")])])],-1),B={class:"grid-container"},E={class:"grid-item-6"},I=e("br",null,null,-1),L=e("p",null,"Without label:",-1),N={class:"grid-item-6"},U=e("br",null,null,-1),$={class:"grid-container"},A={class:"grid-item-12"};function D(r,n,o,v,t,d){const a=h("ToggleSwitch",!0),u=h("CodeExample");return m(),f("div",null,[e("section",null,[z,e("div",B,[e("div",E,[i(a,{modelValue:t.selected,"onUpdate:modelValue":n[0]||(n[0]=s=>t.selected=s)},{default:c(()=>[l(" I want cookies! ")]),_:1},8,["modelValue"]),I,i(a,{modelValue:t.selectedLarge,"onUpdate:modelValue":n[1]||(n[1]=s=>t.selectedLarge=s),"label-size":"large"},{default:c(()=>[l(" I want larger cookies! ")]),_:1},8,["modelValue"]),L,i(a,{modelValue:t.selected,"onUpdate:modelValue":n[2]||(n[2]=s=>t.selected=s)},null,8,["modelValue"])]),e("div",N,[l(" value: "+g(t.selected),1),U,l(" value: "+g(t.selectedLarge),1)])])]),e("section",null,[e("div",$,[e("div",A,[i(u,{summary:"Show usage example"},{default:c(()=>[l(g(t.codeExample),1)]),_:1}),i(u,{summary:"Show ToggleSwitch.vue source code"},{default:c(()=>[l(g(d.code),1)]),_:1})])])])])}const X=p(T,[["render",D]]);export{X as default};
