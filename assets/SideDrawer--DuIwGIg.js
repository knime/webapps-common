import{C as g}from"./CodeExample-CRVpy_lk.js";import{_ as x,o as p,j as E,w as a,c as h,b as e,x as S,l as B,B as b,r,d as n,e as d,t as c,p as D,f as C}from"./index-1E1C3O_a.js";import{B as k}from"./Button-CE4HzRw7.js";const y={name:"SideDrawer",props:{isExpanded:{type:Boolean,default:!1}}},$={key:0,class:"side-drawer"},I={class:"content"};function q(t,o,u,w,s,i){return p(),E(b,{name:"slide"},{default:a(()=>[u.isExpanded?(p(),h("div",$,[e("div",I,[S(t.$slots,"default",{},void 0,!0)])])):B("",!0)]),_:3})}const N=x(y,[["render",q],["__scopeId","data-v-4a178677"]]),V="",M=`<script>
import SideDrawer from '~/webapps-common/ui/components/SideDrawer.vue';
import Button from '~/webapps-common/ui/components/Button.vue';

export default {
    components: {
        SideDrawer,
        Button,
    },
    data() {
        return {
            isExpanded: false
        };
    },
    computed: {
        expandedMessage() {
            return this.isExpanded ? 'expanded' : 'not expanded';
        }
    }

};
<\/script>

<template>
  <SideDrawer
      class="side-drawer"
      :is-expanded="isExpanded"
    >
      <div class="contents-side-drawer">
        <h4>something here</h4>
        <p>And a lot more Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim, nemo nostrum repellat voluptas,
          nesciunt sequi velit earum iusto iste beatae hic perspiciatis deserunt exercitationem aut sapiente quas culpa
          sint alias.</p>
        <Button
          with-border
          @click="isExpanded = false"
        >
          Close me!
        </Button>
      </div>
    </SideDrawer>
</template>

<style lang="postcss" scoped>

h4 {
  margin: 0;
}

.contents-side-drawer {
  padding: 30px;
  box-sizing: border-box;
  background-color: var(--knime-white);
  height: 100%;
}

</style>
`,A={components:{SideDrawer:N,Button:k,CodeExample:g},data(){return{codeExample:M,isExpanded:!1}},computed:{code(){return V},expandedMessage(){return this.isExpanded?"expanded":"not expanded"}}},l=t=>(D("data-v-12d03cdf"),t=t(),C(),t),L={class:"grid-container"},T={class:"grid-item-12 wrapper"},j=l(()=>e("p",null," Provides an expandable drawer to the right side which can be filled with arbitrary content. On small screens it will take up the whole width. ",-1)),z={class:"contents-side-drawer"},O=l(()=>e("h4",null,"something here",-1)),P=l(()=>e("p",null," And a lot more Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim, nemo nostrum repellat voluptas, nesciunt sequi velit earum iusto iste beatae hic perspiciatis deserunt exercitationem aut sapiente quas culpa sint alias. ",-1)),F={class:"grid-container"},G={class:"grid-item-12"};function H(t,o,u,w,s,i){const m=r("Button"),f=r("SideDrawer",!0),_=r("CodeExample");return p(),h("div",null,[e("section",null,[e("div",L,[e("div",T,[j,n(m,{primary:"",onClick:o[0]||(o[0]=v=>s.isExpanded=!s.isExpanded)},{default:a(()=>[d(" Draw it! ")]),_:1}),e("p",null,"I am "+c(i.expandedMessage),1)])])]),n(f,{class:"side-drawer","is-expanded":s.isExpanded},{default:a(()=>[e("div",z,[O,P,n(m,{"with-border":"",onClick:o[1]||(o[1]=v=>s.isExpanded=!1)},{default:a(()=>[d(" Close me! ")]),_:1})])]),_:1},8,["is-expanded"]),e("section",null,[e("div",F,[e("div",G,[n(_,{summary:"Show usage example"},{default:a(()=>[d(c(s.codeExample),1)]),_:1}),n(_,{summary:"Show SideDrawer.vue source code"},{default:a(()=>[d(c(i.code),1)]),_:1})])])])])}const R=x(A,[["render",H],["__scopeId","data-v-12d03cdf"]]);export{R as default};
