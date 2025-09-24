import{C as g}from"./CodeExample-La__JCd8.js";import{C as _}from"./Checkboxes-Bzk1JjEE.js";import{C as y}from"./Checkbox-DDjjyswv.js";import{S as k,a as D,b as E}from"./SideDrawerHeader-Bwb5WgtY.js";import{h as B,i as v,K as d,c as f,o as r,b as t,d as n,w as l,e as u,u as o,C as h,t as w,l as p,k as x,_ as V}from"./index-CdRYFHYy.js";import"./LoadingIcon-Cy1iXoab.js";import"./svgWithTitle-Q7LDh9E5.js";const H={class:"grid-container"},$={class:"grid-item-12 wrapper"},q={class:"info"},N={class:"options"},I={key:0},M={class:"side-drawer-wrapper"},U={class:"contents-side-drawer"},A={class:"code-example"},L={class:"grid-container"},O={class:"grid-item-12"},T=`<script>
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
          sapiente quas culpa sint alias.`,K=B({__name:"SideDrawer",setup(P){const s=v(!1),i=v([]),C=d(()=>i.value.includes("customStyles")),b=d(()=>i.value.includes("controls")),m=d(()=>i.value.includes("header")),c=v(!1),S=d(()=>s.value?"expanded":"not expanded");return(j,e)=>(r(),f("div",null,[t("section",null,[t("div",H,[t("div",$,[t("div",q,[e[7]||(e[7]=t("p",null," Provides an expandable drawer to the right side which can be filled with arbitrary content. On small screens it will take up the whole width. ",-1)),n(o(h),{primary:"",onClick:e[0]||(e[0]=a=>s.value=!s.value)},{default:l(()=>e[6]||(e[6]=[u(" Draw it! ",-1)])),_:1,__:[6]}),t("p",null,"I am "+w(S.value),1)]),t("div",N,[e[10]||(e[10]=t("h4",null,"Options",-1)),n(o(_),{modelValue:i.value,"onUpdate:modelValue":e[1]||(e[1]=a=>i.value=a),"possible-values":[{id:"header",text:"Show Header"},{id:"controls",text:"Show Controls"},{id:"customStyles",text:"Use Custom Styles"}]},null,8,["modelValue"]),m.value?(r(),f("div",I,[e[9]||(e[9]=t("h5",null,"Extras",-1)),n(o(y),{modelValue:c.value,"onUpdate:modelValue":e[2]||(e[2]=a=>c.value=a)},{default:l(()=>e[8]||(e[8]=[u("Enable Side Drawer Header",-1)])),_:1,__:[8]},8,["modelValue"])])):p("",!0)])])])]),n(o(E),{class:"side-drawer","is-expanded":s.value,"style-overrides":C.value?{width:"50%"}:void 0},{default:l(()=>[t("div",M,[t("div",null,[m.value?(r(),x(o(k),{key:0,title:"My header",description:"This is a description","is-sub-drawer":c.value,onClose:e[3]||(e[3]=a=>s.value=!1)},null,8,["is-sub-drawer"])):p("",!0),t("div",U,[e[12]||(e[12]=t("h4",null,"something here",-1)),t("p",null,w(z)),!m.value&&!b.value?(r(),x(o(h),{key:0,"with-border":"",onClick:e[4]||(e[4]=a=>s.value=!1)},{default:l(()=>e[11]||(e[11]=[u(" Close me! ",-1)])),_:1,__:[11]})):p("",!0)])]),b.value?(r(),x(o(D),{key:0,class:"side-drawer-controls","edit-enabled":!0,onCancel:e[5]||(e[5]=a=>s.value=!1)})):p("",!0)])]),_:1},8,["is-expanded","style-overrides"]),t("section",A,[t("div",L,[t("div",O,[n(g,{summary:"Show usage example"},{default:l(()=>[u(w(T))]),_:1})])])])]))}}),Y=V(K,[["__scopeId","data-v-beea121d"]]);export{Y as default};
