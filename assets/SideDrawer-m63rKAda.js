import{C}from"./CodeExample-tX4Zf7wt.js";import{S as v,a as g}from"./SideDrawerHeader-CyUASrNz.js";import{h as _,i as w,K as x,c as S,o as D,b as s,d as t,w as d,e as a,u as i,C as o,t as n,_ as k}from"./index-fPNLXK0t.js";const E={class:"grid-container"},$={class:"grid-item-12 wrapper"},B={class:"contents-side-drawer"},I={class:"grid-container"},M={class:"grid-item-12 wrapper"},H={class:"contents-side-drawer"},q={class:"grid-container"},W={class:"grid-item-12 wrapper"},N={class:"contents-side-drawer"},P={class:"grid-container"},T={class:"grid-item-12 wrapper"},V={class:"contents-side-drawer"},A={class:"grid-container"},L={class:"grid-item-12"},O=`<script>
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
`,f=`And a lot more Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Enim, nemo nostrum repellat voluptas, nesciunt sequi velit earum
          iusto iste beatae hic perspiciatis deserunt exercitationem aut
          sapiente quas culpa sint alias.`,z=_({__name:"SideDrawer",setup(K){const u=w(!1),p=w(!1),m=w(!1),l=w(!1),h=x(()=>u.value?"expanded":"not expanded"),c=x(()=>p.value?"expanded (with custom styles)":"not expanded (so you can't see the custom styles)"),b=x(()=>m.value?"expanded (with header)":"not expanded (so you can't see the header)"),y=x(()=>l.value?"expanded (with sub drawer header)":"not expanded (so you can't see the sub drawer header)");return(j,e)=>(D(),S("div",null,[s("section",null,[s("div",E,[s("div",$,[e[10]||(e[10]=s("p",null," Provides an expandable drawer to the right side which can be filled with arbitrary content. On small screens it will take up the whole width. ",-1)),t(i(o),{primary:"",onClick:e[0]||(e[0]=r=>u.value=!u.value)},{default:d(()=>e[9]||(e[9]=[a(" Draw it! ",-1)])),_:1,__:[9]}),s("p",null,"I am "+n(h.value),1)])])]),t(i(v),{class:"side-drawer","is-expanded":u.value},{default:d(()=>[s("div",B,[e[12]||(e[12]=s("h4",null,"something here",-1)),s("p",null,n(f)),t(i(o),{"with-border":"",onClick:e[1]||(e[1]=r=>u.value=!1)},{default:d(()=>e[11]||(e[11]=[a(" Close me! ",-1)])),_:1,__:[11]})])]),_:1},8,["is-expanded"]),s("section",null,[s("div",I,[s("div",M,[e[14]||(e[14]=s("p",null,[a(" It is possible to override some styles of the drawer by using the "),s("code",null,"styleOverrides"),a(" prop. ")],-1)),t(i(o),{primary:"",onClick:e[2]||(e[2]=r=>p.value=!p.value)},{default:d(()=>e[13]||(e[13]=[a(" Draw it! ",-1)])),_:1,__:[13]}),s("p",null,"I am "+n(c.value),1)])])]),t(i(v),{class:"side-drawer","is-expanded":p.value,"style-overrides":{width:"50%"}},{default:d(()=>[s("div",H,[e[16]||(e[16]=s("h4",null,"something here",-1)),s("p",null,n(f)),t(i(o),{"with-border":"",onClick:e[3]||(e[3]=r=>p.value=!1)},{default:d(()=>e[15]||(e[15]=[a(" Close me! ",-1)])),_:1,__:[15]})])]),_:1},8,["is-expanded"]),s("section",null,[s("div",q,[s("div",W,[e[18]||(e[18]=s("p",null,"Provides an expandable drawer with header",-1)),t(i(o),{primary:"",onClick:e[4]||(e[4]=r=>m.value=!m.value)},{default:d(()=>e[17]||(e[17]=[a(" Draw it! ",-1)])),_:1,__:[17]}),s("p",null,"I am "+n(b.value),1)])])]),t(i(v),{class:"side-drawer","is-expanded":m.value,"style-overrides":{width:"50%"}},{default:d(()=>[t(i(g),{title:"My header",description:"This is a description"}),s("div",N,[e[20]||(e[20]=s("h4",null,"something here",-1)),s("p",null,n(f)),t(i(o),{"with-border":"",onClick:e[5]||(e[5]=r=>m.value=!1)},{default:d(()=>e[19]||(e[19]=[a(" Close me! ",-1)])),_:1,__:[19]})])]),_:1},8,["is-expanded"]),s("section",null,[s("div",P,[s("div",T,[e[22]||(e[22]=s("p",null,"Provides an expandable drawer with sub drawer header",-1)),t(i(o),{primary:"",onClick:e[6]||(e[6]=r=>l.value=!l.value)},{default:d(()=>e[21]||(e[21]=[a(" Draw it! ",-1)])),_:1,__:[21]}),s("p",null,"I am "+n(y.value),1)])])]),t(i(v),{class:"side-drawer","is-expanded":l.value,"style-overrides":{width:"50%"}},{default:d(()=>[t(i(g),{title:"My header",description:"This is a description",onClose:e[7]||(e[7]=r=>l.value=!1),"is-sub-drawer":!0}),s("div",V,[e[24]||(e[24]=s("h4",null,"something here",-1)),s("p",null,n(f)),t(i(o),{"with-border":"",onClick:e[8]||(e[8]=r=>l.value=!1)},{default:d(()=>e[23]||(e[23]=[a(" Close me! ",-1)])),_:1,__:[23]})])]),_:1},8,["is-expanded"]),s("section",null,[s("div",A,[s("div",L,[t(C,{summary:"Show usage example"},{default:d(()=>[a(n(O))]),_:1})])])])]))}}),Q=k(z,[["__scopeId","data-v-03e20caa"]]);export{Q as default};
