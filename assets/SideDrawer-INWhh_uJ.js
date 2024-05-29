import{C as g}from"./CodeExample-oz6H8A5_.js";import{_ as h,o as c,j as E,w as s,c as w,b as e,x as b,l as S,O as y,r,d as i,e as o,t as p,p as B,f as k}from"./index-099kMGOp.js";import{B as D}from"./Button-ek8rrPgX.js";const C={props:{isExpanded:{type:Boolean,default:!1}}},$={key:0,class:"side-drawer"},I={class:"content"};function z(n,a,m,_,t,d){return c(),E(y,{name:"slide"},{default:s(()=>[m.isExpanded?(c(),w("div",$,[e("div",I,[b(n.$slots,"default",{},void 0,!0)])])):S("",!0)]),_:3})}const q=h(C,[["render",z],["__scopeId","data-v-51c6059d"]]),N=`<script>
/*
 * Expandable sideDrawer component displaying arbitrary components as content.
 */

export default {
  props: {
    isExpanded: {
      type: Boolean,
      default: false,
    },
  },
};
<\/script>

<template>
  <Transition name="slide">
    <div v-if="isExpanded" class="side-drawer">
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
  transform: translateX(
    calc(100% + 10px)
  ); /* extra 10px to hide box shadow when collapsed */
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

  @media only screen and (width <= 900px) {
    z-index: var(--z-index-common-mobile-side-drawer, 60);
  }

  & .content {
    height: 100%;
  }

  @media only screen and (width <= 900px) {
    width: 100%;
  }
}
</style>
`,T=`<script>
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
`,V={components:{SideDrawer:q,Button:D,CodeExample:g},data(){return{codeExample:T,isExpanded:!1}},computed:{code(){return N},expandedMessage(){return this.isExpanded?"expanded":"not expanded"}}},l=n=>(B("data-v-054e4a24"),n=n(),k(),n),M={class:"grid-container"},A={class:"grid-item-12 wrapper"},L=l(()=>e("p",null," Provides an expandable drawer to the right side which can be filled with arbitrary content. On small screens it will take up the whole width. ",-1)),O={class:"contents-side-drawer"},j=l(()=>e("h4",null,"something here",-1)),P=l(()=>e("p",null," And a lot more Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim, nemo nostrum repellat voluptas, nesciunt sequi velit earum iusto iste beatae hic perspiciatis deserunt exercitationem aut sapiente quas culpa sint alias. ",-1)),X={class:"grid-container"},F={class:"grid-item-12"};function G(n,a,m,_,t,d){const u=r("Button"),f=r("SideDrawer",!0),x=r("CodeExample");return c(),w("div",null,[e("section",null,[e("div",M,[e("div",A,[L,i(u,{primary:"",onClick:a[0]||(a[0]=v=>t.isExpanded=!t.isExpanded)},{default:s(()=>[o(" Draw it! ")]),_:1}),e("p",null,"I am "+p(d.expandedMessage),1)])])]),i(f,{class:"side-drawer","is-expanded":t.isExpanded},{default:s(()=>[e("div",O,[j,P,i(u,{"with-border":"",onClick:a[1]||(a[1]=v=>t.isExpanded=!1)},{default:s(()=>[o(" Close me! ")]),_:1})])]),_:1},8,["is-expanded"]),e("section",null,[e("div",X,[e("div",F,[i(x,{summary:"Show usage example"},{default:s(()=>[o(p(t.codeExample),1)]),_:1}),i(x,{summary:"Show SideDrawer.vue source code"},{default:s(()=>[o(p(d.code),1)]),_:1})])])])])}const Q=h(V,[["render",G],["__scopeId","data-v-054e4a24"]]);export{Q as default};
