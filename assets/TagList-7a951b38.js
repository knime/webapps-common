import{C as b}from"./CodeExample-ff021a53.js";import{o as s,c as r,b as a,_,r as d,u as v,j as h,l as f,n as C,F as x,g as w,w as g,e as i,t as p,y as T,d as m}from"./index-02e57c95.js";const A={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},I=a("path",{d:"m4.923 16 8.923 8.308L27.538 8"},null,-1),M=[I];function B(e,l){return s(),r("svg",A,M)}const L={render:B};const O={components:{CheckIcon:L},props:{clickable:{type:Boolean,default:!1},active:{type:Boolean,default:!1}}};function S(e,l,n,y,u,t){const c=d("CheckIcon");return s(),r("span",{class:C(["tag",{clickable:n.clickable,active:n.active}])},[v(e.$slots,"default",{},void 0,!0),n.clickable&&n.active?(s(),h(c,{key:0,class:"checkmark"})):f("",!0)],2)}const $=_(O,[["render",S],["__scopeId","data-v-abae0a5e"]]);const D=5,E={components:{Tag:$},props:{numberOfInitialTags:{type:Number,default:D},tags:{type:Array,default:()=>[]},activeTags:{type:Array,default:()=>[]},clickable:{type:Boolean,default:!1}},emits:["click"],data(){return{displayAll:!1}},computed:{tagsToDisplay(){let e=this.tags;return this.displayAll||(e=this.tags.slice(0,this.numberOfInitialTags)),e.map(l=>({isActive:this.activeTags.includes(l),name:l}))},hasMoreTags(){return!this.displayAll&&this.tags.length>this.numberOfInitialTags}},hasMoreTags(){return!this.displayAll&&this.tags.length>this.numberOfInitialTags},methods:{onClick(e){this.clickable&&this.$emit("click",e)},onShowMore(){this.displayAll=!0}}},N={key:0,class:"wrapper"};function G(e,l,n,y,u,t){const c=d("Tag");return n.tags.length?(s(),r("div",N,[(s(!0),r(x,null,w(t.tagsToDisplay,(o,k)=>(s(),h(c,{key:k,active:o.isActive,clickable:n.clickable,onClick:T(R=>t.onClick(o.name),["prevent"])},{default:g(()=>[i(p(o.name)+" ",1),v(e.$slots,"icon",{},void 0,!0)]),_:2},1032,["active","clickable","onClick"]))),128)),t.hasMoreTags?(s(),h(c,{key:0,class:"more-tags",onClick:T(t.onShowMore,["prevent"])},{default:g(()=>[i(" +"+p(n.tags.length-n.numberOfInitialTags),1)]),_:1},8,["onClick"])):f("",!0)])):f("",!0)}const P=_(E,[["render",G],["__scopeId","data-v-b5e63502"]]),V=`<script>
import Tag from "./Tag.vue";

const defaultInitialTagCount = 5;

export default {
  components: {
    Tag,
  },
  props: {
    /**
     * Maximum number of tags to display initially.
     * If more tags are present, they will be expandable via a '+' button.
     */
    numberOfInitialTags: {
      type: Number,
      default: defaultInitialTagCount,
    },
    /**
     * List of tags (Strings) to display.
     * @type Array<String>
     */
    tags: {
      type: Array,
      default: () => [],
    },
    /**
     * List of active tags (Strings) to display.
     * @type Array<String>
     */
    activeTags: {
      type: Array,
      default: () => [],
    },
    /**
     * If the tags should emit events and have hover + cursor styles.
     */
    clickable: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["click"],
  data() {
    return {
      displayAll: false,
    };
  },
  computed: {
    tagsToDisplay() {
      let displayTags = this.tags;
      if (!this.displayAll) {
        displayTags = this.tags.slice(0, this.numberOfInitialTags);
      }
      return displayTags.map((tag) => ({
        isActive: this.activeTags.includes(tag),
        name: tag,
      }));
    },
    hasMoreTags() {
      return !this.displayAll && this.tags.length > this.numberOfInitialTags;
    },
  },
  hasMoreTags() {
    return !this.displayAll && this.tags.length > this.numberOfInitialTags;
  },
  methods: {
    onClick(tag) {
      if (this.clickable) {
        this.$emit("click", tag);
      }
    },
    onShowMore() {
      this.displayAll = true;
    },
  },
};
<\/script>

<template>
  <div v-if="tags.length" class="wrapper">
    <Tag
      v-for="(tag, index) in tagsToDisplay"
      :key="index"
      :active="tag.isActive"
      :clickable="clickable"
      @click.prevent="onClick(tag.name)"
    >
      {{ tag.name }}
      <slot name="icon" /> </Tag
    ><!-- no whitespace
    --><Tag v-if="hasMoreTags" class="more-tags" @click.prevent="onShowMore">
      +{{ tags.length - numberOfInitialTags }}
    </Tag>
  </div>
</template>

<style lang="postcss" scoped>
.wrapper {
  display: flex;
  flex-wrap: wrap;
}

.more-tags {
  cursor: pointer;
}
</style>
`,j=`<TagList
  :tags="['Apple', 'Banana', 'Guanábana', 'Papaya', 'Mango', 'Granadilla']"
  :number-of-initial-tags="3"
  clickable
  activeTags="['Banana', 'Papaya']"
  @click="onTagClick"
/>`,F={components:{TagList:P,CodeExample:b},data(){return{codeExample:j}},computed:{code(){return V}},methods:{onTagClick(e){alert(`clicked tag: ${e}`)}}},z=a("div",{class:"grid-container"},[a("div",{class:"grid-item-12"},[a("h2",null,"TagList"),a("p",null,[i(" Displays a list of tags with support for only showing a maximal number of tags via the "),a("code",null,"numberOfInitialTags"),i(" prop. Optionally it is possible to display active tags. Tags can be clickable by enabling the "),a("code",null,"clickable"),i(" prop. ")])])],-1),q={class:"grid-container"},H={class:"grid-item-12"},J={class:"grid-container"},K={class:"grid-item-12"};function Q(e,l,n,y,u,t){const c=d("TagList",!0),o=d("CodeExample");return s(),r("div",null,[a("section",null,[z,a("div",q,[a("div",H,[m(c,{tags:["Apple","Banana","Guanábana","Papaya","Mango","Granadilla"],"number-of-initial-tags":3,clickable:"","active-tags":"['Banana', 'Papaya']",onClick:t.onTagClick},null,8,["onClick"])])])]),a("section",null,[a("div",J,[a("div",K,[m(o,{summary:"Show usage example"},{default:g(()=>[i(p(u.codeExample),1)]),_:1}),m(o,{summary:"Show TagList.vue source code"},{default:g(()=>[i(p(t.code),1)]),_:1})])])])])}const X=_(F,[["render",Q]]);export{X as default};
