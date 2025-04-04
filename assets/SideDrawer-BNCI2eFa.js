import{C as f}from"./CodeExample-CqrZuIia.js";import{i as y,o as m,l as S,w as o,c as x,h as g,b as e,H as C,m as E,R as b,_ as w,G as D,r as u,d,e as i,t as n,p as B,f as k}from"./index-d57f9Tmz.js";const I={class:"content"},M={},O=y({...M,__name:"SideDrawer",props:{isExpanded:{type:Boolean,default:!1},styleOverrides:{default:()=>({position:"fixed",width:"500px"})}},setup(a){return(s,v)=>(m(),S(b,{name:"slide"},{default:o(()=>[s.isExpanded?(m(),x("div",{key:0,class:"side-drawer",style:g({"--position-common-side-drawer":s.styleOverrides.position,"--width-common-side-drawer":s.styleOverrides.width})},[e("div",I,[C(s.$slots,"default",{},void 0,!0)])],4)):E("",!0)]),_:3}))}}),q=w(O,[["__scopeId","data-v-966ea7b5"]]),N="",V=`<script>
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
`,z=`And a lot more Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Enim, nemo nostrum repellat voluptas, nesciunt sequi velit earum
          iusto iste beatae hic perspiciatis deserunt exercitationem aut
          sapiente quas culpa sint alias.`,A={components:{SideDrawer:q,Button:D,CodeExample:f},data(){return{codeExample:V,lorumIpsumContent:z,isExpanded:!1,isExpandedCustomStyles:!1}},computed:{code(){return N},expandedMessage(){return this.isExpanded?"expanded":"not expanded"},expandedMessageCustomStyles(){return this.isExpandedCustomStyles?"expanded (with custom styles)":"not expanded (so you can't see the custom styles)"}}},l=a=>(B("data-v-de4d60e2"),a=a(),k(),a),L={class:"grid-container"},T={class:"grid-item-12 wrapper"},G=l(()=>e("p",null," Provides an expandable drawer to the right side which can be filled with arbitrary content. On small screens it will take up the whole width. ",-1)),H={class:"contents-side-drawer"},P=l(()=>e("h4",null,"something here",-1)),R={class:"grid-container"},j={class:"grid-item-12 wrapper"},F=l(()=>e("p",null,[i(" It is possible to override some styles of the drawer by using the "),e("code",null,"styleOverrides"),i(" prop. ")],-1)),J={class:"contents-side-drawer"},K=l(()=>e("h4",null,"something here",-1)),Q={class:"grid-container"},U={class:"grid-item-12"};function W(a,s,v,X,t,p){const r=u("Button"),_=u("SideDrawer",!0),h=u("CodeExample");return m(),x("div",null,[e("section",null,[e("div",L,[e("div",T,[G,d(r,{primary:"",onClick:s[0]||(s[0]=c=>t.isExpanded=!t.isExpanded)},{default:o(()=>[i(" Draw it! ")]),_:1}),e("p",null,"I am "+n(p.expandedMessage),1)])])]),d(_,{class:"side-drawer","is-expanded":t.isExpanded},{default:o(()=>[e("div",H,[P,e("p",null,n(t.lorumIpsumContent),1),d(r,{"with-border":"",onClick:s[1]||(s[1]=c=>t.isExpanded=!1)},{default:o(()=>[i(" Close me! ")]),_:1})])]),_:1},8,["is-expanded"]),e("section",null,[e("div",R,[e("div",j,[F,d(r,{primary:"",onClick:s[2]||(s[2]=c=>t.isExpandedCustomStyles=!t.isExpandedCustomStyles)},{default:o(()=>[i(" Draw it! ")]),_:1}),e("p",null,"I am "+n(p.expandedMessageCustomStyles),1)])])]),d(_,{class:"side-drawer","is-expanded":t.isExpandedCustomStyles,"style-overrides":{width:"50%"}},{default:o(()=>[e("div",J,[K,e("p",null,n(t.lorumIpsumContent),1),d(r,{"with-border":"",onClick:s[3]||(s[3]=c=>t.isExpandedCustomStyles=!1)},{default:o(()=>[i(" Close me! ")]),_:1})])]),_:1},8,["is-expanded"]),e("section",null,[e("div",Q,[e("div",U,[d(h,{summary:"Show usage example"},{default:o(()=>[i(n(t.codeExample),1)]),_:1}),d(h,{summary:"Show SideDrawer.vue source code"},{default:o(()=>[i(n(p.code),1)]),_:1})])])])])}const $=w(A,[["render",W],["__scopeId","data-v-de4d60e2"]]);export{$ as default};
