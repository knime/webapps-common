import{C as g}from"./CodeExample-7b407f07.js";import{_ as x,o as l,j as E,w as s,c as h,b as e,u as b,l as y,T as S,r as p,d as i,e as o,t as c,p as D,f as B}from"./index-0daf2d62.js";import{B as k}from"./Button-476898be.js";const C={props:{isExpanded:{type:Boolean,default:!1}}},$={key:0,class:"side-drawer"},I={class:"content"};function z(n,a,m,w,t,r){return l(),E(S,{name:"slide"},{default:s(()=>[m.isExpanded?(l(),h("div",$,[e("div",I,[b(n.$slots,"default",{},void 0,!0)])])):y("",!0)]),_:3})}const T=x(C,[["render",z],["__scopeId","data-v-99a995f9"]]),q=`<script>
/*
 * Expandable sideDrawer component displaying arbitrary components as content.
 */

export default {
    props: {
        isExpanded: {
            type: Boolean,
            default: false
        }
    }
};
<\/script>

<template>
  <Transition name="slide">
    <div
      v-if="isExpanded"
      class="side-drawer"
    >
      <div class="content">
        <slot />
      </div>
    </div>
  </Transition>
</template>

<style lang="postcss" scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.15s ease-in-out;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(calc(100% + 10px)); /* extra 10px to hide box shadow when collapsed */
}

.side-drawer {
  position: fixed;
  top: 0;
  width: 500px;
  right: 0;
  bottom: 0;
  box-shadow: -3px 0 7px 0 var(--knime-gray-dark-semi);
  background: var(--knime-porcelain);
  z-index: var(--z-index-common-side-drawer, 60);

  @media only screen and (max-width: 900px) {
    z-index: var(--z-index-common-mobile-side-drawer, 60);
  }

  & .content {
    height: 100%;
  }

  @media only screen and (max-width: 900px) {
    width: 100%;
  }
}
</style>
`;const N=`<script>
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
`,V={components:{SideDrawer:T,Button:k,CodeExample:g},data(){return{codeExample:N,isExpanded:!1}},computed:{code(){return q},expandedMessage(){return this.isExpanded?"expanded":"not expanded"}}},d=n=>(D("data-v-19639d62"),n=n(),B(),n),M={class:"grid-container"},A={class:"grid-item-12 wrapper"},L=d(()=>e("h2",null,"SideDrawer",-1)),j=d(()=>e("p",null," Provides an expandable drawer to the right side which can be filled with arbitrary content. On small screens it will take up the whole width. ",-1)),O={class:"contents-side-drawer"},P=d(()=>e("h4",null,"something here",-1)),X=d(()=>e("p",null," And a lot more Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim, nemo nostrum repellat voluptas, nesciunt sequi velit earum iusto iste beatae hic perspiciatis deserunt exercitationem aut sapiente quas culpa sint alias. ",-1)),F={class:"grid-container"},G={class:"grid-item-12"};function H(n,a,m,w,t,r){const u=p("Button"),v=p("SideDrawer",!0),_=p("CodeExample");return l(),h("div",null,[e("section",null,[e("div",M,[e("div",A,[L,j,i(u,{primary:"",onClick:a[0]||(a[0]=f=>t.isExpanded=!t.isExpanded)},{default:s(()=>[o(" Draw it! ")]),_:1}),e("p",null,"I am "+c(r.expandedMessage),1)])])]),i(v,{class:"side-drawer","is-expanded":t.isExpanded},{default:s(()=>[e("div",O,[P,X,i(u,{"with-border":"",onClick:a[1]||(a[1]=f=>t.isExpanded=!1)},{default:s(()=>[o(" Close me! ")]),_:1})])]),_:1},8,["is-expanded"]),e("section",null,[e("div",F,[e("div",G,[i(_,{summary:"Show usage example"},{default:s(()=>[o(c(t.codeExample),1)]),_:1}),i(_,{summary:"Show SideDrawer.vue source code"},{default:s(()=>[o(c(r.code),1)]),_:1})])])])])}const R=x(V,[["render",H],["__scopeId","data-v-19639d62"]]);export{R as default};
