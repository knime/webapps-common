import{C as v}from"./CodeExample-58ee106e.js";import{_ as m,o as l,c,u as k,n as C,r as u,F as x,g as w,j as h,w as r,e as s,t as d,y,l as T,b as a,d as p}from"./index-2e4a1f3e.js";const I={props:{clickable:{type:Boolean,default:!1}}};function A(e,f,t,_,g,n){return l(),c("span",{class:C(["tag",{clickable:t.clickable}])},[k(e.$slots,"default",{},void 0,!0)],2)}const M=m(I,[["render",A],["__scopeId","data-v-3c45e8a6"]]);const $=5,L={components:{Tag:M},props:{numberOfInitialTags:{type:Number,default:$},tags:{type:Array,default:()=>[]},clickable:{type:Boolean,default:!1}},emits:["click"],data(){return{displayAll:!1}},computed:{tagsToDisplay(){return this.displayAll?this.tags:this.tags.slice(0,this.numberOfInitialTags)},hasMoreTags(){return!this.displayAll&&this.tags.length>this.numberOfInitialTags}},methods:{onClick(e){this.clickable&&this.$emit("click",e)},onShowMore(){this.displayAll=!0}}},S={key:0,class:"wrapper"};function B(e,f,t,_,g,n){const o=u("Tag");return t.tags.length?(l(),c("div",S,[(l(!0),c(x,null,w(n.tagsToDisplay,(i,b)=>(l(),h(o,{key:b,clickable:t.clickable,onClick:y(q=>n.onClick(i),["prevent"])},{default:r(()=>[s(d(i)+" ",1),k(e.$slots,"icon",{},void 0,!0)]),_:2},1032,["clickable","onClick"]))),128)),n.hasMoreTags?(l(),h(o,{key:0,class:"more-tags",onClick:y(n.onShowMore,["prevent"])},{default:r(()=>[s(" +"+d(t.tags.length-t.numberOfInitialTags),1)]),_:1},8,["onClick"])):T("",!0)])):T("",!0)}const O=m(L,[["render",B],["__scopeId","data-v-ed4d133d"]]),D=`<script>
import Tag from './Tag.vue';

const defaultInitialTagCount = 5;

export default {
    components: {
        Tag
    },
    props: {
        /**
         * Maximum number of tags to display initially.
         * If more tags are present, they will be expandable via a '+' button.
         */
        numberOfInitialTags: {
            type: Number,
            default: defaultInitialTagCount
        },
        /**
         * List of tags (Strings) to display.
         * @type Array<String>
         */
        tags: {
            type: Array,
            default: () => []
        },
        /**
         * If the tags should emit events and have hover + cursor styles.
         */
        clickable: {
            type: Boolean,
            default: false
        }
    },
    emits: ['click'],
    data() {
        return {
            displayAll: false
        };
    },
    computed: {
        tagsToDisplay() {
            if (this.displayAll) {
                return this.tags;
            }
            let displayTags = this.tags.slice(0, this.numberOfInitialTags);
            return displayTags;
        },
        hasMoreTags() {
            return !this.displayAll && this.tags.length > this.numberOfInitialTags;
        }
    },
    methods: {
        onClick(tag) {
            if (this.clickable) {
                this.$emit('click', tag);
            }
        },
        onShowMore() {
            this.displayAll = true;
        }
    }
};
<\/script>

<template>
  <div
    v-if="tags.length"
    class="wrapper"
  >
    <Tag
      v-for="(tag, index) in tagsToDisplay"
      :key="index"
      :clickable="clickable"
      @click.prevent="onClick(tag)"
    >
      {{ tag }}
      <slot name="icon" />
    </Tag><!-- no whitespace
 --><Tag
      v-if="hasMoreTags"
      class="more-tags"
      @click.prevent="onShowMore"
    >
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
`,E=`<TagList
  :tags="['Apple', 'Banana', 'Guanábana', 'Papaya', 'Mango', 'Granadilla']"
  :number-of-initial-tags="3"
  clickable
  @click="onTagClick"
/>`,N={components:{TagList:O,CodeExample:v},data(){return{codeExample:E}},computed:{code(){return D}},methods:{onTagClick(e){alert(`clicked tag: ${e}`)}}},G=a("div",{class:"grid-container"},[a("div",{class:"grid-item-12"},[a("h2",null,"TagList"),a("p",null,[s(" Displays a list of tags with support for only showing a maximal number of tags via the "),a("code",null,"numberOfInitialTags"),s(" prop. Tags can be clickable by enabling the "),a("code",null,"clickable"),s(" prop. ")])])],-1),V={class:"grid-container"},F={class:"grid-item-12"},P={class:"grid-container"},j={class:"grid-item-12"};function z(e,f,t,_,g,n){const o=u("TagList",!0),i=u("CodeExample");return l(),c("div",null,[a("section",null,[G,a("div",V,[a("div",F,[p(o,{tags:["Apple","Banana","Guanábana","Papaya","Mango","Granadilla"],"number-of-initial-tags":3,clickable:"",onClick:n.onTagClick},null,8,["onClick"])])])]),a("section",null,[a("div",P,[a("div",j,[p(i,{summary:"Show usage example"},{default:r(()=>[s(d(g.codeExample),1)]),_:1}),p(i,{summary:"Show TagList.vue source code"},{default:r(()=>[s(d(n.code),1)]),_:1})])])])])}const K=m(N,[["render",z]]);export{K as default};
