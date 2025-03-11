import{C as p}from"./CodeExample-Bki-bWtx.js";import{_ as h,J as u,r as c,o as m,c as _,b as e,d as s,w as t,e as n,t as l,p as f,f as g}from"./index-Duh7ZtNg.js";const w="",v=`
  <Carousel>
      <Statistics class="wrapper" />
  </Carousel>

<style>
  .wrapper {
    display: inline-flex; /* or inline-block */
    padding-left: 20px;
    margin-left: -20px; /* values might need to be adjusted according to content */

    & .child-elements:last-child {
      border-right: 15px solid transparent;
      /* might need to be set on last child of content to ensure that all the content is scrolled into the viewport*/
    }
  }
/* overwrite shadow color */
  section {
    & :deep(.shadow-wrapper::before) {
      background-image: linear-gradient(270deg, hsla(0, 0%, 100%, 0) 0%, var(--knime-white) 100%);
    }

    & :deep(.shadow-wrapper::after) {
      background-image: linear-gradient(90deg, hsla(0, 0%, 100%, 0) 0%, var(--knime-white) 100%);
    }
  }
</style>`,x={components:{Carousel:u,CodeExample:p},data(){return{carouselCode:w,codeExample:v}}},o=a=>(f("data-v-d3691c63"),a=a(),g(),a),C={class:"grid-container"},b={class:"grid-item-12"},S=o(()=>e("p",null," The carousel can fit items of any size and creates shadows on each side of the viewport to indicate that scrolling is possible. When one side of the items inside of the carousel is reached the shadow should disappear. ",-1)),k=o(()=>e("p",null," The color of the shadow can be adjusted to the background by setting the .shadow-color's before and after elements background-image (example below) ",-1)),y=o(()=>e("p",null,"See usage example for more CSS adjustments.",-1)),E=o(()=>e("div",{class:"wrapper"},[e("div",{class:"card card1"}),e("div",{class:"card card2"}),e("div",{class:"card card3"}),e("div",{class:"card card1"}),e("div",{class:"card card2"}),e("div",{class:"card card3"})],-1));function I(a,j,B,N,r,T){const i=c("Carousel",!0),d=c("CodeExample");return m(),_("section",null,[e("div",C,[e("div",b,[S,k,y,e("section",null,[s(i,null,{default:t(()=>[E]),_:1})]),s(d,{summary:"Show usage example"},{default:t(()=>[n(l(r.codeExample),1)]),_:1}),s(d,{summary:"Show Carousel.vue source code"},{default:t(()=>[n(l(r.carouselCode),1)]),_:1})])])])}const z=h(x,[["render",I],["__scopeId","data-v-d3691c63"]]);export{z as default};
