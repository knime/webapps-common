import{C as b}from"./CodeExample-DkRoN_fP.js";import{_ as x,o as p,l as g,w as a,c as h,b as e,H as E,m as S,R as D,G as B,r,d as n,e as i,t as c,p as C,f as k}from"./index-CttzsSw2.js";const y={name:"SideDrawer",props:{isExpanded:{type:Boolean,default:!1}}},$={key:0,class:"side-drawer"},I={class:"content"};function q(t,o,u,w,s,d){return p(),g(D,{name:"slide"},{default:a(()=>[u.isExpanded?(p(),h("div",$,[e("div",I,[E(t.$slots,"default",{},void 0,!0)])])):S("",!0)]),_:3})}const N=x(y,[["render",q],["__scopeId","data-v-4a178677"]]),V="",M=`<script>
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
`,A={components:{SideDrawer:N,Button:B,CodeExample:b},data(){return{codeExample:M,isExpanded:!1}},computed:{code(){return V},expandedMessage(){return this.isExpanded?"expanded":"not expanded"}}},l=t=>(C("data-v-29b38b1b"),t=t(),k(),t),L={class:"grid-container"},T={class:"grid-item-12 wrapper"},z=l(()=>e("p",null," Provides an expandable drawer to the right side which can be filled with arbitrary content. On small screens it will take up the whole width. ",-1)),G={class:"contents-side-drawer"},H=l(()=>e("h4",null,"something here",-1)),O=l(()=>e("p",null," And a lot more Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim, nemo nostrum repellat voluptas, nesciunt sequi velit earum iusto iste beatae hic perspiciatis deserunt exercitationem aut sapiente quas culpa sint alias. ",-1)),P={class:"grid-container"},R={class:"grid-item-12"};function j(t,o,u,w,s,d){const m=r("Button"),f=r("SideDrawer",!0),_=r("CodeExample");return p(),h("div",null,[e("section",null,[e("div",L,[e("div",T,[z,n(m,{primary:"",onClick:o[0]||(o[0]=v=>s.isExpanded=!s.isExpanded)},{default:a(()=>[i(" Draw it! ")]),_:1}),e("p",null,"I am "+c(d.expandedMessage),1)])])]),n(f,{class:"side-drawer","is-expanded":s.isExpanded},{default:a(()=>[e("div",G,[H,O,n(m,{"with-border":"",onClick:o[1]||(o[1]=v=>s.isExpanded=!1)},{default:a(()=>[i(" Close me! ")]),_:1})])]),_:1},8,["is-expanded"]),e("section",null,[e("div",P,[e("div",R,[n(_,{summary:"Show usage example"},{default:a(()=>[i(c(s.codeExample),1)]),_:1}),n(_,{summary:"Show SideDrawer.vue source code"},{default:a(()=>[i(c(d.code),1)]),_:1})])])])])}const K=x(A,[["render",j],["__scopeId","data-v-29b38b1b"]]);export{K as default};
