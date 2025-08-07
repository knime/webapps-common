import{C as y}from"./CodeExample-Bs47VSD6.js";import{h,o as m,k as C,w as o,c as x,g as _,b as s,E,l as S,P as b,_ as v,C as k,r as u,d as n,e as d,t as i}from"./index-BVMwdkus.js";const D={class:"content"},B={},a={position:"fixed",width:"500px",backgroundColor:"var(--knime-porcelain)"},I=h({...B,__name:"SideDrawer",props:{isExpanded:{type:Boolean,default:!1},styleOverrides:{default:()=>({...a})}},setup(f){return(e,g)=>(m(),C(b,{name:"slide"},{default:o(()=>[e.isExpanded?(m(),x("div",{key:0,class:"side-drawer",style:_({"--position-common-side-drawer":e.styleOverrides.position??a.position,"--width-common-side-drawer":e.styleOverrides.width??a.width,"--background-color-common-side-drawer":e.styleOverrides.backgroundColor??a.backgroundColor})},[s("div",D,[E(e.$slots,"default",{},void 0,!0)])],4)):S("",!0)]),_:3}))}}),O=v(I,[["__scopeId","data-v-d9c69a2d"]]),M="",q=`<script>
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
`,L=`And a lot more Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Enim, nemo nostrum repellat voluptas, nesciunt sequi velit earum
          iusto iste beatae hic perspiciatis deserunt exercitationem aut
          sapiente quas culpa sint alias.`,N={components:{SideDrawer:O,Button:k,CodeExample:y},data(){return{codeExample:q,lorumIpsumContent:L,isExpanded:!1,isExpandedCustomStyles:!1}},computed:{code(){return M},expandedMessage(){return this.isExpanded?"expanded":"not expanded"},expandedMessageCustomStyles(){return this.isExpandedCustomStyles?"expanded (with custom styles)":"not expanded (so you can't see the custom styles)"}}},T={class:"grid-container"},V={class:"grid-item-12 wrapper"},A={class:"contents-side-drawer"},z={class:"grid-container"},P={class:"grid-item-12 wrapper"},F={class:"contents-side-drawer"},U={class:"grid-container"},Y={class:"grid-item-12"};function j(f,e,g,G,t,l){const r=u("Button"),c=u("SideDrawer",!0),w=u("CodeExample");return m(),x("div",null,[s("section",null,[s("div",T,[s("div",V,[e[5]||(e[5]=s("p",null," Provides an expandable drawer to the right side which can be filled with arbitrary content. On small screens it will take up the whole width. ",-1)),n(r,{primary:"",onClick:e[0]||(e[0]=p=>t.isExpanded=!t.isExpanded)},{default:o(()=>e[4]||(e[4]=[d(" Draw it! ")])),_:1}),s("p",null,"I am "+i(l.expandedMessage),1)])])]),n(c,{class:"side-drawer","is-expanded":t.isExpanded},{default:o(()=>[s("div",A,[e[7]||(e[7]=s("h4",null,"something here",-1)),s("p",null,i(t.lorumIpsumContent),1),n(r,{"with-border":"",onClick:e[1]||(e[1]=p=>t.isExpanded=!1)},{default:o(()=>e[6]||(e[6]=[d(" Close me! ")])),_:1})])]),_:1},8,["is-expanded"]),s("section",null,[s("div",z,[s("div",P,[e[9]||(e[9]=s("p",null,[d(" It is possible to override some styles of the drawer by using the "),s("code",null,"styleOverrides"),d(" prop. ")],-1)),n(r,{primary:"",onClick:e[2]||(e[2]=p=>t.isExpandedCustomStyles=!t.isExpandedCustomStyles)},{default:o(()=>e[8]||(e[8]=[d(" Draw it! ")])),_:1}),s("p",null,"I am "+i(l.expandedMessageCustomStyles),1)])])]),n(c,{class:"side-drawer","is-expanded":t.isExpandedCustomStyles,"style-overrides":{width:"50%"}},{default:o(()=>[s("div",F,[e[11]||(e[11]=s("h4",null,"something here",-1)),s("p",null,i(t.lorumIpsumContent),1),n(r,{"with-border":"",onClick:e[3]||(e[3]=p=>t.isExpandedCustomStyles=!1)},{default:o(()=>e[10]||(e[10]=[d(" Close me! ")])),_:1})])]),_:1},8,["is-expanded"]),s("section",null,[s("div",U,[s("div",Y,[n(w,{summary:"Show usage example"},{default:o(()=>[d(i(t.codeExample),1)]),_:1}),n(w,{summary:"Show SideDrawer.vue source code"},{default:o(()=>[d(i(l.code),1)]),_:1})])])])])}const K=v(N,[["render",j],["__scopeId","data-v-de4d60e2"]]);export{K as default};
