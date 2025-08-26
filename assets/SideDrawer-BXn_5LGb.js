import{C as c}from"./CodeExample-DgrpEoF9.js";import{_ as x,C as w,r as p,c as v,o as f,b as s,d as n,w as o,e as i,t as d}from"./index-C9nwT2dq.js";import{S as g}from"./SideDrawer-JLIBP9mJ.js";const C="",_=`<script>
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
`,E=`And a lot more Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Enim, nemo nostrum repellat voluptas, nesciunt sequi velit earum
          iusto iste beatae hic perspiciatis deserunt exercitationem aut
          sapiente quas culpa sint alias.`,h={components:{SideDrawer:g,Button:w,CodeExample:c},data(){return{codeExample:_,lorumIpsumContent:E,isExpanded:!1,isExpandedCustomStyles:!1}},computed:{code(){return C},expandedMessage(){return this.isExpanded?"expanded":"not expanded"},expandedMessageCustomStyles(){return this.isExpandedCustomStyles?"expanded (with custom styles)":"not expanded (so you can't see the custom styles)"}}},y={class:"grid-container"},S={class:"grid-item-12 wrapper"},b={class:"contents-side-drawer"},D={class:"grid-container"},B={class:"grid-item-12 wrapper"},k={class:"contents-side-drawer"},I={class:"grid-container"},M={class:"grid-item-12"};function q(N,e,V,A,t,a){const r=p("Button"),u=p("SideDrawer",!0),m=p("CodeExample");return f(),v("div",null,[s("section",null,[s("div",y,[s("div",S,[e[5]||(e[5]=s("p",null," Provides an expandable drawer to the right side which can be filled with arbitrary content. On small screens it will take up the whole width. ",-1)),n(r,{primary:"",onClick:e[0]||(e[0]=l=>t.isExpanded=!t.isExpanded)},{default:o(()=>e[4]||(e[4]=[i(" Draw it! ",-1)])),_:1,__:[4]}),s("p",null,"I am "+d(a.expandedMessage),1)])])]),n(u,{class:"side-drawer","is-expanded":t.isExpanded},{default:o(()=>[s("div",b,[e[7]||(e[7]=s("h4",null,"something here",-1)),s("p",null,d(t.lorumIpsumContent),1),n(r,{"with-border":"",onClick:e[1]||(e[1]=l=>t.isExpanded=!1)},{default:o(()=>e[6]||(e[6]=[i(" Close me! ",-1)])),_:1,__:[6]})])]),_:1},8,["is-expanded"]),s("section",null,[s("div",D,[s("div",B,[e[9]||(e[9]=s("p",null,[i(" It is possible to override some styles of the drawer by using the "),s("code",null,"styleOverrides"),i(" prop. ")],-1)),n(r,{primary:"",onClick:e[2]||(e[2]=l=>t.isExpandedCustomStyles=!t.isExpandedCustomStyles)},{default:o(()=>e[8]||(e[8]=[i(" Draw it! ",-1)])),_:1,__:[8]}),s("p",null,"I am "+d(a.expandedMessageCustomStyles),1)])])]),n(u,{class:"side-drawer","is-expanded":t.isExpandedCustomStyles,"style-overrides":{width:"50%"}},{default:o(()=>[s("div",k,[e[11]||(e[11]=s("h4",null,"something here",-1)),s("p",null,d(t.lorumIpsumContent),1),n(r,{"with-border":"",onClick:e[3]||(e[3]=l=>t.isExpandedCustomStyles=!1)},{default:o(()=>e[10]||(e[10]=[i(" Close me! ",-1)])),_:1,__:[10]})])]),_:1},8,["is-expanded"]),s("section",null,[s("div",I,[s("div",M,[n(m,{summary:"Show usage example"},{default:o(()=>[i(d(t.codeExample),1)]),_:1}),n(m,{summary:"Show SideDrawer.vue source code"},{default:o(()=>[i(d(a.code),1)]),_:1})])])])])}const P=x(h,[["render",q],["__scopeId","data-v-de4d60e2"]]);export{P as default};
