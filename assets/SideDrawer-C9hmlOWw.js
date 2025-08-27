import{C as D}from"./CodeExample-BfZe6d-M.js";import{C as E}from"./Checkboxes-Af5EV1Xn.js";import{C as B}from"./Checkbox-aAjCRE5e.js";import{S as $,a as V}from"./SideDrawerHeader-QV5duiFj.js";import{h,c as u,o as i,d as l,u as o,C as w,j as y,w as r,e as d,k as c,t as v,_,i as g,K as p,b as s,l as m}from"./index-BTIpTClr.js";import{L}from"./LoadingIcon-DBnVzSNW.js";import"./svgWithTitle-C06AYJ4n.js";const H={key:0,ref:"controls",class:"controls"},I={key:1},q={key:1,class:"spacer"},M=h({__name:"SideDrawerControls",props:{actionLabel:{default:"Save changes"},editEnabled:{type:Boolean},disabled:{type:Boolean,default:!1},processing:{type:Boolean,default:!1}},emits:["cancel","save"],setup(S){return(t,a)=>t.editEnabled?(i(),u("div",H,[l(o(w),{class:"cancel","with-border":"",disabled:t.processing,onClick:a[0]||(a[0]=y(f=>t.$emit("cancel"),["prevent"]))},{default:r(()=>a[2]||(a[2]=[d(" Cancel ",-1)])),_:1,__:[2]},8,["disabled"]),l(o(w),{class:"save",primary:"",disabled:t.disabled||t.processing,onClick:a[1]||(a[1]=y(f=>t.$emit("save"),["prevent"]))},{default:r(()=>[t.processing?(i(),c(o(L),{key:0,class:"loading-icon"})):(i(),u("span",I,v(t.actionLabel),1))]),_:1},8,["disabled"])],512)):(i(),u("div",q))}}),N=_(M,[["__scopeId","data-v-46bce110"]]),U={class:"grid-container"},A={class:"grid-item-12 wrapper"},O={class:"info"},T={class:"options"},j={key:0},z={class:"side-drawer-wrapper"},K={class:"contents-side-drawer"},P={class:"code-example"},F={class:"grid-container"},G={class:"grid-item-12"},J=`<script>
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
`,Q=`And a lot more Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Enim, nemo nostrum repellat voluptas, nesciunt sequi velit earum
          iusto iste beatae hic perspiciatis deserunt exercitationem aut
          sapiente quas culpa sint alias.`,R=h({__name:"SideDrawer",setup(S){const t=g(!1),a=g([]),f=p(()=>a.value.includes("customStyles")),C=p(()=>a.value.includes("controls")),b=p(()=>a.value.includes("header")),x=g(!1),k=p(()=>t.value?"expanded":"not expanded");return(W,e)=>(i(),u("div",null,[s("section",null,[s("div",U,[s("div",A,[s("div",O,[e[7]||(e[7]=s("p",null," Provides an expandable drawer to the right side which can be filled with arbitrary content. On small screens it will take up the whole width. ",-1)),l(o(w),{primary:"",onClick:e[0]||(e[0]=n=>t.value=!t.value)},{default:r(()=>e[6]||(e[6]=[d(" Draw it! ",-1)])),_:1,__:[6]}),s("p",null,"I am "+v(k.value),1)]),s("div",T,[e[10]||(e[10]=s("h4",null,"Options",-1)),l(o(E),{modelValue:a.value,"onUpdate:modelValue":e[1]||(e[1]=n=>a.value=n),"possible-values":[{id:"header",text:"Show Header"},{id:"controls",text:"Show Controls"},{id:"customStyles",text:"Use Custom Styles"}]},null,8,["modelValue"]),b.value?(i(),u("div",j,[e[9]||(e[9]=s("h5",null,"Extras",-1)),l(o(B),{modelValue:x.value,"onUpdate:modelValue":e[2]||(e[2]=n=>x.value=n)},{default:r(()=>e[8]||(e[8]=[d("Enable Side Drawer Header",-1)])),_:1,__:[8]},8,["modelValue"])])):m("",!0)])])])]),l(o(V),{class:"side-drawer","is-expanded":t.value,"style-overrides":f.value?{width:"50%"}:void 0},{default:r(()=>[s("div",z,[s("div",null,[b.value?(i(),c(o($),{key:0,title:"My header",description:"This is a description","is-sub-drawer":x.value,onClose:e[3]||(e[3]=n=>t.value=!1)},null,8,["is-sub-drawer"])):m("",!0),s("div",K,[e[12]||(e[12]=s("h4",null,"something here",-1)),s("p",null,v(Q)),!b.value&&!C.value?(i(),c(o(w),{key:0,"with-border":"",onClick:e[4]||(e[4]=n=>t.value=!1)},{default:r(()=>e[11]||(e[11]=[d(" Close me! ",-1)])),_:1,__:[11]})):m("",!0)])]),C.value?(i(),c(o(N),{key:0,class:"side-drawer-controls","edit-enabled":!0,onCancel:e[5]||(e[5]=n=>t.value=!1)})):m("",!0)])]),_:1},8,["is-expanded","style-overrides"]),s("section",P,[s("div",F,[s("div",G,[l(D,{summary:"Show usage example"},{default:r(()=>[d(v(J))]),_:1})])])])]))}}),oe=_(R,[["__scopeId","data-v-77a267ef"]]);export{oe as default};
