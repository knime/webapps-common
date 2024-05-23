import{C as b}from"./CodeExample-paad31RA.js";import{_ as y,U as C,r,o as s,c as g,x as v,j as h,l as f,n as A,F as I,g as x,w as d,e as i,t as p,q as k,b as e,d as m}from"./index-I9l7b4pS.js";const w={components:{CheckIcon:C},props:{clickable:{type:Boolean,default:!1},active:{type:Boolean,default:!1}}};function M(a,o,n,T,u,t){const l=r("CheckIcon");return s(),g("span",{class:A(["tag",{clickable:n.clickable,active:n.active}])},[v(a.$slots,"default",{},void 0,!0),n.clickable&&n.active?(s(),h(l,{key:0,class:"checkmark"})):f("",!0)],2)}const B=y(w,[["render",M],["__scopeId","data-v-abae0a5e"]]),O=5,S={components:{Tag:B},props:{numberOfInitialTags:{type:Number,default:O},tags:{type:Array,default:()=>[]},activeTags:{type:Array,default:()=>[]},clickable:{type:Boolean,default:!1}},emits:["click"],data(){return{displayAll:!1}},computed:{tagsToDisplay(){let a=this.tags;return this.displayAll||(a=this.tags.slice(0,this.numberOfInitialTags)),a.map(o=>({isActive:this.activeTags.includes(o),name:o}))},hasMoreTags(){return!this.displayAll&&this.tags.length>this.numberOfInitialTags}},hasMoreTags(){return!this.displayAll&&this.tags.length>this.numberOfInitialTags},methods:{onClick(a){this.clickable&&this.$emit("click",a)},onShowMore(){this.displayAll=!0}}},L={key:0,class:"wrapper"};function $(a,o,n,T,u,t){const l=r("Tag");return n.tags.length?(s(),g("div",L,[(s(!0),g(I,null,x(t.tagsToDisplay,(c,_)=>(s(),h(l,{key:_,active:c.isActive,clickable:n.clickable,onClick:k(U=>t.onClick(c.name),["prevent"])},{default:d(()=>[i(p(c.name)+" ",1),v(a.$slots,"icon",{},void 0,!0)]),_:2},1032,["active","clickable","onClick"]))),128)),t.hasMoreTags?(s(),h(l,{key:0,class:"more-tags",onClick:k(t.onShowMore,["prevent"])},{default:d(()=>[i(" +"+p(n.tags.length-n.numberOfInitialTags),1)]),_:1},8,["onClick"])):f("",!0)])):f("",!0)}const D=y(S,[["render",$],["__scopeId","data-v-b5e63502"]]),E=`<script>
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
`,N=`<TagList
  :tags="['Apple', 'Banana', 'Guanábana', 'Papaya', 'Mango', 'Granadilla']"
  :number-of-initial-tags="3"
  clickable
  activeTags="['Banana', 'Papaya']"
  @click="onTagClick"
/>`,G={components:{TagList:D,CodeExample:b},data(){return{codeExample:N}},computed:{code(){return E}},methods:{onTagClick(a){alert(`clicked tag: ${a}`)}}},P=e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[i(" Displays a list of tags with support for only showing a maximal number of tags via the "),e("code",null,"numberOfInitialTags"),i(" prop. Optionally it is possible to display active tags. Tags can be clickable by enabling the "),e("code",null,"clickable"),i(" prop. ")])])],-1),V={class:"grid-container"},F={class:"grid-item-12"},j={class:"grid-container"},q={class:"grid-item-12"};function z(a,o,n,T,u,t){const l=r("TagList",!0),c=r("CodeExample");return s(),g("div",null,[e("section",null,[P,e("div",V,[e("div",F,[m(l,{tags:["Apple","Banana","Guanábana","Papaya","Mango","Granadilla"],"number-of-initial-tags":3,clickable:"","active-tags":"['Banana', 'Papaya']",onClick:t.onTagClick},null,8,["onClick"])])])]),e("section",null,[e("div",j,[e("div",q,[m(c,{summary:"Show usage example"},{default:d(()=>[i(p(u.codeExample),1)]),_:1}),m(c,{summary:"Show TagList.vue source code"},{default:d(()=>[i(p(t.code),1)]),_:1})])])])])}const K=y(G,[["render",z]]);export{K as default};
