import{C as y}from"./CodeExample-DHrvlT2F.js";import{i as g,o as _,l as S,w as o,c as x,h as C,b as e,H as E,m as b,R as k,_ as v,G as D,r as m,d,e as n,t as i,p as B,f as I}from"./index-yOhbdS1w.js";const O={class:"content"},M={},l={position:"fixed",width:"500px",backgroundColor:"var(--knime-porcelain)"},q=g({...M,__name:"SideDrawer",props:{isExpanded:{type:Boolean,default:!1},styleOverrides:{default:()=>({...l})}},setup(a){return(s,f)=>(_(),S(k,{name:"slide"},{default:o(()=>[s.isExpanded?(_(),x("div",{key:0,class:"side-drawer",style:C({"--position-common-side-drawer":s.styleOverrides.position??l.position,"--width-common-side-drawer":s.styleOverrides.width??l.width,"--background-color-common-side-drawer":s.styleOverrides.backgroundColor??l.backgroundColor})},[e("div",O,[E(s.$slots,"default",{},void 0,!0)])],4)):b("",!0)]),_:3}))}}),L=v(q,[["__scopeId","data-v-d9c69a2d"]]),N="",T=`<script>
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
`,V=`And a lot more Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Enim, nemo nostrum repellat voluptas, nesciunt sequi velit earum
          iusto iste beatae hic perspiciatis deserunt exercitationem aut
          sapiente quas culpa sint alias.`,A={components:{SideDrawer:L,Button:D,CodeExample:y},data(){return{codeExample:T,lorumIpsumContent:V,isExpanded:!1,isExpandedCustomStyles:!1}},computed:{code(){return N},expandedMessage(){return this.isExpanded?"expanded":"not expanded"},expandedMessageCustomStyles(){return this.isExpandedCustomStyles?"expanded (with custom styles)":"not expanded (so you can't see the custom styles)"}}},p=a=>(B("data-v-de4d60e2"),a=a(),I(),a),z={class:"grid-container"},F={class:"grid-item-12 wrapper"},G=p(()=>e("p",null," Provides an expandable drawer to the right side which can be filled with arbitrary content. On small screens it will take up the whole width. ",-1)),H={class:"contents-side-drawer"},P=p(()=>e("h4",null,"something here",-1)),R={class:"grid-container"},U={class:"grid-item-12 wrapper"},Y=p(()=>e("p",null,[n(" It is possible to override some styles of the drawer by using the "),e("code",null,"styleOverrides"),n(" prop. ")],-1)),j={class:"contents-side-drawer"},J=p(()=>e("h4",null,"something here",-1)),K={class:"grid-container"},Q={class:"grid-item-12"};function W(a,s,f,X,t,c){const r=m("Button"),h=m("SideDrawer",!0),w=m("CodeExample");return _(),x("div",null,[e("section",null,[e("div",z,[e("div",F,[G,d(r,{primary:"",onClick:s[0]||(s[0]=u=>t.isExpanded=!t.isExpanded)},{default:o(()=>[n(" Draw it! ")]),_:1}),e("p",null,"I am "+i(c.expandedMessage),1)])])]),d(h,{class:"side-drawer","is-expanded":t.isExpanded},{default:o(()=>[e("div",H,[P,e("p",null,i(t.lorumIpsumContent),1),d(r,{"with-border":"",onClick:s[1]||(s[1]=u=>t.isExpanded=!1)},{default:o(()=>[n(" Close me! ")]),_:1})])]),_:1},8,["is-expanded"]),e("section",null,[e("div",R,[e("div",U,[Y,d(r,{primary:"",onClick:s[2]||(s[2]=u=>t.isExpandedCustomStyles=!t.isExpandedCustomStyles)},{default:o(()=>[n(" Draw it! ")]),_:1}),e("p",null,"I am "+i(c.expandedMessageCustomStyles),1)])])]),d(h,{class:"side-drawer","is-expanded":t.isExpandedCustomStyles,"style-overrides":{width:"50%"}},{default:o(()=>[e("div",j,[J,e("p",null,i(t.lorumIpsumContent),1),d(r,{"with-border":"",onClick:s[3]||(s[3]=u=>t.isExpandedCustomStyles=!1)},{default:o(()=>[n(" Close me! ")]),_:1})])]),_:1},8,["is-expanded"]),e("section",null,[e("div",K,[e("div",Q,[d(w,{summary:"Show usage example"},{default:o(()=>[n(i(t.codeExample),1)]),_:1}),d(w,{summary:"Show SideDrawer.vue source code"},{default:o(()=>[n(i(c.code),1)]),_:1})])])])])}const ee=v(A,[["render",W],["__scopeId","data-v-de4d60e2"]]);export{ee as default};
